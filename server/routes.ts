import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authenticateJWT, authenticateWallet } from "./middlewares/auth";
import * as ncnController from "./controllers/ncn";
import * as contentController from "./controllers/content";
import * as tokensController from "./controllers/tokens";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes - All routes are prefixed with /api

  // Auth Routes
  app.post("/api/auth/wallet", authenticateWallet);

  // NCN Node Routes
  app.get("/api/ncn/stats", ncnController.getNetworkStats);
  app.get("/api/ncn/operator-stats", authenticateJWT, ncnController.getNodeOperatorStats);
  app.get("/api/ncn/nodes", authenticateJWT, ncnController.getOperatorNodes);
  app.post("/api/ncn/register-node", authenticateJWT, ncnController.registerNode);
  app.post("/api/ncn/update-node-stats", authenticateJWT, ncnController.updateNodeStats);
  app.get("/api/ncn/verify-cache/:nodeId/:contentHash", ncnController.verifyContentCache);

  // Content Routes
  app.get("/api/content/public", contentController.getPublicContent);
  app.get("/api/content/:hash", contentController.getContentByHash);
  app.get("/api/content/list", authenticateJWT, contentController.getUserContent);
  app.post("/api/content/upload", authenticateJWT, contentController.uploadContent);
  app.post("/api/cambrian/distribute-content", authenticateJWT, contentController.distributeContent);
  app.get("/api/cambrian/request-content", contentController.requestContent);

  // IPFS Routes
  app.post("/api/ipfs/upload", authenticateJWT, contentController.uploadToIPFS);
  app.get("/api/ipfs/get/:cid", contentController.getFromIPFS);
  app.post("/api/ipfs/pin", authenticateJWT, contentController.pinToIPFS);
  app.get("/api/ipfs/status/:cid", contentController.checkIPFSStatus);

  // Token Routes
  app.get("/api/tokens/balance", authenticateJWT, tokensController.getTokenBalance);
  app.get("/api/tokens/transactions", authenticateJWT, tokensController.getTransactionHistory);
  app.post("/api/tokens/stake", authenticateJWT, tokensController.stakeTokens);
  app.post("/api/tokens/unstake", authenticateJWT, tokensController.unstakeTokens);
  app.post("/api/tokens/tip", authenticateJWT, tokensController.sendTip);
  app.post("/api/cambrian/node-rewards", authenticateJWT, tokensController.getNodeRewards);
  app.post("/api/cambrian/claim-rewards", authenticateJWT, tokensController.claimNodeRewards);

  // User Routes
  app.get("/api/user/profile", authenticateJWT, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send the password
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/user/sol-balance", authenticateJWT, async (req, res) => {
    try {
      // Get SOL balance from Solana blockchain
      // In a real implementation, this would make a call to the Solana RPC
      const balance = Math.random() * 10; // Mock balance for now
      
      res.json({ balance });
    } catch (error) {
      console.error("Error fetching SOL balance:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/user/profile", authenticateJWT, async (req, res) => {
    try {
      const { username, avatarUrl } = req.body;
      
      // In a real implementation, this would update the user in the database
      
      res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/user/notifications", authenticateJWT, async (req, res) => {
    try {
      const { emailNotifications, contentAlerts, rewardAlerts } = req.body;
      
      // In a real implementation, this would update the notification settings in the database
      
      res.json({ success: true, message: "Notification settings updated successfully" });
    } catch (error) {
      console.error("Error updating notification settings:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
