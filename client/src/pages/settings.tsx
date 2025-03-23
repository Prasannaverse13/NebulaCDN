import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useWallet } from '@/lib/wallets.tsx';
import { apiRequest } from '@/lib/queryClient';
import { getSolBalance } from '@/lib/solana';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { connected, connect, disconnect, address, walletType } = useWallet();
  const { toast } = useToast();
  
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [contentAlerts, setContentAlerts] = useState(true);
  const [rewardAlerts, setRewardAlerts] = useState(true);
  
  // Get user profile data
  const { 
    data: userData,
    isLoading: userLoading,
    refetch: refetchUser
  } = useQuery({
    queryKey: ['/api/user/profile', address],
    enabled: connected && !!address,
  });
  
  // Get SOL balance
  const { 
    data: solData,
    isLoading: solLoading,
    refetch: refetchSol
  } = useQuery({
    queryKey: ['/api/user/sol-balance', address],
    enabled: connected && !!address,
  });
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { username: string, avatarUrl: string }) => {
      return apiRequest('PATCH', '/api/user/profile', data);
    },
    onSuccess: () => {
      refetchUser();
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Update Failed',
        description: `Error: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  // Update notification settings mutation
  const updateNotificationsMutation = useMutation({
    mutationFn: async (data: { emailNotifications: boolean, contentAlerts: boolean, rewardAlerts: boolean }) => {
      return apiRequest('PATCH', '/api/user/notifications', data);
    },
    onSuccess: () => {
      toast({
        title: 'Notification Settings Updated',
        description: 'Your notification preferences have been saved',
      });
    },
    onError: (error) => {
      toast({
        title: 'Update Failed',
        description: `Error: ${error.message}`,
        variant: 'destructive',
      });
    }
  });
  
  // Update profile settings from data
  useEffect(() => {
    if (userData) {
      setUsername(userData.username || '');
      setAvatarUrl(userData.avatarUrl || '');
      setEmailNotifications(userData.settings?.emailNotifications || false);
      setContentAlerts(userData.settings?.contentAlerts || false);
      setRewardAlerts(userData.settings?.rewardAlerts || false);
    }
  }, [userData]);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected) {
      connect();
      return;
    }
    
    updateProfileMutation.mutate({ username, avatarUrl });
  };
  
  const handleUpdateNotifications = async () => {
    if (!connected) {
      connect();
      return;
    }
    
    updateNotificationsMutation.mutate({ 
      emailNotifications, 
      contentAlerts, 
      rewardAlerts 
    });
  };
  
  const getWalletTypeName = (type: string | null) => {
    switch (type) {
      case 'metamask':
        return 'MetaMask';
      case 'phantom':
        return 'Phantom';
      case 'brave':
        return 'Brave Wallet';
      default:
        return 'Unknown Wallet';
    }
  };
  
  const getWalletTypeIcon = (type: string | null) => {
    switch (type) {
      case 'metamask':
        return (
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask logo" className="h-6 w-6" />
        );
      case 'phantom':
        return (
          <img src="https://cryptologos.cc/logos/phantom-phm-logo.png" alt="Phantom logo" className="h-6 w-6" />
        );
      case 'brave':
        return (
          <img src="https://brave.com/static-assets/images/brave-logo-no-shadow.svg" alt="Brave logo" className="h-6 w-6" />
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
    }
  };
  
  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Wallet Management</h1>
            <p className="text-slate-400">
              Connect your wallet to manage your settings and account preferences.
            </p>
          </div>
          
          <Card className="glass border-slate-700/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-xl font-medium mb-2">Connect Your Wallet</h3>
              <p className="text-slate-400 mb-6 text-center max-w-md">
                Connect your wallet to access your settings, view transaction history, and manage your profile.
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
        <h1 className="text-3xl font-bold mb-2">Wallet Management</h1>
        <p className="text-slate-400">
          Manage your wallet connections, profile settings, and notification preferences.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="glass border-slate-700/50">
          <CardHeader className="pb-2">
            <CardDescription>Connected Wallet</CardDescription>
            <CardTitle className="flex items-center space-x-2">
              {getWalletTypeIcon(walletType)}
              <span>{getWalletTypeName(walletType)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-slate-400 truncate" title={address || ''}>
              {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : ''}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass border-slate-700/50">
          <CardHeader className="pb-2">
            <CardDescription>SOL Balance</CardDescription>
            <CardTitle className="text-2xl">
              {solLoading ? (
                <div className="h-8 w-20 bg-slate-700/50 animate-pulse rounded"></div>
              ) : (
                `${solData?.balance.toFixed(4) || '0'} SOL`
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-slate-400">Solana Blockchain</div>
          </CardContent>
        </Card>
        
        <Card className="glass border-slate-700/50">
          <CardHeader className="pb-2">
            <CardDescription>Account Status</CardDescription>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Active</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-slate-400">Member since {new Date().toLocaleDateString()}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card className="glass border-slate-700/50">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="bg-nebula-dark/50 border-slate-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input
                    id="avatar"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="bg-nebula-dark/50 border-slate-700"
                  />
                  {avatarUrl && (
                    <div className="mt-2 flex justify-center">
                      <img 
                        src={avatarUrl} 
                        alt="Avatar Preview" 
                        className="h-16 w-16 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/150?text=Invalid+URL";
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary-dark"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </span>
                    ) : (
                      'Update Profile'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card className="glass border-slate-700/50">
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-nebula-dark/40 rounded-lg p-4 space-y-2">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="font-medium">Web3 Authentication Active</span>
                </div>
                <p className="text-sm text-slate-400">
                  Your account is secured using your blockchain wallet. This provides stronger security than traditional password-based authentication.
                </p>
              </div>
              
              <div className="border-t border-slate-700 pt-4">
                <h3 className="font-medium mb-2">Additional Security Measures</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Keep your wallet's private keys or seed phrases secure
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Use a hardware wallet for enhanced security
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Be cautious of phishing attempts and only use official wallet apps
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="wallets" className="space-y-6">
          <Card className="glass border-slate-700/50">
            <CardHeader>
              <CardTitle>Connected Wallets</CardTitle>
              <CardDescription>
                Manage your wallet connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-nebula-dark/40 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {getWalletTypeIcon(walletType)}
                      <div className="ml-3">
                        <p className="font-medium">{getWalletTypeName(walletType)}</p>
                        <p className="text-xs text-slate-400">{address ? `${address.slice(0, 8)}...${address.slice(-6)}` : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="px-2 py-1 text-xs bg-green-900/50 text-green-400 rounded-full flex items-center mr-2">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                        Active
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-red-500 text-red-500 hover:bg-red-500/10"
                        onClick={disconnect}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h3 className="font-medium mb-3">Connect Another Wallet</h3>
                  <div className="space-y-3">
                    <div className="bg-[#F6851B]/10 hover:bg-[#F6851B]/20 text-white p-3 rounded-xl border border-[#F6851B]/30 cursor-pointer transition duration-200 flex items-center justify-between">
                      <div className="flex items-center">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask logo" className="h-6 w-6 mr-3" />
                        <span>MetaMask</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 px-2 text-xs"
                        onClick={connect}
                      >
                        Connect
                      </Button>
                    </div>
                    
                    <div className="bg-[#AB9FF2]/10 hover:bg-[#AB9FF2]/20 text-white p-3 rounded-xl border border-[#AB9FF2]/30 cursor-pointer transition duration-200 flex items-center justify-between">
                      <div className="flex items-center">
                        <img src="https://cryptologos.cc/logos/phantom-phm-logo.png" alt="Phantom logo" className="h-6 w-6 mr-3" />
                        <span>Phantom</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 px-2 text-xs"
                        onClick={connect}
                      >
                        Connect
                      </Button>
                    </div>
                    
                    <div className="bg-[#FF5341]/10 hover:bg-[#FF5341]/20 text-white p-3 rounded-xl border border-[#FF5341]/30 cursor-pointer transition duration-200 flex items-center justify-between">
                      <div className="flex items-center">
                        <img src="https://brave.com/static-assets/images/brave-logo-no-shadow.svg" alt="Brave logo" className="h-6 w-6 mr-3" />
                        <span>Brave Wallet</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 px-2 text-xs"
                        onClick={connect}
                      >
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass border-slate-700/50">
            <CardHeader>
              <CardTitle>View on Explorers</CardTitle>
              <CardDescription>
                View your wallet and transactions on blockchain explorers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary/10"
                  onClick={() => window.open(`https://explorer.solana.com/address/${address}`, '_blank')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 283 283" fill="none">
                    <path d="M256 32H26.7C12 32 0 44 0 58.7v167.6C0 241 12 253 26.7 253h167.6c14.7 0 26.7-12 26.7-26.7V176l25.2-25.2 9.8 9.8V226c0 32-24 56-56 56H56c-32 0-56-24-56-56V56C0 24 24 0 56 0h170c32 0 56 24 56 56v65.4l-36-36h-62.8V69.2h62.8L283 106v-50C283 26.8 256 0 227 0H56C26.8 0 0 26.8 0 56v170c0 29.2 26.8 56 56 56h171c29.2 0 56-26.8 56-56v-74.8l-10-10L256 158v68c0 14.7-12 26.7-26.7 26.7H58.7C44 252.7 32 240.7 32 226V58.7C32 44 44 32 58.7 32h167.6c14.7 0 26.7 12 26.7 26.7v23.8l36-36V56c0-32-24-56-56-56H56z" fill="currentColor"/>
                    <path d="M196 127.6A1.5 1.5 0 0 0 197.4 126l59.8-59.7a1.6 1.6 0 0 0 0-2.2L249 55.8a1.6 1.6 0 0 0-2.2 0l-59.6 59.7a1.5 1.5 0 0 0 0 2.1l8.6 8.6z" fill="currentColor"/>
                    <path d="M193.8 161.3a1.5 1.5 0 0 0 1.5-1.5v-20.8a1.5 1.5 0 0 0-1.5-1.6h-20.7a1.5 1.5 0 0 0-1.1 2.5l20.7 20.8a1.5 1.5 0 0 0 1.1.4z" fill="currentColor"/>
                  </svg>
                  View on Solana Explorer
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-secondary text-secondary hover:bg-secondary/10"
                  onClick={() => window.open(`https://solscan.io/account/${address}`, '_blank')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" fill="currentColor"/>
                  </svg>
                  View on Solscan
                </Button>
              </div>
              
              <div className="mt-4">
                <p className="text-xs text-slate-400">
                  Blockchain explorers allow you to view all transactions and activities associated with your wallet address on the blockchain.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card className="glass border-slate-700/50">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-slate-400">Receive important updates via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="content-alerts">Content Alerts</Label>
                    <p className="text-sm text-slate-400">Get notified when your content is accessed</p>
                  </div>
                  <Switch
                    id="content-alerts"
                    checked={contentAlerts}
                    onCheckedChange={setContentAlerts}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reward-alerts">Reward Alerts</Label>
                    <p className="text-sm text-slate-400">Get notified when you earn rewards or tips</p>
                  </div>
                  <Switch
                    id="reward-alerts"
                    checked={rewardAlerts}
                    onCheckedChange={setRewardAlerts}
                  />
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="w-full bg-primary hover:bg-primary-dark"
                    onClick={handleUpdateNotifications}
                    disabled={updateNotificationsMutation.isPending}
                  >
                    {updateNotificationsMutation.isPending ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      'Save Notification Settings'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass border-slate-700/50">
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Manage your privacy preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="public-profile">Public Profile</Label>
                    <p className="text-sm text-slate-400">Allow others to view your profile</p>
                  </div>
                  <Switch
                    id="public-profile"
                    defaultChecked={true}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-content">Show My Content</Label>
                    <p className="text-sm text-slate-400">Display your content in public listings</p>
                  </div>
                  <Switch
                    id="show-content"
                    defaultChecked={true}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="analytics">Usage Analytics</Label>
                    <p className="text-sm text-slate-400">Allow anonymous usage data collection</p>
                  </div>
                  <Switch
                    id="analytics"
                    defaultChecked={true}
                  />
                </div>
                
                <div className="pt-4">
                  <Button className="w-full">
                    Save Privacy Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-10">
        <Card className="glass border-slate-700/50">
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>
              Irreversible account actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-400 mb-2">Delete Account</h3>
                <p className="text-sm text-slate-300 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button 
                  variant="destructive" 
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete My Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
