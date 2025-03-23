import axios from 'axios';
import { NcnNode, NodeStats } from './types';

// Cambrian SDK client for interacting with the Cambrian Consensus Program and Node Consensus Networks (NCNs)

// Initialize a Node Consensus Network (NCN)
export async function initializeNcn(
  name: string,
  walletAddress: string,
  signature: string,
  consensusThreshold: number,
  stakeThreshold: number
): Promise<{
  success: boolean;
  ncnId?: string;
  error?: string;
}> {
  try {
    const response = await axios.post('/api/cambrian/initialize-ncn', {
      name,
      walletAddress,
      signature,
      consensusThreshold,
      stakeThreshold
    });
    
    return {
      success: true,
      ncnId: response.data.ncnId
    };
  } catch (error: any) {
    console.error('Error initializing NCN:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to initialize NCN'
    };
  }
}

// Register a node to join the NCN
export async function registerNode(
  ncnId: string,
  nodeName: string,
  ipAddress: string,
  port: number,
  walletAddress: string,
  signature: string
): Promise<{
  success: boolean;
  nodeId?: string;
  error?: string;
}> {
  try {
    const response = await axios.post('/api/cambrian/register-node', {
      ncnId,
      nodeName,
      ipAddress,
      port,
      walletAddress,
      signature
    });
    
    return {
      success: true,
      nodeId: response.data.nodeId
    };
  } catch (error: any) {
    console.error('Error registering node:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to register node'
    };
  }
}

// Get all active NCNs
export async function getActiveNcns(): Promise<{
  success: boolean;
  ncns?: any[];
  error?: string;
}> {
  try {
    const response = await axios.get('/api/cambrian/ncns');
    
    return {
      success: true,
      ncns: response.data.ncns
    };
  } catch (error: any) {
    console.error('Error fetching NCNs:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch NCNs'
    };
  }
}

// Get NCN details by ID
export async function getNcnDetails(ncnId: string): Promise<{
  success: boolean;
  ncn?: any;
  nodes?: NcnNode[];
  error?: string;
}> {
  try {
    const response = await axios.get(`/api/cambrian/ncns/${ncnId}`);
    
    return {
      success: true,
      ncn: response.data.ncn,
      nodes: response.data.nodes
    };
  } catch (error: any) {
    console.error('Error fetching NCN details:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch NCN details'
    };
  }
}

// Update node status and stats
export async function updateNodeStats(
  nodeId: string,
  stats: NodeStats,
  signature: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await axios.post('/api/cambrian/update-node-stats', {
      nodeId,
      stats,
      signature
    });
    
    return {
      success: true
    };
  } catch (error: any) {
    console.error('Error updating node stats:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update node stats'
    };
  }
}

// Distribute content to NCN nodes
export async function distributeContent(
  contentId: number,
  contentHash: string,
  ipfsHash: string,
  walletAddress: string,
  signature: string
): Promise<{
  success: boolean;
  distributedNodes?: number;
  error?: string;
}> {
  try {
    const response = await axios.post('/api/cambrian/distribute-content', {
      contentId,
      contentHash,
      ipfsHash,
      walletAddress,
      signature
    });
    
    return {
      success: true,
      distributedNodes: response.data.distributedNodes
    };
  } catch (error: any) {
    console.error('Error distributing content:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to distribute content'
    };
  }
}

// Verify content caching on a node
export async function verifyContentCache(
  nodeId: string,
  contentHash: string
): Promise<{
  success: boolean;
  isCached: boolean;
  error?: string;
}> {
  try {
    const response = await axios.get(`/api/cambrian/verify-cache/${nodeId}/${contentHash}`);
    
    return {
      success: true,
      isCached: response.data.isCached
    };
  } catch (error: any) {
    console.error('Error verifying content cache:', error);
    return {
      success: false,
      isCached: false,
      error: error.response?.data?.message || 'Failed to verify content cache'
    };
  }
}

// Request content from the nearest NCN node
export async function requestContent(
  contentHash: string,
  clientIp?: string
): Promise<{
  success: boolean;
  nodeUrl?: string;
  ipfsHash?: string;
  error?: string;
}> {
  try {
    const response = await axios.get('/api/cambrian/request-content', {
      params: {
        contentHash,
        clientIp
      }
    });
    
    return {
      success: true,
      nodeUrl: response.data.nodeUrl,
      ipfsHash: response.data.ipfsHash
    };
  } catch (error: any) {
    console.error('Error requesting content:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to request content'
    };
  }
}

// Get node rewards
export async function getNodeRewards(
  nodeId: string,
  walletAddress: string,
  signature: string
): Promise<{
  success: boolean;
  rewards?: number;
  error?: string;
}> {
  try {
    const response = await axios.post('/api/cambrian/node-rewards', {
      nodeId,
      walletAddress,
      signature
    });
    
    return {
      success: true,
      rewards: response.data.rewards
    };
  } catch (error: any) {
    console.error('Error fetching node rewards:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch node rewards'
    };
  }
}

// Claim node rewards
export async function claimNodeRewards(
  nodeId: string,
  walletAddress: string,
  signature: string
): Promise<{
  success: boolean;
  transactionHash?: string;
  error?: string;
}> {
  try {
    const response = await axios.post('/api/cambrian/claim-rewards', {
      nodeId,
      walletAddress,
      signature
    });
    
    return {
      success: true,
      transactionHash: response.data.transactionHash
    };
  } catch (error: any) {
    console.error('Error claiming rewards:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to claim rewards'
    };
  }
}
