import { users, type User, type InsertUser, contentItems, type ContentItem, type InsertContentItem, ncnNodes, type NcnNode, type InsertNcnNode, contentDistribution, type ContentDistribution, type InsertContentDistribution, tokenTransactions, type TokenTransaction, type InsertTokenTransaction } from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User-related operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Content-related operations
  getContentItem(id: number): Promise<ContentItem | undefined>;
  getContentItemByHash(contentHash: string): Promise<ContentItem | undefined>;
  getUserContentItems(userId: number): Promise<ContentItem[]>;
  getPublicContentItems(): Promise<ContentItem[]>;
  createContentItem(item: InsertContentItem): Promise<ContentItem>;
  updateContentItem(id: number, updates: Partial<ContentItem>): Promise<ContentItem | undefined>;
  
  // NCN Node operations
  getNcnNode(id: number): Promise<NcnNode | undefined>;
  getNcnNodeByNodeId(nodeId: string): Promise<NcnNode | undefined>;
  getUserNodes(userId: number): Promise<NcnNode[]>;
  getActiveNodes(): Promise<NcnNode[]>;
  createNcnNode(node: InsertNcnNode): Promise<NcnNode>;
  updateNcnNode(id: number, updates: Partial<NcnNode>): Promise<NcnNode | undefined>;
  
  // Content Distribution operations
  getContentDistribution(contentId: number, nodeId: number): Promise<ContentDistribution | undefined>;
  getNodeDistributions(nodeId: number): Promise<ContentDistribution[]>;
  getContentDistributions(contentId: number): Promise<ContentDistribution[]>;
  createContentDistribution(distribution: InsertContentDistribution): Promise<ContentDistribution>;
  updateContentDistribution(id: number, updates: Partial<ContentDistribution>): Promise<ContentDistribution | undefined>;
  
  // Token Transaction operations
  getTokenTransaction(id: number): Promise<TokenTransaction | undefined>;
  getUserTransactions(userId: number): Promise<TokenTransaction[]>;
  createTokenTransaction(transaction: InsertTokenTransaction): Promise<TokenTransaction>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contentItems: Map<number, ContentItem>;
  private ncnNodes: Map<number, NcnNode>;
  private contentDistributions: Map<number, ContentDistribution>;
  private tokenTransactions: Map<number, TokenTransaction>;
  private currentIds: {
    user: number;
    contentItem: number;
    ncnNode: number;
    contentDistribution: number;
    tokenTransaction: number;
  };

  constructor() {
    this.users = new Map();
    this.contentItems = new Map();
    this.ncnNodes = new Map();
    this.contentDistributions = new Map();
    this.tokenTransactions = new Map();
    this.currentIds = {
      user: 1,
      contentItem: 1,
      ncnNode: 1,
      contentDistribution: 1,
      tokenTransaction: 1
    };
    
    // Add sample user for development
    this.createUser({
      username: "demo",
      password: "$2b$10$mockhashedpassword",
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      walletType: "metamask",
      avatarUrl: null
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.user++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Content operations
  async getContentItem(id: number): Promise<ContentItem | undefined> {
    return this.contentItems.get(id);
  }

  async getContentItemByHash(contentHash: string): Promise<ContentItem | undefined> {
    return Array.from(this.contentItems.values()).find(
      (item) => item.contentHash === contentHash
    );
  }

  async getUserContentItems(userId: number): Promise<ContentItem[]> {
    return Array.from(this.contentItems.values()).filter(
      (item) => item.userId === userId
    );
  }

  async getPublicContentItems(): Promise<ContentItem[]> {
    return Array.from(this.contentItems.values()).filter(
      (item) => item.isPublic
    );
  }

  async createContentItem(insertItem: InsertContentItem): Promise<ContentItem> {
    const id = this.currentIds.contentItem++;
    const item: ContentItem = { 
      ...insertItem, 
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.contentItems.set(id, item);
    return item;
  }

  async updateContentItem(id: number, updates: Partial<ContentItem>): Promise<ContentItem | undefined> {
    const item = this.contentItems.get(id);
    if (!item) return undefined;
    
    const updatedItem: ContentItem = { 
      ...item, 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.contentItems.set(id, updatedItem);
    return updatedItem;
  }

  // NCN Node operations
  async getNcnNode(id: number): Promise<NcnNode | undefined> {
    return this.ncnNodes.get(id);
  }

  async getNcnNodeByNodeId(nodeId: string): Promise<NcnNode | undefined> {
    return Array.from(this.ncnNodes.values()).find(
      (node) => node.nodeId === nodeId
    );
  }

  async getUserNodes(userId: number): Promise<NcnNode[]> {
    return Array.from(this.ncnNodes.values()).filter(
      (node) => node.userId === userId
    );
  }

  async getActiveNodes(): Promise<NcnNode[]> {
    return Array.from(this.ncnNodes.values()).filter(
      (node) => node.isActive
    );
  }

  async createNcnNode(insertNode: InsertNcnNode): Promise<NcnNode> {
    const id = this.currentIds.ncnNode++;
    const node: NcnNode = { 
      ...insertNode, 
      id,
      createdAt: new Date().toISOString(),
      lastSeen: new Date().toISOString()
    };
    this.ncnNodes.set(id, node);
    return node;
  }

  async updateNcnNode(id: number, updates: Partial<NcnNode>): Promise<NcnNode | undefined> {
    const node = this.ncnNodes.get(id);
    if (!node) return undefined;
    
    const updatedNode: NcnNode = { 
      ...node, 
      ...updates,
      lastSeen: new Date().toISOString()
    };
    this.ncnNodes.set(id, updatedNode);
    return updatedNode;
  }

  // Content Distribution operations
  async getContentDistribution(contentId: number, nodeId: number): Promise<ContentDistribution | undefined> {
    return Array.from(this.contentDistributions.values()).find(
      (dist) => dist.contentId === contentId && dist.nodeId === nodeId
    );
  }

  async getNodeDistributions(nodeId: number): Promise<ContentDistribution[]> {
    return Array.from(this.contentDistributions.values()).filter(
      (dist) => dist.nodeId === nodeId
    );
  }

  async getContentDistributions(contentId: number): Promise<ContentDistribution[]> {
    return Array.from(this.contentDistributions.values()).filter(
      (dist) => dist.contentId === contentId
    );
  }

  async createContentDistribution(insertDistribution: InsertContentDistribution): Promise<ContentDistribution> {
    const id = this.currentIds.contentDistribution++;
    const distribution: ContentDistribution = { 
      ...insertDistribution, 
      id,
      cacheTimestamp: insertDistribution.isCached ? new Date().toISOString() : null,
      lastAccessed: null
    };
    this.contentDistributions.set(id, distribution);
    return distribution;
  }

  async updateContentDistribution(id: number, updates: Partial<ContentDistribution>): Promise<ContentDistribution | undefined> {
    const distribution = this.contentDistributions.get(id);
    if (!distribution) return undefined;
    
    const updatedDistribution: ContentDistribution = { 
      ...distribution, 
      ...updates,
      cacheTimestamp: updates.isCached ? new Date().toISOString() : distribution.cacheTimestamp,
      lastAccessed: updates.accessCount !== undefined ? new Date().toISOString() : distribution.lastAccessed
    };
    this.contentDistributions.set(id, updatedDistribution);
    return updatedDistribution;
  }

  // Token Transaction operations
  async getTokenTransaction(id: number): Promise<TokenTransaction | undefined> {
    return this.tokenTransactions.get(id);
  }

  async getUserTransactions(userId: number): Promise<TokenTransaction[]> {
    return Array.from(this.tokenTransactions.values()).filter(
      (tx) => tx.userId === userId || tx.receiverId === userId
    );
  }

  async createTokenTransaction(insertTransaction: InsertTokenTransaction): Promise<TokenTransaction> {
    const id = this.currentIds.tokenTransaction++;
    const transaction: TokenTransaction = { 
      ...insertTransaction, 
      id,
      createdAt: new Date().toISOString()
    };
    this.tokenTransactions.set(id, transaction);
    return transaction;
  }
}

export const storage = new MemStorage();
