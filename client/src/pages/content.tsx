import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@/lib/wallets.tsx';
import { ContentItem } from '@/lib/types';
import { getIPFSGatewayURL } from '@/lib/ipfs';
import { verifyContent } from '@/lib/solana';
import { requestContent } from '@/lib/cambrian';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Content() {
  const { connected, connect } = useWallet();
  const [searchTerm, setSearchTerm] = useState('');
  const [contentHash, setContentHash] = useState('');
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get all public content
  const { 
    data: contentData,
    isLoading: contentLoading,
    error: contentError 
  } = useQuery({
    queryKey: ['/api/content/public'],
  });

  // Handler for content retrieval by hash
  const handleRetrieveContent = async () => {
    if (!contentHash) return;
    
    setIsLoading(true);
    try {
      // Request content from nearest NCN node
      const result = await requestContent(contentHash);
      
      if (result.success && result.ipfsHash) {
        // Fetch content details from our API
        const response = await fetch(`/api/content/${contentHash}`);
        const data = await response.json();
        
        if (data.content) {
          setSelectedContent(data.content);
        } else {
          // If content details not found, create a simple object with the hash
          setSelectedContent({
            id: 0,
            userId: 0,
            title: "Unknown Content",
            description: "Content details not found in database",
            contentHash: contentHash,
            contentType: "unknown",
            ipfsHash: result.ipfsHash,
            arweaveHash: null,
            solanaTransaction: null,
            size: 0,
            isPublic: true,
            isPremium: false,
            metadata: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      } else {
        throw new Error("Content not found in the network");
      }
    } catch (error) {
      console.error("Error retrieving content:", error);
      alert("Failed to retrieve content. Please check the hash and try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handler for content verification
  const handleVerifyContent = async () => {
    if (!selectedContent) return;
    
    setIsVerifying(true);
    try {
      const result = await verifyContent(selectedContent.contentHash);
      setVerificationResult(result);
    } catch (error) {
      console.error("Error verifying content:", error);
      setVerificationResult({ isVerified: false, error: "Verification failed" });
    } finally {
      setIsVerifying(false);
    }
  };

  // Filter content based on search term
  const filteredContent = contentData ? 
    contentData.filter((item: ContentItem) => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    ) : [];

  // Function to render content preview based on content type
  const renderContentPreview = (content: ContentItem) => {
    const ipfsUrl = getIPFSGatewayURL(content.ipfsHash);
    
    if (content.contentType.startsWith('image/')) {
      return (
        <div className="flex justify-center p-4">
          <img 
            src={ipfsUrl} 
            alt={content.title} 
            className="max-h-96 rounded-lg"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/400x300?text=Image+Loading+Error";
            }} 
          />
        </div>
      );
    } else if (content.contentType.startsWith('video/')) {
      return (
        <div className="flex justify-center p-4">
          <video 
            controls 
            className="max-h-96 rounded-lg"
            onError={(e) => {
              e.currentTarget.textContent = "Error loading video";
            }}
          >
            <source src={ipfsUrl} type={content.contentType} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else if (content.contentType.startsWith('audio/')) {
      return (
        <div className="flex justify-center p-4">
          <audio 
            controls 
            className="w-full"
            onError={(e) => {
              e.currentTarget.textContent = "Error loading audio";
            }}
          >
            <source src={ipfsUrl} type={content.contentType} />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    } else if (content.contentType === 'application/pdf') {
      return (
        <div className="flex justify-center p-4">
          <iframe 
            src={`${ipfsUrl}#toolbar=0`} 
            className="w-full h-96 rounded-lg"
            title={content.title}
            onError={(e) => {
              e.currentTarget.srcdoc = "<p>Error loading PDF</p>";
            }}
          />
        </div>
      );
    } else {
      return (
        <div className="flex justify-center items-center p-4 h-64 bg-nebula-dark/30 rounded-lg">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-light mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-slate-300">Preview not available for this content type</p>
            <p className="text-sm text-slate-400 mt-2">{content.contentType}</p>
            <Button 
              className="mt-4 bg-secondary hover:bg-secondary-dark"
              onClick={() => window.open(ipfsUrl, '_blank')}
            >
              Open in New Tab
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Retrieval</h1>
        <p className="text-slate-400">
          Browse and retrieve content from the decentralized network with built-in preview and verification.
        </p>
      </div>
      
      <Tabs defaultValue="explore" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 max-w-md mb-4">
          <TabsTrigger value="explore">Explore Content</TabsTrigger>
          <TabsTrigger value="retrieve">Retrieve by Hash</TabsTrigger>
        </TabsList>
        
        <TabsContent value="explore" className="space-y-6">
          <div className="max-w-md">
            <Input
              placeholder="Search for content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-nebula-dark/50 border-slate-700"
            />
          </div>
          
          {contentLoading ? (
            <div className="flex justify-center items-center p-12">
              <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-medium mb-2">No Content Found</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                {searchTerm ? `No content matching "${searchTerm}"` : "There is no public content available yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map((item: ContentItem) => (
                <Card 
                  key={item.id} 
                  className="glass overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 border border-slate-700/50 cursor-pointer"
                  onClick={() => setSelectedContent(item)}
                >
                  <div className="relative h-40 bg-gradient-to-br from-primary/20 to-secondary/10">
                    {item.contentType.startsWith('image/') ? (
                      <img 
                        src={getIPFSGatewayURL(item.ipfsHash)} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/400x200?text=Image+Loading+Error";
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {item.contentType.startsWith('video/') ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          ) : item.contentType.startsWith('audio/') ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          )}
                        </svg>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary"></div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-slate-400 text-sm mb-2 line-clamp-2">{item.description}</p>
                    )}
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>Size: {formatSize(item.size)}</span>
                      <span>Type: {formatContentType(item.contentType)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="retrieve" className="space-y-6">
          <Card className="glass border-slate-700/50">
            <CardHeader>
              <CardTitle>Retrieve Content by Hash</CardTitle>
              <CardDescription>
                Enter the content hash to retrieve it from the decentralized network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter content hash..."
                  value={contentHash}
                  onChange={(e) => setContentHash(e.target.value)}
                  className="bg-nebula-dark/50 border-slate-700 flex-1"
                />
                <Button 
                  className="bg-primary hover:bg-primary-dark whitespace-nowrap"
                  onClick={handleRetrieveContent}
                  disabled={isLoading || !contentHash}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    "Retrieve Content"
                  )}
                </Button>
              </div>
              
              <div className="mt-4 text-sm text-slate-400">
                <p>Content will be fetched from the nearest NCN node for optimal performance.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Content Preview Modal */}
      {selectedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" onClick={() => setSelectedContent(null)}></div>
          <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-auto glass rounded-2xl border border-slate-700 shadow-2xl">
            <div className="sticky top-0 z-10 glass border-b border-slate-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">{selectedContent.title}</h2>
              <button 
                onClick={() => setSelectedContent(null)}
                className="text-slate-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              {/* Content preview */}
              {renderContentPreview(selectedContent)}
              
              {/* Content metadata */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Content Details</h3>
                  
                  {selectedContent.description && (
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Description</p>
                      <p>{selectedContent.description}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Content Type</p>
                      <p>{formatContentType(selectedContent.contentType)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Size</p>
                      <p>{formatSize(selectedContent.size)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Uploaded</p>
                      <p>{new Date(selectedContent.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Access</p>
                      <p>{selectedContent.isPublic ? 'Public' : 'Private'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Blockchain Verification</h3>
                  
                  <div className="bg-nebula-dark/30 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Content Hash</p>
                        <p className="text-xs font-mono break-all">{selectedContent.contentHash}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">IPFS Hash</p>
                        <p className="text-xs font-mono break-all">{selectedContent.ipfsHash}</p>
                      </div>
                    </div>
                    
                    {verificationResult ? (
                      <div className="rounded-lg p-4 mb-4 border border-primary/30 bg-primary/10">
                        <div className="flex items-center mb-2">
                          {verificationResult.isVerified ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="font-semibold">Content Verified</span>
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              <span className="font-semibold">Verification Failed</span>
                            </>
                          )}
                        </div>
                        
                        {verificationResult.isVerified && (
                          <div className="text-sm">
                            <p><span className="text-slate-400">Owner:</span> {verificationResult.ownerAddress?.substring(0, 6)}...{verificationResult.ownerAddress?.substring(verificationResult.ownerAddress.length - 4)}</p>
                            <p><span className="text-slate-400">Timestamp:</span> {new Date(verificationResult.timestamp * 1000).toLocaleString()}</p>
                          </div>
                        )}
                        
                        {verificationResult.error && (
                          <p className="text-sm text-red-400">{verificationResult.error}</p>
                        )}
                      </div>
                    ) : (
                      <Button 
                        className="w-full bg-secondary hover:bg-secondary-dark"
                        onClick={handleVerifyContent}
                        disabled={isVerifying}
                      >
                        {isVerifying ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying...
                          </span>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verify Authenticity on Solana
                          </>
                        )}
                      </Button>
                    )}
                    
                    <div className="mt-4 flex space-x-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 border-primary text-primary hover:bg-primary/10"
                        onClick={() => window.open(getIPFSGatewayURL(selectedContent.ipfsHash), '_blank')}
                      >
                        View on IPFS
                      </Button>
                      
                      {selectedContent.solanaTransaction && (
                        <Button 
                          variant="outline" 
                          className="flex-1 border-secondary text-secondary hover:bg-secondary/10"
                          onClick={() => window.open(`https://explorer.solana.com/tx/${selectedContent.solanaTransaction}`, '_blank')}
                        >
                          View on Solana
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to format file size
function formatSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to format content type
function formatContentType(contentType: string): string {
  if (!contentType) return 'Unknown';
  
  const typeMap: Record<string, string> = {
    'image/jpeg': 'JPEG Image',
    'image/png': 'PNG Image',
    'image/gif': 'GIF Image',
    'image/webp': 'WebP Image',
    'image/svg+xml': 'SVG Image',
    'video/mp4': 'MP4 Video',
    'video/webm': 'WebM Video',
    'audio/mpeg': 'MP3 Audio',
    'audio/wav': 'WAV Audio',
    'audio/ogg': 'OGG Audio',
    'application/pdf': 'PDF Document',
    'text/plain': 'Text Document',
    'text/html': 'HTML Document',
    'application/json': 'JSON File'
  };
  
  return typeMap[contentType] || contentType;
}
