import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/lib/wallets.tsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

export default function Upload() {
  const { toast } = useToast();
  const { connected, connect } = useWallet();
  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'video/*': [],
      'audio/*': [],
      'text/*': [],
      'application/pdf': []
    },
    maxSize: 100 * 1024 * 1024, // 100MB max size
  });
  
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      // Create a custom fetch with upload progress
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      });
      
      return new Promise((resolve, reject) => {
        xhr.open('POST', '/api/content/upload');
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(xhr.statusText));
          }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(formData);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content/list'] });
      toast({
        title: "Upload Complete",
        description: "Your content has been successfully uploaded to the network!",
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
      setUploadProgress(0);
    }
  });
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setIsPublic(true);
    setIsPremium(false);
    setFiles([]);
    setUploadProgress(0);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to upload content",
        variant: "destructive",
      });
      connect();
      return;
    }
    
    if (!title || files.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and upload at least one file",
        variant: "destructive",
      });
      return;
    }
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('isPublic', isPublic.toString());
    formData.append('isPremium', isPremium.toString());
    
    files.forEach(file => {
      formData.append('files', file);
    });
    
    uploadMutation.mutate(formData);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Upload & Manage Content</h1>
          <p className="text-slate-400">
            Upload your files to our decentralized network. Files are stored on IPFS/Arweave with metadata on Solana.
          </p>
        </div>
        
        <Card className="glass border-slate-700/50">
          <CardHeader>
            <CardTitle>Upload New Content</CardTitle>
            <CardDescription>
              Distribute your content across the Node Consensus Network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="Enter content title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-nebula-dark/50 border-slate-700"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your content..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-nebula-dark/50 border-slate-700 min-h-[100px]"
                />
              </div>
              
              <div className="space-y-4">
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                    ${isDragActive 
                      ? 'border-primary bg-primary/10' 
                      : files.length > 0 
                        ? 'border-green-500 bg-green-500/10' 
                        : 'border-slate-700 hover:border-slate-500 bg-nebula-dark/30'
                    }`}
                >
                  <input {...getInputProps()} />
                  
                  {files.length > 0 ? (
                    <div>
                      <div className="flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-green-500">
                        {files.length} {files.length === 1 ? 'file' : 'files'} selected
                      </p>
                      <p className="text-slate-400 mt-2">
                        {files.map(file => file.name).join(', ')}
                      </p>
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setFiles([]);
                        }}
                        className="mt-4 text-sm text-red-400 hover:text-red-300"
                      >
                        Remove file(s)
                      </button>
                    </div>
                  ) : isDragActive ? (
                    <div>
                      <div className="flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-primary">Drop files here</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium">Drag files here or click to browse</p>
                      <p className="text-slate-400 mt-2">
                        Support for images, videos, audio, documents, and more (Max: 100MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-8">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="public" 
                    checked={isPublic} 
                    onCheckedChange={setIsPublic}
                  />
                  <Label htmlFor="public">Public Content</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="premium" 
                    checked={isPremium} 
                    onCheckedChange={setIsPremium}
                  />
                  <Label htmlFor="premium">Premium Content</Label>
                </div>
              </div>
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-dark"
                  disabled={uploadMutation.isPending || files.length === 0}
                >
                  {uploadMutation.isPending ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Upload to Network'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Previously Uploaded Content Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Your Content</h2>
          
          <div className="glass border border-slate-700/50 rounded-xl p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <h3 className="text-xl font-medium mb-2">Connect Wallet to View Your Content</h3>
            <p className="text-slate-400 mb-6">
              Log in with your wallet to view all your uploaded content across the network
            </p>
            <Button
              onClick={connect}
              className="bg-primary hover:bg-primary-dark"
              disabled={connected}
            >
              {connected ? 'Wallet Connected' : 'Connect Wallet'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
