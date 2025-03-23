import { Request, Response, NextFunction } from 'express';
import * as solanaService from '../services/solana';
import jwt from 'jsonwebtoken';
import { storage } from '../storage';
import * as nacl from 'tweetnacl';
import * as bs58 from 'bs58';
import { ethers } from 'ethers';

// Secret key for JWT, in production this would be an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'nebula-cdn-secret-key';

// JWT token expiration time
const JWT_EXPIRATION = '24h';

// Add user property to Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        walletAddress: string | null;
        walletType: string | null;
      };
    }
  }
}

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    // If no token is provided, check for development mode
    if (!token) {
      if (process.env.NODE_ENV === 'development' && process.env.SKIP_AUTH === 'true') {
        // For development, attach a mock user
        req.user = {
          id: 1,
          username: 'demo',
          walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
          walletType: 'metamask'
        };
        return next();
      }
      return res.status(401).json({ message: 'No authentication token provided' });
    }
    
    // Verify the token
    jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
      }
      
      // Get the user from the database
      const user = await storage.getUser(decoded.id);
      
      if (!user) {
        return res.status(403).json({ message: 'User not found' });
      }
      
      // Set the user on the request object
      req.user = {
        id: user.id,
        username: user.username,
        walletAddress: user.walletAddress,
        walletType: user.walletType
      };
      
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Internal server error during authentication' });
  }
};

/**
 * Verify Solana wallet signature
 */
const verifySolanaSignature = (walletAddress: string, message: string, signature: string): boolean => {
  try {
    // In development mode with simulated signature, return true
    if (process.env.NODE_ENV !== 'production' && signature === 'simulated_signature') {
      return true;
    }
    
    const messageBytes = Buffer.from(message);
    const signatureBytes = bs58.decode(signature);
    const publicKeyBytes = bs58.decode(walletAddress);
    
    return nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );
  } catch (error) {
    console.error('Error verifying Solana signature:', error);
    return false;
  }
};

/**
 * Verify Ethereum wallet signature
 */
const verifyEthereumSignature = (walletAddress: string, message: string, signature: string): boolean => {
  try {
    // In development mode with simulated signature, return true
    if (process.env.NODE_ENV !== 'production' && signature === 'simulated_signature') {
      return true;
    }
    
    // For Ethereum, we need to recover the address from the signature
    // and compare it with the provided wallet address
    const msgHex = Buffer.from(message).toString('hex');
    const msgBuffer = Buffer.from(msgHex, 'hex');
    const prefix = Buffer.from(`\x19Ethereum Signed Message:\n${msgBuffer.length}`);
    const prefixedMsg = Buffer.concat([prefix, msgBuffer]);
    
    const signerAddress = ethers.utils.verifyMessage(message, signature);
    
    return signerAddress.toLowerCase() === walletAddress.toLowerCase();
  } catch (error) {
    console.error('Error verifying Ethereum signature:', error);
    return false;
  }
};

/**
 * Handler to authenticate using wallet signature and generate JWT
 */
export const authenticateWallet = async (req: Request, res: Response) => {
  try {
    const { walletAddress, signature, message, walletType } = req.body;
    
    if (!walletAddress || !signature || !message) {
      return res.status(400).json({ message: 'Wallet address, signature, and message are required' });
    }
    
    // Verify the signature based on wallet type
    let isValid = false;
    if (walletType === 'phantom') {
      isValid = verifySolanaSignature(walletAddress, message, signature);
    } else {
      // For MetaMask, Brave Wallet, or other Ethereum-based wallets
      isValid = verifyEthereumSignature(walletAddress, message, signature);
    }
    
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid signature' });
    }
    
    // Find or create user
    let user = await storage.getUserByWalletAddress(walletAddress);
    
    if (!user) {
      // Create a new user
      const username = `user_${Math.floor(Math.random() * 10000)}`;
      
      user = await storage.createUser({
        username,
        password: '', // No password for wallet-based auth
        walletAddress,
        walletType: walletType || null,
        avatarUrl: null
      });
    } else {
      // Update wallet type if it changed
      if (user.walletType !== walletType) {
        user = await storage.updateUser(user.id, { walletType });
      }
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, walletAddress: user.walletAddress },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        walletAddress: user.walletAddress,
        walletType: user.walletType
      }
    });
  } catch (error) {
    console.error('Error during wallet authentication:', error);
    res.status(500).json({ message: 'Internal server error during authentication' });
  }
};

/**
 * Middleware to validate that the user has a wallet address
 */
export const requireWalletAddress = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.walletAddress) {
    return res.status(403).json({ message: 'This action requires a connected wallet' });
  }
  next();
};
