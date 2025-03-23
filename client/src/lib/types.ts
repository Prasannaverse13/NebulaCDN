// User-related types
export interface User {
  id: number;
  username: string;
  walletAddress: string | null;
  walletType: 'metamask' | 'phantom' | 'brave' | null;
  avatarUrl: string | null;
  createdAt: string;
}

// Content-related types
export interface ContentItem {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  contentHash: string;
  contentType: string;
  ipfsHash: string;
  arweaveHash: string | null;
  solanaTransaction: string | null;
  size: number;
  isPublic: boolean;
  isPremium: boolean;
  metadata: any;
  createdAt: string;
  updatedAt: string;
  // Expanded data
  username?: string;
  userWalletAddress?: string;
  cachedOnNodes?: number;
  accessCount?: number;
}

export interface ContentUploadParams {
  title: string;
  description?: string;
  file: File;
  isPublic: boolean;
  isPremium: boolean;
  metadata?: Record<string, any>;
}

// NCN Node-related types
export interface NcnNode {
  id: number;
  nodeId: string;
  userId: number | null;
  name: string;
  ipAddress: string | null;
  port: number | null;
  stakeAmount: number;
  isActive: boolean;
  stats: NodeStats | null;
  lastSeen: string;
  createdAt: string;
  // Expanded data
  username?: string;
  userWalletAddress?: string;
  contentsCached?: number;
  performance?: number;
}

export interface NodeStats {
  cpuUsage?: number;
  memoryUsage?: number;
  diskUsage?: number;
  bandwidthUsed?: number;
  uptimePercentage?: number;
  cacheHits?: number;
  cacheMisses?: number;
  requestsServed?: number;
  lastUpdated?: string;
}

export interface NetworkStats {
  activeNodes: number;
  cachedFiles: number;
  totalStorage: string;
  responseTime: string;
  totalTokensStaked: number;
  totalRewardsDistributed: number;
}

// Content Distribution-related types
export interface ContentDistribution {
  id: number;
  contentId: number;
  nodeId: number;
  isCached: boolean;
  cacheTimestamp: string | null;
  accessCount: number;
  lastAccessed: string | null;
  // Expanded data
  nodeName?: string;
  nodeIpAddress?: string;
  contentTitle?: string;
  contentHash?: string;
}

// Token-related types
export interface TokenTransaction {
  id: number;
  userId: number;
  transactionType: 'stake' | 'reward' | 'tip' | 'unstake';
  amount: number;
  receiverId: number | null;
  contentId: number | null;
  nodeId: number | null;
  transactionHash: string | null;
  createdAt: string;
  // Expanded data
  username?: string;
  userWalletAddress?: string;
  receiverUsername?: string;
  receiverWalletAddress?: string;
  contentTitle?: string;
  nodeName?: string;
}

export interface StakeParams {
  amount: number;
  walletAddress: string;
  signature: string;
}

export interface TipParams {
  amount: number;
  contentId: number;
  creatorAddress: string;
  senderWalletAddress: string;
  signature: string;
}

// Authentication-related types
export interface SignatureData {
  message: string;
  signature: string;
  walletAddress: string;
}

// Dashboard-related types
export interface UserDashboardStats {
  contentCount: number;
  totalStorage: string;
  totalViews: number;
  tipsReceived: number;
  rewardsEarned: number;
}

export interface NodeOperatorStats {
  nodesCount: number;
  totalStaked: number;
  totalRewards: number;
  averageUptime: number;
  cacheHitRatio: number;
  cacheSize: string;
}
