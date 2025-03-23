# NebulaCDN: Decentralized Content Delivery Network

![Screenshot (1078)](https://github.com/user-attachments/assets/2c1d012f-5999-4b79-99dc-1b7b14b73448)

NebulaCDN is a Web3-powered Decentralized Content Delivery Network (DCDN) that leverages Node Consensus Networks (NCNs) using the Cambrian SDK and Jito Restaking on Solana. It distributes and caches content closer to users in a decentralized manner, ensuring faster load times and resilience against DDoS attacks.

## 🚀 Key Features

- **Decentralized Content Delivery**: Content is distributed across a network of NCN nodes instead of centralized servers
- **Node Consensus Network**: Utilizes Cambrian SDK for node coordination and consensus
- **Economic Security**: Powered by Jito Restaking on Solana for staking and rewards
- **Web3 Integration**: Connect with MetaMask (ETH) and Phantom (SOL) wallets
- **Content Storage**: Uses IPFS and Arweave for permanent, decentralized storage
- **DDoS Resistance**: No single point of failure thanks to decentralized architecture

## 🔧 Technology Stack

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Node.js, Express
- **Blockchain**: Solana, Ethereum (wallet connectivity)
- **Storage**: IPFS, Arweave
- **SDK**: Cambrian SDK, Jito Restaking
- **Query**: TanStack Query (React Query)

## 💰 NBNEB Token

The Nebula Token (NBNEB) is the native utility token of the NebulaCDN platform, serving multiple functions within the ecosystem:

### Purpose and Utility

- **Staking & Security**: Node operators stake NBNEB tokens as collateral to participate in the network, ensuring honest behavior through economic incentives
- **Governance**: Token holders can participate in governance decisions about the platform's future development
- **Content Access**: Premium content may require NBNEB tokens for access
- **Tipping**: Users can reward content creators with NBNEB tokens
- **Fee Reduction**: Users who stake NBNEB can receive discounted fees for content distribution

### Token Distribution

- **Node Operators**: 40% - Allocated to reward node operators who maintain the network
- **Content Creators**: 30% - Incentivizes high-quality content creation
- **Development Fund**: 20% - Ensures ongoing platform development
- **Community Rewards**: 10% - Reserved for community initiatives and user acquisition

### Tokenomics

NBNEB implements a deflationary mechanism where:
- A small percentage of transaction fees are burned, reducing supply over time
- Node slashing penalties also reduce circulating supply
- Rewards are algorithmically adjusted based on network participation

### Implementation

For this project, NBNEB token is implemented as a Solana-native token, with its primary functionality in:
- `server/controllers/tokens.ts` - Handles token operations
- `client/src/pages/tokens.tsx` - User interface for token management

**Note**: For the hackathon demonstration, NBNEB tokens exist in a simulated environment with mock balances and transactions.

## 📖 How NebulaCDN Works

### User Journey

1. **User Registration & Wallet Connection**
   - Users visit the platform and connect their crypto wallet (MetaMask or Phantom)
   - Example: Click "Connect Wallet" button in the header, select preferred wallet

2. **Content Upload**
   - Users upload content to be distributed on the network
   - Content is stored on IPFS/Arweave and registered on Solana
   - Example: Visit `/upload`, select a file, fill details, click "Upload"
   ```
   Title: How to use NebulaCDN
   Description: A tutorial for content creators
   File: tutorial.mp4
   Make Public: Yes
   ```

3. **Node Registration**
   - Node operators register to join the NCN
   - They stake tokens as collateral to ensure good behavior
   - Example: Visit `/dashboard`, click "Register New Node", provide details:
   ```
   Node Name: FastEdge-Node-01
   Stake Amount: 1000 NBNEB tokens
   IP Address: 123.45.67.89
   Port: 8080
   ```

4. **Content Distribution**
   - Uploaded content is distributed to NCN nodes based on optimization algorithms
   - The Cambrian SDK ensures proper node consensus and distribution
   - Example: After upload, system automatically distributes content to appropriate nodes

5. **Content Retrieval**
   - Users can retrieve content which is served from the nearest NCN node
   - Example: Visit `/content`, search for content, click on item to stream/download

6. **Rewards & Tips**
   - Node operators earn rewards for hosting and delivering content
   - Users can tip content creators
   - Example: Visit `/tokens`, set amount, click "Claim Rewards" or "Send Tip"
   ```
   Tip Amount: 50 NBNEB
   Content ID: 12345
   Creator Address: Hg7YtR9...
   ```

## 📁 Key Files and Components

### Cambrian SDK Integration

The Cambrian SDK integration is primarily implemented in:

- `server/services/cambrian.ts` - Core implementation of Cambrian SDK functions:
  - `initializeNcn`: Sets up a new Node Consensus Network
  - `registerNode`: Registers a node to join an NCN
  - `distributeContent`: Manages content distribution to nodes
  - `verifyContentCache`: Validates content availability on nodes
  - `getNodeRewards`: Calculates rewards for node operators
  - `claimNodeRewards`: Processes reward claims

- `server/controllers/ncn.ts` - Controller for NCN-related operations:
  - Node registration
  - Network statistics
  - Content distribution management

### Jito Restaking Implementation

Jito Restaking is implemented in:

- `server/services/solana.ts` - Integration with Solana blockchain:
  - `stakeTokens`: Stakes tokens for participating in NCN
  - `unstakeTokens`: Withdraws staked tokens
  - `getStakedAmount`: Retrieves current stake amount
  - `getRewardsAmount`: Calculates earned rewards

- `server/controllers/tokens.ts` - Controller for token operations:
  - Staking management
  - Rewards distribution
  - Transaction history

### Storage Components

- `server/services/ipfs.ts` - IPFS integration for content storage:
  - `uploadFile`: Stores content on IPFS
  - `getFile`: Retrieves content from IPFS
  - `pinFile`: Ensures content persistence
  - `checkFileStatus`: Verifies content availability

- `server/services/arweave.ts` - Arweave integration for permanent storage:
  - `uploadFile`: Uploads content to Arweave
  - `getFile`: Retrieves content from Arweave
  - `checkTransactionStatus`: Verifies transaction confirmation

### Frontend Components

- `client/src/lib/wallets.tsx` - Web3 wallet integration:
  - MetaMask (Ethereum) connectivity
  - Phantom (Solana) connectivity
  - Brave wallet support

- `client/src/pages` - Main application pages:
  - `home.tsx`: Landing page
  - `upload.tsx`: Content upload interface
  - `content.tsx`: Content browsing and retrieval
  - `dashboard.tsx`: Node operation dashboard
  - `tokens.tsx`: Token management, staking, and rewards

## 📊 Example API Endpoints

- `GET /api/content/public` - Get all public content
- `POST /api/content/upload` - Upload new content
- `GET /api/ncn/stats` - Get network statistics
- `POST /api/ncn/register-node` - Register a new node
- `GET /api/tokens/balance` - Get token balance and stake info
- `POST /api/tokens/stake` - Stake tokens
- `POST /api/tokens/claim-rewards` - Claim earned rewards

## 📜 Data Schema

The main data entities in NebulaCDN are:

- **Users**: Platform users (content creators/consumers)
- **ContentItems**: Uploaded content with metadata
- **NCNNodes**: Node operators in the consensus network
- **ContentDistribution**: Mapping of content to nodes
- **TokenTransactions**: Record of token transfers, stakes, and rewards

## 🔐 Security

NebulaCDN leverages Proof-of-Authority (PoA) from the Cambrian Consensus Program, allowing only registered Jito operators with sufficient delegated stake to execute on-chain instructions. This ensures:

1. Only validated operators can participate
2. Slashing conditions apply for misbehavior
3. Multi-signature requirements prevent rogue nodes from acting independently

## 🙏 Acknowledgements

- Jito Restaking for providing the economic security layer
- Cambrian SDK for simplifying NCN development
- Solana Foundation for blockchain infrastructure
