import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWallet } from '@/lib/wallets.tsx';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { getTokenBalance, stakeTokens, unstakeTokens, sendTip } from '@/lib/solana';
import { TokenTransaction } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

export default function Tokens() {
  const { connected, connect, address, signMessage } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [stakeAmount, setStakeAmount] = useState(100);
  const [unstakeAmount, setUnstakeAmount] = useState(50);
  const [tipAmount, setTipAmount] = useState(10);
  const [tipContentId, setTipContentId] = useState('');
  const [tipCreatorAddress, setTipCreatorAddress] = useState('');
  
  // Query token balance
  const { 
    data: balanceData,
    isLoading: balanceLoading
  } = useQuery({
    queryKey: ['/api/tokens/balance', address],
    enabled: connected && !!address,
  });
  
  // Query transaction history
  const { 
    data: transactionsData,
    isLoading: transactionsLoading
  } = useQuery({
    queryKey: ['/api/tokens/transactions', address],
    enabled: connected && !!address,
  });
  
  // Stake tokens mutation
  const stakeMutation = useMutation({
    mutationFn: async ({ amount }: { amount: number }) => {
      if (!address) throw new Error('Wallet not connected');
      
      const message = `Stake ${amount} NBNEB tokens`;
      const signature = await signMessage(message);
      
      return apiRequest('POST', '/api/tokens/stake', {
        amount,
        walletAddress: address,
        signature
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tokens/balance', address] });
      queryClient.invalidateQueries({ queryKey: ['/api/tokens/transactions', address] });
      toast({
        title: 'Tokens Staked',
        description: `Successfully staked ${stakeAmount} NBNEB tokens`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Staking Failed',
        description: `Error: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  // Unstake tokens mutation
  const unstakeMutation = useMutation({
    mutationFn: async ({ amount }: { amount: number }) => {
      if (!address) throw new Error('Wallet not connected');
      
      const message = `Unstake ${amount} NBNEB tokens`;
      const signature = await signMessage(message);
      
      return apiRequest('POST', '/api/tokens/unstake', {
        amount,
        walletAddress: address,
        signature
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tokens/balance', address] });
      queryClient.invalidateQueries({ queryKey: ['/api/tokens/transactions', address] });
      toast({
        title: 'Tokens Unstaked',
        description: `Successfully unstaked ${unstakeAmount} NBNEB tokens`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Unstaking Failed',
        description: `Error: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  // Send tip mutation
  const tipMutation = useMutation({
    mutationFn: async ({ amount, contentId, creatorAddress }: { amount: number, contentId: string, creatorAddress: string }) => {
      if (!address) throw new Error('Wallet not connected');
      
      const message = `Tip ${amount} NBNEB tokens to ${creatorAddress} for content ${contentId}`;
      const signature = await signMessage(message);
      
      return apiRequest('POST', '/api/tokens/tip', {
        amount,
        contentId: parseInt(contentId),
        creatorAddress,
        senderWalletAddress: address,
        signature
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tokens/balance', address] });
      queryClient.invalidateQueries({ queryKey: ['/api/tokens/transactions', address] });
      toast({
        title: 'Tip Sent',
        description: `Successfully sent ${tipAmount} NBNEB tokens as a tip`,
      });
      setTipContentId('');
      setTipCreatorAddress('');
      setTipAmount(10);
    },
    onError: (error) => {
      toast({
        title: 'Tip Failed',
        description: `Error: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  // Handle stake submit
  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected) {
      connect();
      return;
    }
    
    if (stakeAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a stake amount greater than 0',
        variant: 'destructive',
      });
      return;
    }
    
    stakeMutation.mutate({ amount: stakeAmount });
  };
  
  // Handle unstake submit
  const handleUnstake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected) {
      connect();
      return;
    }
    
    if (unstakeAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter an unstake amount greater than 0',
        variant: 'destructive',
      });
      return;
    }
    
    unstakeMutation.mutate({ amount: unstakeAmount });
  };
  
  // Handle tip submit
  const handleTip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected) {
      connect();
      return;
    }
    
    if (tipAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a tip amount greater than 0',
        variant: 'destructive',
      });
      return;
    }
    
    if (!tipContentId || !tipCreatorAddress) {
      toast({
        title: 'Missing Information',
        description: 'Please enter content ID and creator address',
        variant: 'destructive',
      });
      return;
    }
    
    tipMutation.mutate({ 
      amount: tipAmount, 
      contentId: tipContentId, 
      creatorAddress: tipCreatorAddress 
    });
  };
  
  const balance = balanceData?.balance || {
    total: 0,
    available: 0,
    staked: 0,
    rewards: 0
  };
  
  const transactions: TokenTransaction[] = transactionsData?.transactions || [];
  
  // Function to format transaction details
  const getTransactionDetails = (tx: TokenTransaction) => {
    switch (tx.transactionType) {
      case 'stake':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2h10.188L3.476 15.073a1 1 0 001.417 1.415L15 6.312V16.5a1 1 0 002 0v-13A.5.5 0 0016.5 3H3z" clipRule="evenodd" />
            </svg>
          ),
          title: 'Staked Tokens',
          amount: `${tx.amount} NBNEB`,
          color: 'text-blue-400'
        };
      case 'unstake':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ),
          title: 'Unstaked Tokens',
          amount: `${tx.amount} NBNEB`,
          color: 'text-yellow-400'
        };
      case 'reward':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          ),
          title: 'Rewards Earned',
          amount: `+${tx.amount} NBNEB`,
          color: 'text-green-400'
        };
      case 'tip':
        if (tx.userId === tx.receiverId) {
          return {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            ),
            title: 'Tip Received',
            amount: `+${tx.amount} NBNEB`,
            color: 'text-green-400'
          };
        } else {
          return {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            ),
            title: 'Tip Sent',
            amount: `-${tx.amount} NBNEB`,
            color: 'text-purple-400'
          };
        }
      default:
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
            </svg>
          ),
          title: 'Transaction',
          amount: `${tx.amount} NBNEB`,
          color: 'text-gray-400'
        };
    }
  };

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Token & Rewards</h1>
            <p className="text-slate-400">
              Manage your Nebula tokens, stake, earn rewards, and tip content creators.
            </p>
          </div>
          
          <Card className="glass border-slate-700/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-medium mb-2">Connect Wallet to Access Tokens</h3>
              <p className="text-slate-400 mb-6 text-center max-w-md">
                You need to connect your wallet to view your token balance, stake tokens, and manage rewards.
              </p>
              <Button
                onClick={connect}
                className="bg-primary hover:bg-primary-dark"
              >
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Token & Rewards</h1>
        <p className="text-slate-400">
          Manage your Nebula tokens, stake, earn rewards, and tip content creators.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass border-slate-700/50">
          <CardHeader className="pb-2">
            <CardDescription>Total Balance</CardDescription>
            <CardTitle className="text-3xl">{balance.total.toLocaleString()} NBNEB</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-slate-400">Nebula tokens</div>
          </CardContent>
        </Card>
        
        <Card className="glass border-slate-700/50">
          <CardHeader className="pb-2">
            <CardDescription>Available</CardDescription>
            <CardTitle className="text-3xl">{balance.available.toLocaleString()} NBNEB</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-slate-400">Available for staking & tips</div>
          </CardContent>
        </Card>
        
        <Card className="glass border-slate-700/50">
          <CardHeader className="pb-2">
            <CardDescription>Staked</CardDescription>
            <CardTitle className="text-3xl">{balance.staked.toLocaleString()} NBNEB</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-slate-400">Currently staked in NCN</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="stake" className="space-y-6">
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="stake">Stake & Unstake</TabsTrigger>
          <TabsTrigger value="tip">Send Tip</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stake" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stake Card */}
            <Card className="glass border-slate-700/50">
              <CardHeader>
                <CardTitle>Stake Tokens</CardTitle>
                <CardDescription>
                  Stake your Nebula tokens to support the Node Consensus Network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStake} className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-slate-400">Stake Amount</label>
                      <span className="text-sm text-slate-400">
                        Available: {balance.available.toLocaleString()} NBNEB
                      </span>
                    </div>
                    <div className="space-y-4">
                      <Input
                        type="number"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(Number(e.target.value))}
                        min={1}
                        max={balance.available}
                        className="bg-nebula-dark/50 border-slate-700"
                      />
                      <Slider 
                        value={[stakeAmount]} 
                        min={1} 
                        max={Math.max(balance.available, 1)} 
                        step={1}
                        onValueChange={(value) => setStakeAmount(value[0])}
                        className="py-2"
                      />
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>1 NBNEB</span>
                        <span>{Math.max(balance.available, 1).toLocaleString()} NBNEB</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-nebula-dark/40 rounded-lg p-4 text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Estimated APY</span>
                      <span>12.4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Estimated Rewards/Month</span>
                      <span>{(stakeAmount * 0.01).toFixed(2)} NBNEB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Unstaking Period</span>
                      <span>7 days</span>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary-dark"
                    disabled={stakeMutation.isPending || stakeAmount <= 0 || stakeAmount > balance.available}
                  >
                    {stakeMutation.isPending ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Staking...
                      </span>
                    ) : (
                      'Stake Tokens'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            {/* Unstake Card */}
            <Card className="glass border-slate-700/50">
              <CardHeader>
                <CardTitle>Unstake Tokens</CardTitle>
                <CardDescription>
                  Unstake your tokens to make them available for other uses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUnstake} className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-slate-400">Unstake Amount</label>
                      <span className="text-sm text-slate-400">
                        Staked: {balance.staked.toLocaleString()} NBNEB
                      </span>
                    </div>
                    <div className="space-y-4">
                      <Input
                        type="number"
                        value={unstakeAmount}
                        onChange={(e) => setUnstakeAmount(Number(e.target.value))}
                        min={1}
                        max={balance.staked}
                        className="bg-nebula-dark/50 border-slate-700"
                      />
                      <Slider 
                        value={[unstakeAmount]} 
                        min={1} 
                        max={Math.max(balance.staked, 1)} 
                        step={1}
                        onValueChange={(value) => setUnstakeAmount(value[0])}
                        className="py-2"
                      />
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>1 NBNEB</span>
                        <span>{Math.max(balance.staked, 1).toLocaleString()} NBNEB</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-nebula-dark/40 rounded-lg p-4 space-y-3">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Unstaking has a 7-day cooldown period</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      After initiating an unstake, tokens will be locked for 7 days before they become available in your wallet. This helps maintain network stability.
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-secondary hover:bg-secondary-dark"
                    disabled={unstakeMutation.isPending || unstakeAmount <= 0 || unstakeAmount > balance.staked}
                  >
                    {unstakeMutation.isPending ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Unstaking...
                      </span>
                    ) : (
                      'Unstake Tokens'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Rewards Info Card */}
          <Card className="glass border-slate-700/50">
            <CardHeader>
              <CardTitle>Rewards Information</CardTitle>
              <CardDescription>
                How token staking and rewards work on NebulaCDN
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-nebula-dark/40 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-light mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                      <h3 className="font-semibold">Staking Rewards</h3>
                    </div>
                    <p className="text-sm text-slate-400">
                      Stake your tokens to earn up to 12.4% APY. Rewards are distributed daily based on your staked amount and network performance.
                    </p>
                  </div>
                  
                  <div className="bg-nebula-dark/40 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary-light mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      <h3 className="font-semibold">Node Operation</h3>
                    </div>
                    <p className="text-sm text-slate-400">
                      Operate NCN nodes to earn additional rewards. Nodes earn tokens based on content requests served and caching performance.
                    </p>
                  </div>
                  
                  <div className="bg-nebula-dark/40 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-light mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      <h3 className="font-semibold">Content Creation</h3>
                    </div>
                    <p className="text-sm text-slate-400">
                      Create and share valuable content to receive tips from users. Premium content can also generate passive income through access fees.
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="font-semibold mb-1">Important Information</h3>
                      <p className="text-sm text-slate-300 mb-2">
                        Staking your tokens helps strengthen the network by supporting Node Consensus Networks (NCNs). You'll earn rewards while contributing to a more robust decentralized infrastructure.
                      </p>
                      <p className="text-sm text-slate-400">
                        Remember that staked tokens are subject to a 7-day cooldown period when unstaking. This mechanism helps maintain network stability and prevents rapid withdrawal of resources.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tip" className="space-y-6">
          <Card className="glass border-slate-700/50">
            <CardHeader>
              <CardTitle>Send Tip to Content Creator</CardTitle>
              <CardDescription>
                Reward content creators for their valuable contributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTip} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Content ID</label>
                    <Input
                      placeholder="Enter content ID (e.g., 12345)"
                      value={tipContentId}
                      onChange={(e) => setTipContentId(e.target.value)}
                      className="bg-nebula-dark/50 border-slate-700"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Creator's Wallet Address</label>
                    <Input
                      placeholder="Solana wallet address"
                      value={tipCreatorAddress}
                      onChange={(e) => setTipCreatorAddress(e.target.value)}
                      className="bg-nebula-dark/50 border-slate-700"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-slate-400">Tip Amount</label>
                      <span className="text-sm text-slate-400">
                        Available: {balance.available.toLocaleString()} NBNEB
                      </span>
                    </div>
                    <div className="space-y-4">
                      <Input
                        type="number"
                        value={tipAmount}
                        onChange={(e) => setTipAmount(Number(e.target.value))}
                        min={1}
                        max={balance.available}
                        className="bg-nebula-dark/50 border-slate-700"
                      />
                      <Slider 
                        value={[tipAmount]} 
                        min={1} 
                        max={Math.min(100, balance.available)} 
                        step={1}
                        onValueChange={(value) => setTipAmount(value[0])}
                        className="py-2"
                      />
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>1 NBNEB</span>
                        <span>{Math.min(100, balance.available).toLocaleString()} NBNEB</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-nebula-dark/40 rounded-lg p-4 space-y-2">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary-light mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Support creators you appreciate</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Tipping is a great way to show appreciation for content you enjoy. 100% of your tip goes directly to the creator.
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-accent hover:bg-accent-dark"
                  disabled={tipMutation.isPending || tipAmount <= 0 || tipAmount > balance.available || !tipContentId || !tipCreatorAddress}
                >
                  {tipMutation.isPending ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Tip...
                    </span>
                  ) : (
                    'Send Tip'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="bg-nebula-dark/30 glass border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Popular Content to Support</h3>
            <div className="space-y-4">
              <p className="text-slate-400 text-center py-8">
                Connect your wallet and browse content to see popular creators you can support with tips.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6">
          <Card className="glass border-slate-700/50">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                Your token transaction history on NebulaCDN
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="flex justify-center py-8">
                  <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="text-xl font-medium mb-2">No Transactions Yet</h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                    You haven't made any token transactions yet. Start by staking tokens or supporting content creators.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((tx) => {
                    const txDetails = getTransactionDetails(tx);
                    return (
                      <div key={tx.id} className="flex justify-between items-center py-3 border-b border-slate-700/50 last:border-0">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-nebula-dark/70 flex items-center justify-center mr-3">
                            {txDetails.icon}
                          </div>
                          <div>
                            <p className="font-medium">{txDetails.title}</p>
                            <p className="text-xs text-slate-400">
                              {new Date(tx.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${txDetails.color}`}>{txDetails.amount}</p>
                          {tx.transactionHash && (
                            <a 
                              href={`https://explorer.solana.com/tx/${tx.transactionHash}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:text-primary-light"
                            >
                              View Transaction
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
