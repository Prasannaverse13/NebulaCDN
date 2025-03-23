import { Request, Response } from 'express';
import { storage } from '../storage';
import { ContentItem } from '../../client/src/lib/types';
import * as ipfsService from '../services/ipfs';
import * as arweaveService from '../services/arweave';
import * as solanaService from '../services/solana';
import * as cambrianService from '../services/cambrian';
import * as crypto from 'crypto';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Configure multer for file uploads
const upload = multer({ 
  dest: os.tmpdir(),
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

/**
 * Get all public content
 */
export const getPublicContent = async (req: Request, res: Response) => {
  try {
    // In a production environment, this would fetch content from the database
    const contentItems: ContentItem[] = [
      {
        id: 1,
        userId: 1,
        title: "Introduction to Decentralized Storage",
        description: "Learn about IPFS, Arweave, and other decentralized storage solutions.",
        contentHash: "bafybeihtkxyhemz65olpwpblj672yj37gdkhnrwpmg3r5vrdvhsmcgwkt4",
        contentType: "application/pdf",
        ipfsHash: "QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
        arweaveHash: null,
        solanaTransaction: "5srKiM3PJhJGZgiaSiMKZSuNz6EJmEUxgYLGkFWU9NFL7zzQGkC8qEajxV5UXi8JYAxRGi9n5cAgm8mBbWABHVDz",
        size: 2048576,
        isPublic: true,
        isPremium: false,
        metadata: { author: "Alice", tags: ["education", "web3", "storage"] },
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        username: "alice_blockchain",
        userWalletAddress: "0x1234567890abcdef1234567890abcdef12345678",
        cachedOnNodes: 156,
        accessCount: 428
      },
      {
        id: 2,
        userId: 2,
        title: "Web3 Development Tutorial",
        description: "A comprehensive guide to building Web3 applications.",
        contentHash: "bafybeibzktuxufqchuozhlzj7xmzdqfxihobsjqt3ikdysxsagrafye7qe",
        contentType: "video/mp4",
        ipfsHash: "QmNXcxaNMYhGXvKt7Lmd8eoQ1vVEBL1rx7tQY1B15uh7C6",
        arweaveHash: "arweave-hash-placeholder",
        solanaTransaction: "2QoLKp5AqLqMa3aXCaL3gGrLm9nvRhwHFrdDt9E1NtY35yrYcbRYkXFEfH9JnbGNdXRjN6snC3vMSC1c4hBQRrRg",
        size: 52428800,
        isPublic: true,
        isPremium: true,
        metadata: { author: "Bob", tags: ["tutorial", "web3", "development"] },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        username: "bob_developer",
        userWalletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
        cachedOnNodes: 87,
        accessCount: 256
      },
      {
        id: 3,
        userId: 3,
        title: "Blockchain Art Collection",
        description: "A collection of digital art stored on the blockchain.",
        contentHash: "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
        contentType: "image/png",
        ipfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
        arweaveHash: null,
        solanaTransaction: "3J7HuhWXf5e9RqMBTAcLYzjTEZqKXYrpVYtxfML9qxWYLFgKdXPxUruAJLGXy5N4SPMx5JCC58FuX9kRoEQjADfP",
        size: 5242880,
        isPublic: true,
        isPremium: false,
        metadata: { author: "Charlie", tags: ["art", "nft", "creative"] },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        username: "charlie_artist",
        userWalletAddress: "0x7890abcdef1234567890abcdef1234567890abcd",
        cachedOnNodes: 243,
        accessCount: 789
      }
    ];
    
    res.json(contentItems);
  } catch (error) {
    console.error('Error fetching public content:', error);
    res.status(500).json({ message: 'Failed to fetch public content' });
  }
};

/**
 * Get content by hash
 */
export const getContentByHash = async (req: Request, res: Response) => {
  try {
    const { hash } = req.params;
    
    if (!hash) {
      return res.status(400).json({ message: 'Content hash is required' });
    }
    
    // In a production environment, this would fetch content from the database
    // based on the content hash
    const mockContent: ContentItem = {
      id: 4,
      userId: 1,
      title: "Content for hash: " + hash.substring(0, 10),
      description: "This is the content associated with the provided hash.",
      contentHash: hash,
      contentType: "application/octet-stream",
      ipfsHash: "QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
      arweaveHash: null,
      solanaTransaction: "5srKiM3PJhJGZgiaSiMKZSuNz6EJmEUxgYLGkFWU9NFL7zzQGkC8qEajxV5UXi8JYAxRGi9n5cAgm8mBbWABHVDz",
      size: 1024,
      isPublic: true,
      isPremium: false,
      metadata: { retrieved: true },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    res.json({ content: mockContent });
  } catch (error) {
    console.error('Error fetching content by hash:', error);
    res.status(500).json({ message: 'Failed to fetch content' });
  }
};

/**
 * Get all content for the authenticated user
 */
export const getUserContent = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // In a production environment, this would fetch content from the database
    // based on the user ID
    const userContentItems: ContentItem[] = [
      {
        id: 5,
        userId: userId,
        title: "My Private Document",
        description: "A private document only I can see.",
        contentHash: "bafybeihxcpczn4l7nmuzlkm4qy6vfa4g7g3gcasxas7dwqlcpvahv7g24m",
        contentType: "application/pdf",
        ipfsHash: "QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
        arweaveHash: null,
        solanaTransaction: "2cLMawdYCxsLRj6G9hDKL6Nx3JMwMSxGxh5TK25qjgzPEP4q1TvCMNKnmJF5Y3HNzq6Mhw7x5Yf8QsK2b5fQDKDN",
        size: 1048576,
        isPublic: false,
        isPremium: false,
        metadata: { author: "Me", tags: ["private", "document"] },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        cachedOnNodes: 42,
        accessCount: 17
      },
      {
        id: 6,
        userId: userId,
        title: "Premium Content",
        description: "Premium content available to subscribers.",
        contentHash: "bafybeigj5zzhg4pqxuuqulnzpvi4hqbfeedogpxfplhct5swfkrcrhkvui",
        contentType: "video/mp4",
        ipfsHash: "QmNXcxaNMYhGXvKt7Lmd8eoQ1vVEBL1rx7tQY1B15uh7C6",
        arweaveHash: "arweave-hash-placeholder",
        solanaTransaction: "3J7HuhWXf5e9RqMBTAcLYzjTEZqKXYrpVYtxfML9qxWYLFgKdXPxUruAJLGXy5N4SPMx5JCC58FuX9kRoEQjADfP",
        size: 26214400,
        isPublic: true,
        isPremium: true,
        metadata: { author: "Me", tags: ["premium", "video"] },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        cachedOnNodes: 156,
        accessCount: 89
      }
    ];
    
    res.json(userContentItems);
  } catch (error) {
    console.error('Error fetching user content:', error);
    res.status(500).json({ message: 'Failed to fetch user content' });
  }
};

/**
 * Upload content to NebulaCDN
 */
export const uploadContent = async (req: Request, res: Response) => {
  // Use multer middleware for handling multipart/form-data
  upload.array('files')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    try {
      const files = req.files as Express.Multer.File[];
      const { title, description, isPublic, isPremium } = req.body;
      const userId = req.user.id;
      const walletAddress = req.user.walletAddress;
      
      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }
      
      if (!title) {
        return res.status(400).json({ message: 'Title is required' });
      }
      
      // Process each file
      const results = await Promise.all(files.map(async (file) => {
        // Calculate content hash
        const fileBuffer = fs.readFileSync(file.path);
        const contentHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
        
        // Upload to IPFS
        const ipfsResult = await ipfsService.uploadFile(file.path);
        
        // Upload to Arweave (optional, based on file size or content type)
        let arweaveHash = null;
        if (file.size < 5 * 1024 * 1024) { // Less than 5MB
          arweaveHash = await arweaveService.uploadFile(file.path);
        }
        
        // Store metadata on Solana blockchain
        const message = `Store metadata for content: ${contentHash}`;
        const signature = "simulated_signature"; // In production, this would be signed by the client
        
        const solanaResult = await solanaService.storeContentMetadata(
          contentHash,
          ipfsResult.cid,
          arweaveHash,
          walletAddress,
          signature
        );
        
        // Clean up temporary file
        fs.unlinkSync(file.path);
        
        // Create content item in database
        const contentItem: ContentItem = {
          id: Math.floor(Math.random() * 1000) + 10, // This would be assigned by the database
          userId: userId,
          title: title,
          description: description || null,
          contentHash: contentHash,
          contentType: file.mimetype,
          ipfsHash: ipfsResult.cid,
          arweaveHash: arweaveHash,
          solanaTransaction: solanaResult,
          size: file.size,
          isPublic: isPublic === 'true',
          isPremium: isPremium === 'true',
          metadata: { 
            originalName: file.originalname,
            uploadDate: new Date().toISOString()
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        return contentItem;
      }));
      
      res.status(201).json({
        message: 'Content uploaded successfully',
        contentItems: results
      });
      
    } catch (error) {
      console.error('Error uploading content:', error);
      
      // Clean up any remaining temporary files
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files as Express.Multer.File[]) {
          try {
            fs.unlinkSync(file.path);
          } catch (unlinkError) {
            console.error('Error deleting temporary file:', unlinkError);
          }
        }
      }
      
      res.status(500).json({ message: 'Failed to upload content' });
    }
  });
};

