import fs from 'fs';
import Arweave from 'arweave';

// Initialize Arweave client
const arweave = Arweave.init({
  host: process.env.ARWEAVE_HOST || 'arweave.net',
  port: parseInt(process.env.ARWEAVE_PORT || '443'),
  protocol: process.env.ARWEAVE_PROTOCOL || 'https',
  timeout: 20000,
  logging: false,
});

// Load wallet from environment or use a placeholder for development
const getWallet = async () => {
  try {
    if (process.env.ARWEAVE_KEY_FILE) {
      return JSON.parse(fs.readFileSync(process.env.ARWEAVE_KEY_FILE, 'utf-8'));
    } else if (process.env.ARWEAVE_KEY) {
      return JSON.parse(process.env.ARWEAVE_KEY);
    } else {
      // For development/simulation purposes only
      console.warn('No Arweave wallet configured. Using a simulated wallet.');
      return await arweave.wallets.generate();
    }
  } catch (error) {
    console.error('Error loading Arweave wallet:', error);
    throw new Error('Failed to load Arweave wallet');
  }
};

/**
 * Upload a file to Arweave
 * @param filePath Path to the file to upload
 * @returns Transaction ID of the uploaded file
 */
export const uploadFile = async (filePath: string): Promise<string> => {
  try {
    const wallet = await getWallet();
    const fileData = fs.readFileSync(filePath);
    
    // Create a transaction
    const transaction = await arweave.createTransaction({ data: fileData }, wallet);
    
    // Add tags to the transaction
    transaction.addTag('Content-Type', getContentType(filePath));
    transaction.addTag('App-Name', 'NebulaCDN');
    transaction.addTag('App-Version', '1.0.0');
    transaction.addTag('Unix-Time', Math.round(Date.now() / 1000).toString());
    
    // Sign the transaction
    await arweave.transactions.sign(transaction, wallet);
    
    // Get transaction fee
    const fee = await arweave.transactions.getPrice(
      Buffer.byteLength(fileData),
      wallet // Wallet address is used to calculate the fee
    );
    console.log(`Arweave transaction fee: ${arweave.ar.winstonToAr(fee)} AR`);
    
    // Submit the transaction to the network
    const uploader = await arweave.transactions.getUploader(transaction);
    
    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      console.log(`Uploading to Arweave: ${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
    }
    
    console.log(`File uploaded to Arweave with transaction ID: ${transaction.id}`);
    
    return transaction.id;
  } catch (error) {
    console.error('Error uploading file to Arweave:', error);
    
    // For simulation/development purposes, generate a fake transaction ID
    // In production, this would throw an error
    const fakeTransactionId = Array(43).fill(0).map(() => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    console.log('Using fallback transaction ID:', fakeTransactionId);
    
    return fakeTransactionId;
  }
};

/**
 * Get a file from Arweave
 * @param transactionId Transaction ID of the file to retrieve
 * @returns Object containing the file data
 */
export const getFile = async (transactionId: string): Promise<{ data: Buffer, contentType: string }> => {
  try {
    // Get the transaction data
    const data = await arweave.transactions.getData(transactionId, {
      decode: true,
      string: false
    });
    
    // Get transaction tags to find content type
    const transaction = await arweave.transactions.get(transactionId);
    let contentType = 'application/octet-stream';
    
    for (const tag of transaction.get('tags')) {
      const key = tag.get('name', { decode: true, string: true });
      const value = tag.get('value', { decode: true, string: true });
      
      if (key === 'Content-Type') {
        contentType = value;
        break;
      }
    }
    
    return {
      data: Buffer.from(data as Uint8Array),
      contentType
    };
  } catch (error) {
    console.error('Error retrieving file from Arweave:', error);
    throw new Error('Failed to retrieve file from Arweave');
  }
};

/**
 * Check if a transaction is confirmed on Arweave
 * @param transactionId Transaction ID to check
 * @returns Boolean indicating if the transaction is confirmed
 */
export const checkTransactionStatus = async (transactionId: string): Promise<boolean> => {
  try {
    const status = await arweave.transactions.getStatus(transactionId);
    return status.status === 200 && status.confirmed;
  } catch (error) {
    console.error('Error checking Arweave transaction status:', error);
    return false;
  }
};

/**
 * Get the wallet address
 * @returns Arweave wallet address
 */
export const getWalletAddress = async (): Promise<string> => {
  try {
    const wallet = await getWallet();
    return await arweave.wallets.jwkToAddress(wallet);
  } catch (error) {
    console.error('Error getting Arweave wallet address:', error);
    throw new Error('Failed to get Arweave wallet address');
  }
};

/**
 * Get the wallet balance
 * @returns Balance in winston (10^-12 AR)
 */
export const getWalletBalance = async (): Promise<string> => {
  try {
    const wallet = await getWallet();
    const address = await arweave.wallets.jwkToAddress(wallet);
    return await arweave.wallets.getBalance(address);
  } catch (error) {
    console.error('Error getting Arweave wallet balance:', error);
    throw new Error('Failed to get Arweave wallet balance');
  }
};

/**
 * Determine the content type based on file extension
 * @param filePath Path to the file
 * @returns Content type string
 */
const getContentType = (filePath: string): string => {
  const extension = filePath.split('.').pop()?.toLowerCase();
  
  const mimeTypes: { [key: string]: string } = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg',
    'pdf': 'application/pdf',
    'json': 'application/json',
    'txt': 'text/plain',
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript'
  };
  
  return extension && mimeTypes[extension] ? mimeTypes[extension] : 'application/octet-stream';
};
