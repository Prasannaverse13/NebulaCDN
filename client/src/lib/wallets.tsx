import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { WalletType, authenticateWithServer, signMessageWithEthereum, signMessageWithPhantom } from './wallets';

interface WalletContextType {
  connected: boolean;
  connecting: boolean;
  address: string | null;
  walletType: WalletType;
  token: string | null;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  connect: () => void;
  connectMetaMask: () => Promise<void>;
  connectPhantom: () => Promise<void>;
  connectBrave: () => Promise<void>;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  connecting: false,
  address: null,
  walletType: null,
  token: null,
  showModal: false,
  setShowModal: () => {},
  connect: () => {},
  connectMetaMask: async () => {},
  connectPhantom: async () => {},
  connectBrave: async () => {},
  disconnect: () => {},
  signMessage: async () => '',
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Check for existing connections on load
  useEffect(() => {
    const savedWalletType = localStorage.getItem('walletType') as WalletType;
    const savedAddress = localStorage.getItem('walletAddress');

    if (savedWalletType && savedAddress) {
      checkExistingConnection(savedWalletType);
    }
  }, []);

  const checkExistingConnection = async (type: WalletType) => {
    try {
      switch (type) {
        case 'metamask':
          if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
              handleSuccessfulConnection(accounts[0], 'metamask');
            }
          }
          break;
        case 'phantom':
          if (window.solana && window.solana.isPhantom) {
            const response = await window.solana.connect({ onlyIfTrusted: true });
            handleSuccessfulConnection(response.publicKey.toString(), 'phantom');
          }
          break;
        case 'brave':
          if (window.ethereum && window.ethereum.isBraveWallet) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
              handleSuccessfulConnection(accounts[0], 'brave');
            }
          }
          break;
      }
    } catch (error) {
      console.log("No existing connection found");
    }
  };

  const handleSuccessfulConnection = (addr: string, type: WalletType) => {
    setAddress(addr);
    setWalletType(type);
    setConnected(true);
    setShowModal(false);
    
    // Save connection info to localStorage
    localStorage.setItem('walletAddress', addr);
    localStorage.setItem('walletType', type);
  };

  const connect = () => {
    setShowModal(true);
  };

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      window.open('https://metamask.io/download.html', '_blank');
      return;
    }

    setConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      handleSuccessfulConnection(accounts[0], 'metamask');

      // Setup event listeners
      window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
        if (newAccounts.length === 0) {
          disconnect();
        } else {
          setAddress(newAccounts[0]);
        }
      });
      
      window.ethereum.on('disconnect', disconnect);
    } catch (error) {
      console.error('MetaMask connection error:', error);
    } finally {
      setConnecting(false);
    }
  };

  const connectPhantom = async () => {
    if (!window.solana || !window.solana.isPhantom) {
      window.open('https://phantom.app/', '_blank');
      return;
    }

    setConnecting(true);
    try {
      const response = await window.solana.connect();
      handleSuccessfulConnection(response.publicKey.toString(), 'phantom');
      
      // Setup event listeners
      window.solana.on('disconnect', disconnect);
    } catch (error) {
      console.error('Phantom connection error:', error);
    } finally {
      setConnecting(false);
    }
  };

  const connectBrave = async () => {
    if (!window.ethereum || !window.ethereum.isBraveWallet) {
      window.open('https://brave.com/wallet/', '_blank');
      return;
    }

    setConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      handleSuccessfulConnection(accounts[0], 'brave');
      
      // Setup event listeners
      window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
        if (newAccounts.length === 0) {
          disconnect();
        } else {
          setAddress(newAccounts[0]);
        }
      });
      
      window.ethereum.on('disconnect', disconnect);
    } catch (error) {
      console.error('Brave Wallet connection error:', error);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    // Different disconnect methods based on wallet type
    if (walletType === 'phantom' && window.solana) {
      window.solana.disconnect();
    }
    
    // Clear state
    setConnected(false);
    setAddress(null);
    setWalletType(null);
    
    // Clear local storage
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletType');
  };

  const signMessage = async (message: string): Promise<string> => {
    if (!connected || !address) {
      throw new Error('Wallet not connected');
    }

    try {
      if (walletType === 'metamask' || walletType === 'brave') {
        const encodedMessage = `0x${Buffer.from(message).toString('hex')}`;
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [encodedMessage, address],
        });
        return signature;
      } 
      else if (walletType === 'phantom') {
        const encodedMessage = new TextEncoder().encode(message);
        const { signature } = await window.solana.signMessage(encodedMessage, 'utf8');
        return signature;
      } 
      else {
        throw new Error('Unsupported wallet type');
      }
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  };

  const value = {
    connected,
    connecting,
    address,
    walletType,
    token,
    showModal,
    setShowModal,
    connect,
    connectMetaMask,
    connectPhantom,
    connectBrave,
    disconnect,
    signMessage,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

// Add typings for window object to access wallet providers
declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}
