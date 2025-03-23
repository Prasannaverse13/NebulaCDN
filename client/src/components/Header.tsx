import { useState } from "react";
import { Link } from "wouter";
import { useWallet } from "../lib/wallets.tsx";

export default function Header() {
  const { connected, connect, address, disconnect } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleWalletModal = () => {
    if (connected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-700">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg className="h-8 w-8 text-primary-light" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-9.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5 9.5h-2v-2h-2v-2h2V9.5h2v5.5z"/>
          </svg>
          <Link href="/" className="text-xl font-bold text-white">
            <span className="text-primary">Nebula</span>CDN
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <span className="px-3 py-1 text-xs bg-green-900/50 text-green-400 rounded-full flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
              Network: Online
            </span>
            <span className="px-3 py-1 text-xs bg-secondary-dark/20 text-secondary-light rounded-full">
              NCN Nodes: 247
            </span>
          </div>
          
          {/* Wallet Connect Button */}
          <button 
            onClick={toggleWalletModal}
            className={`flex items-center ${
              connected 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-primary hover:bg-primary-dark"
            } text-white px-4 py-2 rounded-lg transition duration-200`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {connected ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              )}
            </svg>
            {connected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect Wallet"}
          </button>
          
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass">
          <div className="px-4 py-3 space-y-3">
            <Link href="/upload" className="block text-white hover:text-primary-light transition duration-200">
              Upload Content
            </Link>
            <Link href="/dashboard" className="block text-white hover:text-primary-light transition duration-200">
              Node Dashboard
            </Link>
            <Link href="/content" className="block text-white hover:text-primary-light transition duration-200">
              Content Retrieval
            </Link>
            <Link href="/tokens" className="block text-white hover:text-primary-light transition duration-200">
              Token & Rewards
            </Link>
            <Link href="/settings" className="block text-white hover:text-primary-light transition duration-200">
              Wallet Management
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
