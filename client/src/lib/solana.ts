import { PublicKey, Connection, Transaction, SystemProgram, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js';
import axios from 'axios';

// Connection to Solana network using environment variables or default to devnet
const getRpcUrl = (): string => {
  return import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
};

// Initialize Solana connection
export const connection = new Connection(getRpcUrl(), 'confirmed');

// Create and send a transaction through our backend to avoid exposing private keys
export async function sendTransactionViaBackend(
  recipientAddress: string,
  amount: number,
  senderWalletAddress: string,
  signature: string
): Promise<string> {
  try {
    const response = await axios.post('/api/solana/transaction', {
      recipientAddress,
      amount,
      senderWalletAddress,
      signature,
    });
    
    return response.data.transactionSignature;
  } catch (error) {
    console.error('Error sending Solana transaction:', error);
    throw error;
  }
}

// Store content metadata on Solana
export async function storeContentMetadata(
  contentHash: string,
  ipfsHash: string,
  arweaveHash: string | null,
  ownerWalletAddress: string,
  signature: string
): Promise<string> {
  try {
    const response = await axios.post('/api/solana/content-metadata', {
      contentHash,
      ipfsHash,
      arweaveHash,
      ownerWalletAddress,
      signature,
    });
    
    return response.data.transactionSignature;
  } catch (error) {
    console.error('Error storing content metadata on Solana:', error);
    throw error;
  }
}

// Verify content ownership and authenticity
export async function verifyContent(contentHash: string): Promise<{
  isVerified: boolean;
  ownerAddress?: string;
  timestamp?: number;
  ipfsHash?: string;
  arweaveHash?: string;
}> {
  try {
    const response = await axios.get(`/api/solana/verify-content/${contentHash}`);
    return response.data;
  } catch (error) {
    console.error('Error verifying content on Solana:', error);
    return { isVerified: false };
  }
}

// Get SOL balance for a wallet address
export async function getSolBalance(walletAddress: string): Promise<number> {
  try {
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error getting SOL balance:', error);
    throw error;
  }
}

// Get token balance (e.g., Nebula tokens)
export async function getTokenBalance(walletAddress: string, tokenMintAddress: string): Promise<number> {
  try {
    const response = await axios.get(`/api/solana/token-balance/${walletAddress}/${tokenMintAddress}`);
    return response.data.balance;
  } catch (error) {
    console.error('Error getting token balance:', error);
    return 0;
  }
}

// Stake tokens to become a validator node
export async function stakeTokens(
  amount: number,
  walletAddress: string,
  signature: string
): Promise<string> {
  try {
    const response = await axios.post('/api/solana/stake', {
      amount,
      walletAddress,
      signature,
    });
    
    return response.data.transactionSignature;
  } catch (error) {
    console.error('Error staking tokens:', error);
    throw error;
  }
}

// Unstake tokens
export async function unstakeTokens(
  amount: number,
  walletAddress: string,
  signature: string
): Promise<string> {
  try {
    const response = await axios.post('/api/solana/unstake', {
      amount,
      walletAddress,
      signature,
    });
    
    return response.data.transactionSignature;
  } catch (error) {
    console.error('Error unstaking tokens:', error);
    throw error;
  }
}

// Send a tip to content creator
export async function sendTip(
  creatorAddress: string,
  amount: number,
  contentId: string,
  senderWalletAddress: string,
  signature: string
): Promise<string> {
  try {
    const response = await axios.post('/api/solana/tip', {
      creatorAddress,
      amount,
      contentId,
      senderWalletAddress,
      signature,
    });
    
    return response.data.transactionSignature;
  } catch (error) {
    console.error('Error sending tip:', error);
    throw error;
  }
}

// Get transaction history for a wallet
export async function getTransactionHistory(walletAddress: string): Promise<any[]> {
  try {
    const response = await axios.get(`/api/solana/transactions/${walletAddress}`);
    return response.data.transactions;
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return [];
  }
}
