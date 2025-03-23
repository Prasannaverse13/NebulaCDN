import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@/lib/wallets.tsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { NcnNode, NodeOperatorStats, NodeStats } from '@/lib/types';
import { claimNodeRewards } from '@/lib/cambrian';

export default function Dashboard() {
  const { connected, connect, address } = useWallet();
  const [activeTab, setActiveTab] = useState('overview');

  // Get node operator stats 
  const { 
    data: statsData,
    isLoading: statsLoading,
    error: statsError 
  } = useQuery({
    queryKey: ['/api/ncn/operator-stats', address],
    enabled: connected && !!address,
  });

  // Get operator nodes
  const { 
    data: nodesData,
    isLoading: nodesLoading,
    error: nodesError 
  } = useQuery({
    queryKey: ['/api/ncn/nodes', address],
    enabled: connected && !!address,
  });

  // Handle claiming rewards for a node
  const handleClaimRewards = async (nodeId: string) => {
    if (!connected || !address) {
      connect();
      return;
    }

    try {
      // This would be implemented with actual signature in production
      const message = `Claim rewards for node ${nodeId}`;
      const signature = "simulated_signature";

      const result = await claimNodeRewards(nodeId, address, signature);
      
      if (result.success) {
        console.log(`Rewards claimed successfully. Transaction: ${result.transactionHash}`);
        // Invalidate queries to refresh data
      } else {
        console.error(`Failed to claim rewards: ${result.error}`);
      }
    } catch (error) {
      console.error('Error claiming rewards:', error);
    }
  };

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Node Operator Dashboard</h1>
            <p className="text-slate-400">
              Monitor your NCN nodes, view performance metrics, and manage your staking.
            </p>
          </div>
          
          <Card className="glass border-slate-700/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 className="text-xl font-medium mb-2">Connect Wallet to Access Dashboard</h3>
              <p className="text-slate-400 mb-6 text-center max-w-md">
                You need to connect your wallet to view your node dashboard and manage your NCN nodes.
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

  const stats: NodeOperatorStats = statsData || {
    nodesCount: 0,
    totalStaked: 0,
    totalRewards: 0,
    averageUptime: 0,
    cacheHitRatio: 0,
    cacheSize: "0 GB"
  };

  const nodes: NcnNode[] = nodesData?.nodes || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Node Operator Dashboard</h1>
        <p className="text-slate-400">
          Monitor your NCN nodes, view performance metrics, and manage your staking.
        </p>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 max-w-md mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="nodes">Your Nodes</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Overview Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glass border-slate-700/50">
              <CardHeader className="pb-2">
                <CardDescription>Active Nodes</CardDescription>
                <CardTitle className="text-3xl">{stats.nodesCount}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-slate-400">Connected to NCN</div>
              </CardContent>
            </Card>
            
            <Card className="glass border-slate-700/50">
              <CardHeader className="pb-2">
                <CardDescription>Total Staked</CardDescription>
                <CardTitle className="text-3xl">{stats.totalStaked.toLocaleString()} NBNEB</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-slate-400">Nebula tokens</div>
              </CardContent>
            </Card>
            
            <Card className="glass border-slate-700/50">
              <CardHeader className="pb-2">
                <CardDescription>Rewards Earned</CardDescription>
                <CardTitle className="text-3xl">{stats.totalRewards.toLocaleString()} NBNEB</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-slate-400">All-time earnings</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass border-slate-700/50">
              <CardHeader>
                <CardTitle>Network Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Uptime</span>
                    <span>{stats.averageUptime.toFixed(2)}%</span>
                  </div>
                  <Progress value={stats.averageUptime} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cache Hit Ratio</span>
                    <span>{stats.cacheHitRatio.toFixed(2)}%</span>
                  </div>
                  <Progress value={stats.cacheHitRatio} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cache Size</span>
                    <span>{stats.cacheSize}</span>
                  </div>
                  <Progress value={parseInt(stats.cacheSize) / 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass border-slate-700/50">
              <CardHeader>
                <CardTitle>Rewards Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-nebula-dark/50 rounded-xl h-40 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-slate-400 mb-2">Rewards Visualization Coming Soon</p>
                    <p className="text-primary-light text-2xl font-bold">{stats.totalRewards.toLocaleString()} NBNEB</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-nebula-dark/30 rounded-lg">
                    <p className="text-xs text-slate-400">Daily Average</p>
                    <p className="text-primary-light font-semibold">
                      {(stats.totalRewards / 30).toFixed(2)} NBNEB
                    </p>
                  </div>
                  <div className="p-3 bg-nebula-dark/30 rounded-lg">
                    <p className="text-xs text-slate-400">Reward Rate</p>
                    <p className="text-primary-light font-semibold">
                      {(stats.totalRewards / stats.totalStaked * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="nodes" className="space-y-6">
          {nodesLoading ? (
            <Card className="glass border-slate-700/50 p-8">
              <div className="flex justify-center">
                <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </Card>
          ) : nodes.length === 0 ? (
            <Card className="glass border-slate-700/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
                <h3 className="text-xl font-medium mb-2">No Nodes Found</h3>
                <p className="text-slate-400 mb-6 text-center max-w-md">
                  You don't have any active NCN nodes yet. Want to start earning rewards by running a node?
                </p>
                <Button className="bg-primary hover:bg-primary-dark">
                  Register New Node
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {nodes.map((node) => (
                <Card key={node.id} className="glass border-slate-700/50 overflow-hidden">
                  <div className="border-l-4 border-primary h-full">
                    <div className="p-4">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${node.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <h3 className="text-lg font-semibold">{node.name}</h3>
                          </div>
                          <p className="text-sm text-slate-400">Node ID: {node.nodeId.substring(0, 8)}...{node.nodeId.substring(node.nodeId.length - 8)}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm text-slate-400">Staked</p>
                            <p className="font-semibold">{node.stakeAmount.toLocaleString()} NBNEB</p>
                          </div>
                          <Button 
                            variant="outline" 
                            className="border-primary text-primary hover:bg-primary/10"
                            onClick={() => handleClaimRewards(node.nodeId)}
                          >
                            Claim Rewards
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-nebula-dark/30 rounded-lg p-3">
                          <p className="text-xs text-slate-400">Uptime</p>
                          <p className="font-semibold">{node.stats?.uptimePercentage || 0}%</p>
                        </div>
                        <div className="bg-nebula-dark/30 rounded-lg p-3">
                          <p className="text-xs text-slate-400">Cache Hit Ratio</p>
                          <p className="font-semibold">
                            {node.stats ? 
                              ((node.stats.cacheHits || 0) / ((node.stats.cacheHits || 0) + (node.stats.cacheMisses || 1)) * 100).toFixed(2) : 0
                            }%
                          </p>
                        </div>
                        <div className="bg-nebula-dark/30 rounded-lg p-3">
                          <p className="text-xs text-slate-400">Files Cached</p>
                          <p className="font-semibold">{node.contentsCached || 0}</p>
                        </div>
                        <div className="bg-nebula-dark/30 rounded-lg p-3">
                          <p className="text-xs text-slate-400">Requests Served</p>
                          <p className="font-semibold">{node.stats?.requestsServed || 0}</p>
                        </div>
                      </div>
                      
                      {node.stats && (
                        <div className="mt-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-slate-400">
                              <span>CPU Usage</span>
                              <span>{node.stats.cpuUsage || 0}%</span>
                            </div>
                            <Progress value={node.stats.cpuUsage || 0} className="h-1.5" />
                          </div>
                          <div className="space-y-2 mt-2">
                            <div className="flex justify-between text-xs text-slate-400">
                              <span>Memory Usage</span>
                              <span>{node.stats.memoryUsage || 0}%</span>
                            </div>
                            <Progress value={node.stats.memoryUsage || 0} className="h-1.5" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              
              <div className="flex justify-center mt-6">
                <Button className="bg-primary hover:bg-primary-dark">
                  Register New Node
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rewards" className="space-y-6">
          <Card className="glass border-slate-700/50">
            <CardHeader>
              <CardTitle>Rewards Overview</CardTitle>
              <CardDescription>Your earnings from node operations and staking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <div className="relative h-40 w-40">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-secondary/30 animate-pulse opacity-70"></div>
                    <div className="absolute inset-4 rounded-full bg-gradient-to-r from-primary/40 to-secondary/40 animate-pulse opacity-70" style={{ animationDelay: "0.5s" }}></div>
                    <div className="absolute inset-8 rounded-full bg-gradient-to-r from-primary/50 to-secondary/50 animate-pulse opacity-70" style={{ animationDelay: "1s" }}></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-bold text-white">{stats.totalRewards.toLocaleString()}</span>
                      <span className="text-sm text-slate-300">NBNEB</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-nebula-dark/40 rounded-xl p-4">
                      <p className="text-xs text-slate-400 mb-1">Node Rewards</p>
                      <p className="text-2xl font-semibold text-white">
                        {(stats.totalRewards * 0.8).toLocaleString()} <span className="text-sm font-normal">NBNEB</span>
                      </p>
                      <p className="text-xs text-green-400 mt-1">+{(stats.totalRewards * 0.1).toFixed(2)} (24h)</p>
                    </div>
                    
                    <div className="bg-nebula-dark/40 rounded-xl p-4">
                      <p className="text-xs text-slate-400 mb-1">Staking Rewards</p>
                      <p className="text-2xl font-semibold text-white">
                        {(stats.totalRewards * 0.2).toLocaleString()} <span className="text-sm font-normal">NBNEB</span>
                      </p>
                      <p className="text-xs text-green-400 mt-1">+{(stats.totalRewards * 0.02).toFixed(2)} (24h)</p>
                    </div>
                    
                    <div className="bg-nebula-dark/40 rounded-xl p-4">
                      <p className="text-xs text-slate-400 mb-1">APY</p>
                      <p className="text-2xl font-semibold text-white">
                        12.4% <span className="text-sm font-normal">Annual</span>
                      </p>
                      <p className="text-xs text-green-400 mt-1">+2.1% from last month</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-nebula-dark/30 rounded-xl p-4">
                  <h3 className="font-medium mb-3">Recent Rewards</h3>
                  <div className="space-y-2">
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="flex justify-between py-2 border-b border-slate-700/50 last:border-0">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-light" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Node Reward</p>
                            <p className="text-xs text-slate-400">Node: {`Node-${index + 1}`}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-400">+{(Math.random() * 10 + 5).toFixed(2)} NBNEB</p>
                          <p className="text-xs text-slate-400">{new Date(Date.now() - (index * 3600000)).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button className="bg-primary hover:bg-primary-dark">
                    Claim All Rewards
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
