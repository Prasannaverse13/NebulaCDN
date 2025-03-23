import axios from 'axios';

interface UploadResult {
  cid: string;
  size: number;
  path: string;
}

// Function to handle file uploads to IPFS through our backend service
export async function uploadToIPFS(file: File): Promise<UploadResult> {
  // Create a FormData instance to send the file
  const formData = new FormData();
  formData.append('file', file);

  try {
    // Send the file to our backend service which will handle the IPFS upload
    const response = await axios.post('/api/ipfs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.data.cid) {
      throw new Error('IPFS upload failed - no CID returned');
    }

    return {
      cid: response.data.cid,
      size: response.data.size,
      path: `ipfs://${response.data.cid}`,
    };
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
}

// Function to retrieve content from IPFS by CID
export async function getFromIPFS(cid: string): Promise<Blob> {
  try {
    const response = await axios.get(`/api/ipfs/get/${cid}`, {
      responseType: 'blob',
    });
    
    return response.data;
  } catch (error) {
    console.error('Error retrieving from IPFS:', error);
    throw error;
  }
}

// Function to get IPFS gateway URL for a given CID
export function getIPFSGatewayURL(cid: string): string {
  // Use either Infura or Cloudflare IPFS gateway
  return `https://cloudflare-ipfs.com/ipfs/${cid}`;
}

// Function to pin content to IPFS for better persistence
export async function pinToIPFS(cid: string): Promise<boolean> {
  try {
    const response = await axios.post('/api/ipfs/pin', { cid });
    return response.data.success;
  } catch (error) {
    console.error('Error pinning to IPFS:', error);
    throw error;
  }
}

// Function to check if a CID exists on IPFS
export async function checkIPFSStatus(cid: string): Promise<boolean> {
  try {
    const response = await axios.get(`/api/ipfs/status/${cid}`);
    return response.data.exists;
  } catch (error) {
    console.error('Error checking IPFS status:', error);
    return false;
  }
}

// Calculate content hash for integrity verification
export async function calculateContentHash(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        if (!event.target?.result) {
          throw new Error('Failed to read file');
        }
        
        // Use the Web Crypto API to create a hash of the file
        const arrayBuffer = event.target.result as ArrayBuffer;
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        
        // Convert the hash to a hex string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        resolve(hashHex);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsArrayBuffer(file);
  });
}
