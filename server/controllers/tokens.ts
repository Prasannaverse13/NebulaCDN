import { Request, Response } from 'express';
import { storage } from '../storage';
import { TokenTransaction } from '../../client/src/lib/types';
import * as solanaService from '../services/solana';
import * as cambrianService from '../services/cambrian';

/**
 * Get token balance for authenticated user
 */
export const getTokenBalance = async (req: Request, res: Response) => {
  try {
    const walletAddress = req.user.walletAddress;
    
    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address not found' });
    }
    
    // In a production environment, this would fetch the actual token balance from Solana
    // using the wallet address and potentially other data from our database
    
    // Get the NEBula token balance
    const tokenMintAddress = "nebNEBnebnebNEBnebNEBnebnebNEBnebNE"; // Replace with actual token mint address
    const balanceResult = await solanaService.getTokenBalance(walletAddress, tokenMintAddress);
    
    // Calculate staked tokens
    const stakedResult = await solanaService.getStakedAmount(walletAddress);
    
    // Calculate rewards
    const rewardsResult = await solanaService.getRewardsAmount(walletAddress);
    
    const balance = {
      total: balanceResult.total,
      available: balanceResult.available,
      staked: stakedResult.amount,
      rewards: rewardsResult.amount
    };
    
    res.json({ balance });
  } catch (error) {
    console.error('Error fetching token balance:', error);
    res.status(500).json({ message: 'Failed to fetch token balance' });
  }
};

/**
 * Get transaction history for authenticated user
 */
export const getTransactionHistory = async (req: Request, res: Response) => {
  try {
    const walletAddress = req.user.walletAddress;
    
    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address not found' });
    }
    
    // In a production environment, this would fetch transactions from Solana and our database
    // based on the wallet address
    
    // Get transactions from Solana
    const solanaTransactions = await solanaService.getTransactionHistory(walletAddress);
    
    // Mock transaction data for development
    const transactions: TokenTransaction[] = [
      {
        id: 1,
        userId: req.user.id,
        transactionType: 'stake',
        amount: 1000,
        receiverId: null,
        contentId: null,
        nodeId: 1,
        transactionHash: '4uQeVj5tqViQh7yWWGStvkEG1Zmhx6uasJtWCJziofM17wrSl1YxUJyoESFmZU3fg4lXs2Z6n9Zc5RWGepEMzNt',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        userId: req.user.id,
        transactionType: 'reward',
        amount: 50,
        receiverId: null,
        contentId: null,
        nodeId: 1,
        transactionHash: 'NPrXLmbg9HMFgeLLR2SxaerZj6GjKmNGCe1VrUJqf6hQYBe3bQNMMJqR9vnLAHZsjv7zJvdJzC5JUP4VsRFbUwx',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        userId: req.user.id,
        transactionType: 'tip',
        amount: 25,
        receiverId: 2,
        contentId: 1,
        nodeId: null,
        transactionHash: 'uGjKmNGCe1VrUJqf6hQYBe3bQNMMJqR9vnLAHZsjv7zJvdJzC5JUP4VsRFbUNPrXLmbg9HMFgeLLR2SxaerZj6wx',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 4,
        userId: req.user.id,
        transactionType: 'unstake',
        amount: 500,
        receiverId: null,
        contentId: null,
        nodeId: 1,
        transactionHash: 'Zmhx6uasJtWCJziofM17wrSl1YxUJyoESFmZU3fg4lXs2Z6n9Zc5RWGepEMzNt4uQeVj5tqViQh7yWWGStvkEG1',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 5,
        userId: 2,
        transactionType: 'tip',
        amount: 15,
        receiverId: req.user.id,
        contentId: 3,
        nodeId: null,
        transactionHash: '5JUP4VsRFbUNPrXLmbg9HMFgeLLR2SxaerZj6uGjKmNGCe1VrUJqf6hQYBe3bQNMMJqR9vnLAHZsjv7zJvdJzCwx',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    res.json({ transactions });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({ message: 'Failed to fetch transaction history' });
  }
};

/**
 * Stake tokens for an NCN
 */
export const stakeTokens = async (req: Request, res: Response) => {
  try {
    const { amount, walletAddress, signature } = req.body;
    
    if (!walletAddress || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid wallet address and amount are required' });
    }
    
    // Verify signature
    const isValid = await solanaService.verifySignature(
      walletAddress,
      `Stake ${amount} NBNEB tokens`,
      signature
    );
    
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid signature' });
    }
    
    // In a production environment, this would create the staking transaction on Solana
    const result = await solanaService.stakeTokens(amount, walletAddress);
    
    if (!result.success) {
      return res.status(400).json({ message: result.error || 'Failed to stake tokens' });
    }
    
    // Create transaction record
    const transaction: TokenTransaction = {
      id: Date.now(),
      userId: req.user.id,
      transactionType: 'stake',
      amount: amount,
      receiverId: null,
      contentId: null,
      nodeId: null, // This would be the node ID if staking for a specific node
      transactionHash: result.transactionSignature,
      createdAt: new Date().toISOString()
    };
    
    // In a production environment, this would save the transaction to the database
    
    res.json({ 
      success: true, 
      transaction: transaction,
      message: 'Tokens staked successfully' 
    });
  } catch (error) {
    console.error('Error staking tokens:', error);
    res.status(500).json({ message: 'Failed to stake tokens' });
  }
};

/**
 * Unstake tokens
 */