/**
 * Upload file to IPFS
 */
export const uploadToIPFS = async (req: Request, res: Response) => {
  // Use multer middleware for handling file upload
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    try {
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      // Upload to IPFS
      const result = await ipfsService.uploadFile(file.path);
      
      // Clean up temporary file
      fs.unlinkSync(file.path);
      
      res.json({
        cid: result.cid,
        size: file.size,
        name: file.originalname
      });
      
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      
      // Clean up temporary file if it exists
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting temporary file:', unlinkError);
        }
      }
      
      res.status(500).json({ message: 'Failed to upload to IPFS' });
    }
  });
};

/**
 * Get file from IPFS
 */
export const getFromIPFS = async (req: Request, res: Response) => {
  try {
    const { cid } = req.params;
    
    if (!cid) {
      return res.status(400).json({ message: 'CID is required' });
    }
    
    // Get file from IPFS
    const result = await ipfsService.getFile(cid);
    
    if (!result.success) {
      return res.status(404).json({ message: 'File not found on IPFS' });
    }
    
    // Set appropriate content type if available
    if (result.contentType) {
      res.setHeader('Content-Type', result.contentType);
    } else {
      res.setHeader('Content-Type', 'application/octet-stream');
    }
    
    res.send(result.data);
    
  } catch (error) {
    console.error('Error getting file from IPFS:', error);
    res.status(500).json({ message: 'Failed to get file from IPFS' });
  }
};

