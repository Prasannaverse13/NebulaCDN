import { apiRequest } from './queryClient';

// Add typings for window object to access wallet providers
declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}

export type WalletType = 'metamask' | 'phantom' | 'brave' | null;

/**
 * Helper function to sign a message with MetaMask or Brave wallet
 */
export async function signMessageWithEthereum(message: string, address: string): Promise<string> {
  if (!window.ethereum) {
    throw new Error('Ethereum provider not available');
  }
  
  try {
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, address],
    });
    return signature;
  } catch (error) {
    console.error('Error signing message with Ethereum:', error);
    throw error;
  }
}

/**
 * Helper function to sign a message with Phantom wallet
 */
export async function signMessageWithPhantom(message: string): Promise<string> {
  if (!window.solana || !window.solana.isPhantom) {
    throw new Error('Phantom wallet not available');
  }
  
  try {
    const encodedMessage = new TextEncoder().encode(message);
    const { signature } = await window.solana.signMessage(encodedMessage, 'utf8');
    return signature;
  } catch (error) {
    console.error('Error signing message with Phantom:', error);
    throw error;
  }
}

/**
 * Helper function to authenticate with the server
 */
export async function authenticateWithServer(
  walletAddress: string, 
  signature: string, 
  message: string, 
  walletType: WalletType
): Promise<string> {
  try {
    const response = await apiRequest('/api/auth/wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress,
        signature,
        message,
        walletType
      }),
    });

    return response.token;
  } catch (error) {
    console.error('Server authentication error:', error);
    // For development purposes, return a mock token
    if (process.env.NODE_ENV !== 'production') {
      return 'mock_token_for_development';
    }
    throw error;
  }
}
