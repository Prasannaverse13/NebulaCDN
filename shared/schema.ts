import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address").unique(),
  walletType: text("wallet_type"), // 'metamask', 'phantom', 'brave'
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Content items table
export const contentItems = pgTable("content_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  contentHash: text("content_hash").notNull().unique(),
  contentType: text("content_type").notNull(), // 'image', 'video', 'webpage', etc.
  ipfsHash: text("ipfs_hash"),
  arweaveHash: text("arweave_hash"),
  solanaTransaction: text("solana_transaction"),
  size: integer("size").notNull(), // Size in bytes
  isPublic: boolean("is_public").default(true).notNull(),
  isPremium: boolean("is_premium").default(false).notNull(),
  metadata: jsonb("metadata"), // Additional metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// NCN Nodes table
export const ncnNodes = pgTable("ncn_nodes", {
  id: serial("id").primaryKey(),
  nodeId: text("node_id").notNull().unique(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  ipAddress: text("ip_address"),
  port: integer("port"),
  stakeAmount: integer("stake_amount").notNull().default(0),
  isActive: boolean("is_active").default(true).notNull(),
  stats: jsonb("stats"), // Performance stats
  lastSeen: timestamp("last_seen").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Content Distribution table
export const contentDistribution = pgTable("content_distribution", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").notNull().references(() => contentItems.id),
  nodeId: integer("node_id").notNull().references(() => ncnNodes.id),
  isCached: boolean("is_cached").default(false).notNull(),
  cacheTimestamp: timestamp("cache_timestamp"),
  accessCount: integer("access_count").default(0).notNull(),
  lastAccessed: timestamp("last_accessed"),
});

// Token Transactions table
export const tokenTransactions = pgTable("token_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  transactionType: text("transaction_type").notNull(), // 'stake', 'reward', 'tip', 'unstake'
  amount: integer("amount").notNull(),
  receiverId: integer("receiver_id").references(() => users.id),
  contentId: integer("content_id").references(() => contentItems.id),
  nodeId: integer("node_id").references(() => ncnNodes.id),
  transactionHash: text("transaction_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertContentItemSchema = createInsertSchema(contentItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNcnNodeSchema = createInsertSchema(ncnNodes).omit({
  id: true,
  createdAt: true,
  lastSeen: true,
});

export const insertContentDistributionSchema = createInsertSchema(contentDistribution).omit({
  id: true,
});

export const insertTokenTransactionSchema = createInsertSchema(tokenTransactions).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContentItem = z.infer<typeof insertContentItemSchema>;
export type ContentItem = typeof contentItems.$inferSelect;

export type InsertNcnNode = z.infer<typeof insertNcnNodeSchema>;
export type NcnNode = typeof ncnNodes.$inferSelect;

export type InsertContentDistribution = z.infer<typeof insertContentDistributionSchema>;
export type ContentDistribution = typeof contentDistribution.$inferSelect;

export type InsertTokenTransaction = z.infer<typeof insertTokenTransactionSchema>;
export type TokenTransaction = typeof tokenTransactions.$inferSelect;