/**
 * Pin file to IPFS
 */
export const pinToIPFS = async (req: Request, res: Response) => {
  try {
    const { cid } = req.body;
    
    if (!cid) {
      return res.status(400).json({ message: 'CID is required' });
    }
    
    // Pin file to IPFS
    const result = await ipfsService.pinFile(cid);
    
    if (!result.success) {
      return res.status(400).json({ message: result.error || 'Failed to pin file' });
    }
    
    res.json({ success: true, message: 'File pinned successfully' });
    
  } catch (error) {
    console.error('Error pinning file to IPFS:', error);
    res.status(500).json({ message: 'Failed to pin file to IPFS' });
  }
};

/**
 * Check if file exists on IPFS
 */
export const checkIPFSStatus = async (req: Request, res: Response) => {
  try {
    const { cid } = req.params;
    
    if (!cid) {
      return res.status(400).json({ message: 'CID is required' });
    }
    
    // Check if file exists on IPFS
    const result = await ipfsService.checkFileStatus(cid);
    
    res.json({ exists: result.exists });
    
  } catch (error) {
    console.error('Error checking IPFS status:', error);
    res.status(500).json({ message: 'Failed to check IPFS status' });
  }
};

/**
 * Distribute content to NCN nodes
 */
export const distributeContent = async (req: Request, res: Response) => {
  try {
    const { contentId, contentHash, ipfsHash, signature } = req.body;
    const walletAddress = req.user.walletAddress;
    
    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address not found' });
    }
    
    if (!contentId || !contentHash || !ipfsHash) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
    
    // Verify signature
    const isValid = await solanaService.verifySignature(
      walletAddress,
      `Distribute content: ${contentHash}`,
      signature
    );
    
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid signature' });
    }
    
    // Distribute content to NCN nodes via Cambrian SDK
    const result = await cambrianService.distributeContent(
      contentId,
      contentHash,
      ipfsHash,
      walletAddress,
      signature
    );
    
    if (!result.success) {
      return res.status(400).json({ message: result.error || 'Failed to distribute content' });
    }
    
    res.json({ 
      message: 'Content distributed successfully',
      distributedNodes: result.distributedNodes || 0
    });
    
  } catch (error) {
    console.error('Error distributing content:', error);
    res.status(500).json({ message: 'Failed to distribute content' });
  }
};

/**
 * Request content from the nearest NCN node
 */
export const requestContent = async (req: Request, res: Response) => {
  try {
    const { contentHash, clientIp } = req.query;
    
    if (!contentHash) {
      return res.status(400).json({ message: 'Content hash is required' });
    }
    
    // Request content from nearest NCN node via Cambrian SDK
    const result = await cambrianService.requestContent(
      contentHash as string,
      clientIp as string | undefined
    );
    
    if (!result.success) {
      return res.status(404).json({ message: result.error || 'Content not found' });
    }
    
    res.json({ 
      nodeUrl: result.nodeUrl,
      ipfsHash: result.ipfsHash
    });
    
  } catch (error) {
    console.error('Error requesting content:', error);
    res.status(500).json({ message: 'Failed to request content' });
  }
};
