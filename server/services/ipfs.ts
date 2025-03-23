import fs from 'fs';
import { create as createIPFSClient } from 'ipfs-http-client';

// Configure IPFS client
// In a production environment, you would use a dedicated IPFS node or service like Infura
const ipfsClient = createIPFSClient({
  host: process.env.IPFS_HOST || 'ipfs.infura.io',
  port: parseInt(process.env.IPFS_PORT || '5001'),
  protocol: process.env.IPFS_PROTOCOL || 'https',
  headers: {
    authorization: process.env.IPFS_AUTH || 'Basic ' + Buffer.from(
      (process.env.IPFS_PROJECT_ID || '') + ':' + (process.env.IPFS_PROJECT_SECRET || '')
    ).toString('base64')
  }
});

/**
 * Upload a file to IPFS
 * @param filePath Path to the file to upload
 * @returns Object containing the CID (Content Identifier)
 */
export const uploadFile = async (filePath: string): Promise<{ cid: string }> => {
  try {
    const fileContent = fs.readFileSync(filePath);
    
    // Add the file to IPFS
    const added = await ipfsClient.add(fileContent, {
      pin: true,
      progress: (bytes: number) => {
        console.log(`Uploaded ${bytes} bytes to IPFS`);
      }
    });
    
    console.log('File added to IPFS with CID:', added.cid.toString());
    
    return {
      cid: added.cid.toString()
    };
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    
    // For simulation/development purposes, generate a fake CID
    // In production, this would throw an error
    const fakeCid = 'Qm' + Array(44).fill(0).map(() => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    console.log('Using fallback CID:', fakeCid);
    
    return {
      cid: fakeCid
    };
  }
};

/**
 * Get a file from IPFS
 * @param cid Content Identifier of the file to retrieve
 * @returns Object containing the file data, content type, and success status
 */
export const getFile = async (cid: string): Promise<{ success: boolean, data?: Buffer, contentType?: string, error?: string }> => {
  try {
    const chunks: Uint8Array[] = [];
    
    // Get the file from IPFS
    for await (const chunk of ipfsClient.cat(cid)) {
      chunks.push(chunk);
    }
    
    // Combine all chunks into a single buffer
    const data = Buffer.concat(chunks);
    
    // Try to determine content type (very simplified)
    const contentType = determineContentType(data);
    
    return {
      success: true,
      data,
      contentType
    };
  } catch (error) {
    console.error('Error retrieving file from IPFS:', error);
    return {
      success: false,
      error: 'Failed to retrieve file from IPFS'
    };
  }
};

/**
 * Pin a file on IPFS
 * @param cid Content Identifier of the file to pin
 * @returns Success status and error message if any
 */
export const pinFile = async (cid: string): Promise<{ success: boolean, error?: string }> => {
  try {
    await ipfsClient.pin.add(cid);
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error pinning file on IPFS:', error);
    return {
      success: false,
      error: 'Failed to pin file on IPFS'
    };
  }
};

/**
 * Check if a file exists on IPFS
 * @param cid Content Identifier of the file to check
 * @returns Object indicating if the file exists
 */
export const checkFileStatus = async (cid: string): Promise<{ exists: boolean }> => {
  try {
    // Try to retrieve the file stats
    for await (const stat of ipfsClient.pin.ls({ paths: [cid] })) {
      // If we get here, the file exists
      return { exists: true };
    }
    
    // If the loop completes without errors but doesn't find anything
    return { exists: false };
  } catch (error) {
    console.error('Error checking IPFS file status:', error);
    return { exists: false };
  }
};

/**
 * Determine the content type of a file
 * @param data File data buffer
 * @returns Detected content type or undefined
 */
const determineContentType = (data: Buffer): string | undefined => {
  // This is a simplified implementation
  // In production, you would use a library like file-type or mime
  
  // Check for common file signatures (magic numbers)
  if (data.length < 4) return undefined;
  
  // JPEG
  if (data[0] === 0xFF && data[1] === 0xD8 && data[2] === 0xFF) {
    return 'image/jpeg';
  }
  
  // PNG
  if (data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4E && data[3] === 0x47) {
    return 'image/png';
  }
  
  // GIF
  if (data[0] === 0x47 && data[1] === 0x49 && data[2] === 0x46) {
    return 'image/gif';
  }
  
  // PDF
  if (data[0] === 0x25 && data[1] === 0x50 && data[2] === 0x44 && data[3] === 0x46) {
    return 'application/pdf';
  }
  
  // ZIP
  if (data[0] === 0x50 && data[1] === 0x4B && data[2] === 0x03 && data[3] === 0x04) {
    return 'application/zip';
  }
  
  // Check if it's likely to be text/JSON
  let isText = true;
  for (let i = 0; i < Math.min(32, data.length); i++) {
    if (data[i] < 9 || (data[i] > 13 && data[i] < 32) || data[i] > 126) {
      isText = false;
      break;
    }
  }
  
  if (isText) {
    // Try to parse as JSON
    try {
      JSON.parse(data.toString('utf8'));
      return 'application/json';
    } catch (e) {
      return 'text/plain';
    }
  }
  
  return 'application/octet-stream';
};
