import { Link } from 'wouter';
import NetworkStats from '@/components/NetworkStats';
import FeatureCard from '@/components/FeatureCard';
import ContentCard from '@/components/ContentCard';
import NetworkVisualization from '@/components/NetworkVisualization';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <span className="glitch">Decentralized CDN</span> for the Web3 Era
            </h1>
            <p className="text-xl text-white mb-8 leading-relaxed font-medium">
              NebulaCDN leverages <span className="text-green-400 font-bold">Node Consensus Networks (NCNs)</span> via Cambrian SDK and Jito Restaking to distribute content closer to users with censorship resistance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/upload" className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition duration-200 flex items-center">
                Get Started
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <a href="#how-it-works" className="px-6 py-3 bg-transparent border border-slate-600 hover:border-slate-400 text-white font-semibold rounded-lg transition duration-200 flex items-center">
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
            {/* Network stats component */}
            <NetworkStats />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">NebulaCDN combines decentralized infrastructure with economic incentives to create a robust content delivery system.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            title="Decentralized Nodes"
            description="No single point of failure. Uses Jito Restaking validators to distribute content across the network."
            iconBgClass="bg-primary/20"
            iconColorClass="text-primary-light"
          />
          
          <FeatureCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Token Incentives"
            description="Node operators earn Nebula tokens for caching and serving content based on request volume."
            iconBgClass="bg-secondary/20"
            iconColorClass="text-secondary-light"
          />
          
          <FeatureCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            title="Content Integrity"
            description="Uses Solana smart contracts & IPFS to ensure authentication and verification of all content."
            iconBgClass="bg-accent/20"
            iconColorClass="text-accent-light"
          />
          
          <FeatureCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            title="DDoS Resistance"
            description="Distributed architecture makes attacks costly and impractical, with no central target to overwhelm."
            iconBgClass="bg-primary/20"
            iconColorClass="text-primary-light"
          />
          
          <FeatureCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            title="Web3 Authentication"
            description="Connect seamlessly with MetaMask, Brave Wallet, and Phantom Wallet for secure access."
            iconBgClass="bg-secondary/20"
            iconColorClass="text-secondary-light"
          />
          
          <FeatureCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            title="Low Latency Delivery"
            description="Content is delivered from the nearest NCN node for ultra-fast loading and response times."
            iconBgClass="bg-accent/20"
            iconColorClass="text-accent-light"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How NebulaCDN Works</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Our decentralized architecture leverages Cambrian SDK and Jito Restaking to create a robust content delivery network.</p>
        </div>
        
        <div className="glass rounded-2xl border border-slate-700 overflow-hidden">
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Left Column: Steps */}
              <div className="space-y-8">
                {/* Step 1 */}
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light font-bold text-xl border border-primary/30">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">User Uploads Content</h3>
                    <p className="text-slate-400">Users connect their wallet and upload files. The content is hashed and stored on IPFS/Arweave, with metadata recorded on Solana smart contracts.</p>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light font-bold text-xl border border-primary/30">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Content Distribution via NCN</h3>
                    <p className="text-slate-400">Jito Restaking validators cache content using Cambrian SDK. Nodes compete to store and deliver content through a Proof-of-Cache mechanism.</p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light font-bold text-xl border border-primary/30">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Access & Retrieval</h3>
                    <p className="text-slate-400">When content is requested, the system checks the closest node for cached content. If found, it's delivered instantly. If not, it's retrieved from IPFS as fallback.</p>
                  </div>
                </div>
                
                {/* Step 4 */}
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light font-bold text-xl border border-primary/30">
                      4
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Rewards & Incentives</h3>
                    <p className="text-slate-400">NCN Nodes earn Nebula tokens based on content requests served. Users can tip content providers, and validators stake Nebula tokens to participate.</p>
                  </div>
                </div>
              </div>
              
              {/* Right Column: Network Visualization */}
              <div className="flex items-center justify-center">
                <NetworkVisualization />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Sections */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">NebulaCDN Platform</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Explore our comprehensive Web3 content delivery solution.</p>
        </div>
        
        {/* App Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ContentCard 
            title="Upload & Manage"
            description="Upload files to IPFS/Arweave, set permissions, and manage your distributed content."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            }
            link="/upload"
            tags={["Drag & Drop", "IPFS Storage", "Solana Contract"]}
          />
          
          <ContentCard 
            title="Node Dashboard"
            description="Monitor node performance, manage staking, track cache efficiency, and view rewards earned."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            link="/dashboard"
            tags={["Node Analytics", "Staking", "Rewards"]}
            iconBgClass="bg-secondary/20"
            iconColorClass="text-secondary/30"
            gradientClass="from-secondary/20 to-primary/10"
            glowClass="from-secondary to-primary"
          />
          
          <ContentCard 
            title="Content Retrieval"
            description="Browse and retrieve content with built-in preview and verification of authenticity on Solana."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            link="/content"
            tags={["Media Preview", "Verify Hash", "NCN Routing"]}
            iconBgClass="bg-accent/20"
            iconColorClass="text-accent/30"
            gradientClass="from-accent/20 to-primary/10"
            glowClass="from-accent to-primary"
          />
          
          <ContentCard 
            title="Token & Rewards"
            description="Earn, stake, and transfer Nebula tokens, view transaction history, and tip content creators."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            link="/tokens"
            tags={["Staking", "Token Rewards", "Creator Tips"]}
          />
          
          <ContentCard 
            title="Wallet Management"
            description="Connect wallets, view transaction history, and manage staking and unstaking options."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            link="/settings"
            tags={["Multi-Wallet", "Transactions", "Security"]}
            iconBgClass="bg-secondary/20"
            iconColorClass="text-secondary/30"
            gradientClass="from-secondary/20 to-accent/10"
            glowClass="from-secondary to-accent"
          />
          

        </div>
      </section>


      

    </div>
  );
}