export const unstakeTokens = async (req: Request, res: Response) => {
  try {
    const { amount, walletAddress, signature } = req.body;
    
    if (!walletAddress || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid wallet address and amount are required' });
    }
    
    // Verify signature
    const isValid = await solanaService.verifySignature(
      walletAddress,
      `Unstake ${amount} NBNEB tokens`,
      signature
    );
    
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid signature' });
    }
    
    // In a production environment, this would create the unstaking transaction on Solana
    const result = await solanaService.unstakeTokens(amount, walletAddress);
    
    if (!result.success) {
      return res.status(400).json({ message: result.error || 'Failed to unstake tokens' });
    }
    
    // Create transaction record
    const transaction: TokenTransaction = {
      id: Date.now(),
      userId: req.user.id,
      transactionType: 'unstake',
      amount: amount,
      receiverId: null,
      contentId: null,
      nodeId: null,
      transactionHash: result.transactionSignature,
      createdAt: new Date().toISOString()
    };
    
    // In a production environment, this would save the transaction to the database
    
    res.json({ 
      success: true, 
      transaction: transaction,
      message: 'Tokens unstaked successfully' 
    });
  } catch (error) {
    console.error('Error unstaking tokens:', error);
    res.status(500).json({ message: 'Failed to unstake tokens' });
  }
};

/**
 * Send tip to content creator
 */
export const sendTip = async (req: Request, res: Response) => {
  try {
    const { amount, contentId, creatorAddress, senderWalletAddress, signature } = req.body;
    
    if (!creatorAddress || !senderWalletAddress || !amount || amount <= 0 || !contentId) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
    
    // Verify signature
    const isValid = await solanaService.verifySignature(
      senderWalletAddress,
      `Tip ${amount} NBNEB tokens to ${creatorAddress} for content ${contentId}`,
      signature
    );
    
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid signature' });
    }
    
    // In a production environment, this would create the tip transaction on Solana
    const result = await solanaService.sendTip(creatorAddress, amount, contentId, senderWalletAddress);
    
    if (!result.success) {
      return res.status(400).json({ message: result.error || 'Failed to send tip' });
    }
    
    // Get creator user ID
    // In a production environment, this would look up the user by wallet address
    const creatorUserId = 2; // Placeholder, would fetch from database
    
    // Create transaction record
    const transaction: TokenTransaction = {
      id: Date.now(),
      userId: req.user.id,
      transactionType: 'tip',
      amount: amount,
      receiverId: creatorUserId,
      contentId: contentId,
      nodeId: null,
      transactionHash: result.transactionSignature,
      createdAt: new Date().toISOString()
    };
    
    // In a production environment, this would save the transaction to the database
    
    res.json({ 
      success: true, 
      transaction: transaction,
      message: 'Tip sent successfully' 
    });
  } catch (error) {
    console.error('Error sending tip:', error);
    res.status(500).json({ message: 'Failed to send tip' });
  }
};

/**
 * Get rewards for a node
 */
export const getNodeRewards = async (req: Request, res: Response) => {
  try {
    const { nodeId, walletAddress, signature } = req.body;
    
    if (!nodeId || !walletAddress) {
      return res.status(400).json({ message: 'Node ID and wallet address are required' });
    }
    
    // Verify signature
    const isValid = await solanaService.verifySignature(
      walletAddress,
      `Get rewards for node ${nodeId}`,
      signature
    );
    
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid signature' });
    }
    
    // Get node rewards from Cambrian SDK
    const result = await cambrianService.getNodeRewards(nodeId, walletAddress, signature);
    
    if (!result.success) {
      return res.status(400).json({ message: result.error || 'Failed to get node rewards' });
    }
    
    res.json({ 
      rewards: result.rewards || 0
    });
  } catch (error) {
    console.error('Error getting node rewards:', error);
    res.status(500).json({ message: 'Failed to get node rewards' });
  }
};

/**
 * Claim rewards for a node
 */
export const claimNodeRewards = async (req: Request, res: Response) => {
  try {
    const { nodeId, walletAddress, signature } = req.body;
    
    if (!nodeId || !walletAddress) {
      return res.status(400).json({ message: 'Node ID and wallet address are required' });
    }
    
    // Verify signature
    const isValid = await solanaService.verifySignature(
      walletAddress,
      `Claim rewards for node ${nodeId}`,
      signature
    );
    
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid signature' });
    }
    
    // Claim node rewards from Cambrian SDK
    const result = await cambrianService.claimNodeRewards(nodeId, walletAddress, signature);
    
    if (!result.success) {
      return res.status(400).json({ message: result.error || 'Failed to claim node rewards' });
    }
    
    // Create transaction record
    const rewardsAmount = 150; // In production, this would be the actual amount from the claim operation
    const transaction: TokenTransaction = {
      id: Date.now(),
      userId: req.user.id,
      transactionType: 'reward',
      amount: rewardsAmount,
      receiverId: null,
      contentId: null,
      nodeId: parseInt(nodeId),
      transactionHash: result.transactionHash,
      createdAt: new Date().toISOString()
    };
    
    // In a production environment, this would save the transaction to the database
    
    res.json({ 
      success: true,
      transaction: transaction,
      transactionHash: result.transactionHash,
      message: 'Rewards claimed successfully' 
    });
  } catch (error) {
    console.error('Error claiming node rewards:', error);
    res.status(500).json({ message: 'Failed to claim node rewards' });
  }
};
