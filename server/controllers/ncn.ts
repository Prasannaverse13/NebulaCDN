import { Request, Response } from 'express';
import { storage } from '../storage';
import { NcnNode, NodeStats, NetworkStats } from '../../client/src/lib/types';
import * as cambrianService from '../services/cambrian';
import * as solanaService from '../services/solana';

/**
 * Get network statistics for the NebulaCDN network
 */
export const getNetworkStats = async (req: Request, res: Response) => {
  try {
    // In a production environment, these would be fetched from a real-time database
    // or calculated from actual data in the system
    const networkStats: NetworkStats = {
      activeNodes: 247, // Number of active nodes in the network
      cachedFiles: 8941, // Total number of files cached across all nodes
      totalStorage: "14.7 TB", // Total storage used by cached files
      responseTime: "78 ms", // Average response time for content delivery
      totalTokensStaked: 2500000, // Total tokens staked in the network
      totalRewardsDistributed: 125000 // Total rewards distributed to node operators
    };
    
    res.json(networkStats);
  } catch (error) {
    console.error('Error fetching network stats:', error);
    res.status(500).json({ message: 'Failed to fetch network statistics' });
  }
};

/**
 * Get statistics for a node operator
 */
export const getNodeOperatorStats = async (req: Request, res: Response) => {
  try {
    // Get the wallet address from authenticated user
    const walletAddress = req.user.walletAddress;
    
    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address not found' });
    }
    
    // In a production environment, these would be fetched from the Cambrian SDK
    // and calculated based on the operator's actual nodes and performance
    const stats = {
      nodesCount: 3, // Number of nodes operated by this user
      totalStaked: 75000, // Total tokens staked by this operator
      totalRewards: 3750, // Total rewards earned
      averageUptime: 99.7, // Average uptime percentage across all nodes
      cacheHitRatio: 92.3, // Cache hit ratio percentage
      cacheSize: "1.2 TB" // Total cache size across all nodes
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching node operator stats:', error);
    res.status(500).json({ message: 'Failed to fetch node operator statistics' });
  }
};

/**
 * Get all nodes for an operator
 */
export const getOperatorNodes = async (req: Request, res: Response) => {
  try {
    // Get the wallet address from authenticated user
    const walletAddress = req.user.walletAddress;
    
    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address not found' });
    }
    
    // In a production environment, this would fetch nodes from the Cambrian SDK
    // and the database based on the user's wallet address
    const nodes: NcnNode[] = [
      {
        id: 1,
        nodeId: "node1_" + walletAddress.substring(0, 8),
        userId: req.user.id,
        name: "Primary Node",
        ipAddress: "203.0.113.1",
        port: 8545,
        stakeAmount: 30000,
        isActive: true,
        stats: {
          cpuUsage: 45,
          memoryUsage: 60,
          diskUsage: 72,
          bandwidthUsed: 1250000000,
          uptimePercentage: 99.8,
          cacheHits: 15670,
          cacheMisses: 1250,
          requestsServed: 16920,
          lastUpdated: new Date().toISOString()
        },
        lastSeen: new Date().toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        contentsCached: 456,
        performance: 95.8
      },
      {
        id: 2,
        nodeId: "node2_" + walletAddress.substring(0, 8),
        userId: req.user.id,
        name: "Secondary Node",
        ipAddress: "203.0.113.2",
        port: 8545,
        stakeAmount: 25000,
        isActive: true,
        stats: {
          cpuUsage: 38,
          memoryUsage: 52,
          diskUsage: 65,
          bandwidthUsed: 980000000,
          uptimePercentage: 99.5,
          cacheHits: 12340,
          cacheMisses: 980,
          requestsServed: 13320,
          lastUpdated: new Date().toISOString()
        },
        lastSeen: new Date().toISOString(),
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago
        contentsCached: 387,
        performance: 92.6
      },
      {
        id: 3,
        nodeId: "node3_" + walletAddress.substring(0, 8),
        userId: req.user.id,
        name: "Backup Node",
        ipAddress: "203.0.113.3",
        port: 8545,
        stakeAmount: 20000,
        isActive: true,
        stats: {
          cpuUsage: 30,
          memoryUsage: 45,
          diskUsage: 58,
          bandwidthUsed: 750000000,
          uptimePercentage: 99.9,
          cacheHits: 9870,
          cacheMisses: 720,
          requestsServed: 10590,
          lastUpdated: new Date().toISOString()
        },
        lastSeen: new Date().toISOString(),
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        contentsCached: 312,
        performance: 93.2
      }
    ];
    
    res.json({ nodes });
  } catch (error) {
    console.error('Error fetching operator nodes:', error);
    res.status(500).json({ message: 'Failed to fetch operator nodes' });
  }
};

/**
 * Register a new node to join the NCN
 */
export const registerNode = async (req: Request, res: Response) => {
  try {
    const { ncnId, nodeName, ipAddress, port, signature } = req.body;
    const walletAddress = req.user.walletAddress;
    
    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address not found' });
    }
    
    if (!ncnId || !nodeName || !ipAddress || !port) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
    
    // Verify signature
    const isValid = await solanaService.verifySignature(
      walletAddress,
      `Register node ${nodeName} to NCN ${ncnId}`,
      signature
    );
    
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid signature' });
    }
    
    // Register node with Cambrian SDK
    const result = await cambrianService.registerNode(
      ncnId,
      nodeName,
      ipAddress,
      port,
      walletAddress,
      signature
    );
    
    if (!result.success) {
      return res.status(400).json({ message: result.error || 'Failed to register node' });
    }
    
    // In a production environment, this would create the node in the database
    const newNode: NcnNode = {
      id: 4, // This would be assigned by the database
      nodeId: result.nodeId || "node4_" + walletAddress.substring(0, 8),
      userId: req.user.id,
      name: nodeName,
      ipAddress: ipAddress,
      port: port,
      stakeAmount: 0, // Initial stake amount is 0
      isActive: true,
      stats: null, // No stats yet
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json({ 
      message: 'Node registered successfully',
      node: newNode
    });
  } catch (error) {
    console.error('Error registering node:', error);
    res.status(500).json({ message: 'Failed to register node' });
  }
};

/**
 * Update node statistics
 */
export const updateNodeStats = async (req: Request, res: Response) => {
  try {
    const { nodeId, stats, signature } = req.body;
    const walletAddress = req.user.walletAddress;
    
    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address not found' });
    }
    
    if (!nodeId || !stats) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
    
    // Verify signature
    const isValid = await solanaService.verifySignature(
      walletAddress,
      `Update stats for node ${nodeId}`,
      signature
    );
    
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid signature' });
    }
    
    // Update node stats with Cambrian SDK
    const result = await cambrianService.updateNodeStats(
      nodeId,
      stats as NodeStats,
      signature
    );
    
    if (!result.success) {
      return res.status(400).json({ message: result.error || 'Failed to update node stats' });
    }
    
    // In a production environment, this would update the node stats in the database
    
    res.json({ 
      message: 'Node stats updated successfully'
    });
  } catch (error) {
    console.error('Error updating node stats:', error);
    res.status(500).json({ message: 'Failed to update node stats' });
  }
};

/**
 * Verify if content is cached on a node
 */
export const verifyContentCache = async (req: Request, res: Response) => {
  try {
    const { nodeId, contentHash } = req.params;
    
    if (!nodeId || !contentHash) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
    
    // Check if content is cached on the node via Cambrian SDK
    const result = await cambrianService.verifyContentCache(
      nodeId,
      contentHash
    );
    
    res.json({ 
      isCached: result.isCached
    });
  } catch (error) {
    console.error('Error verifying content cache:', error);
    res.status(500).json({ message: 'Failed to verify content cache' });
  }
};
