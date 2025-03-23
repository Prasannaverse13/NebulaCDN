import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface NetworkStatsProps {
  className?: string;
}

export default function NetworkStats({ className = "" }: NetworkStatsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['/api/ncn/stats'],
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  const [stats, setStats] = useState({
    activeNodes: 247,
    cachedFiles: 8941,
    totalStorage: "14.7 TB",
    responseTime: "78 ms"
  });

  useEffect(() => {
    if (data) {
      setStats({
        activeNodes: data.activeNodes,
        cachedFiles: data.cachedFiles,
        totalStorage: data.totalStorage,
        responseTime: data.responseTime
      });
    }
  }, [data]);

  return (
    <div className={`glass relative overflow-hidden rounded-3xl border border-slate-700 animate-float ${className}`}>
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Live Network Stats</h3>
          <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full flex items-center">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
            Live
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-nebula-dark/50 rounded-xl p-4">
            <p className="text-sm text-slate-400 mb-1">Active Nodes</p>
            <p className="text-2xl font-bold text-white">
              {isLoading ? (
                <span className="inline-block w-16 h-8 bg-slate-700/50 animate-pulse rounded"></span>
              ) : stats.activeNodes}
            </p>
          </div>
          <div className="bg-nebula-dark/50 rounded-xl p-4">
            <p className="text-sm text-slate-400 mb-1">Files Cached</p>
            <p className="text-2xl font-bold text-white">
              {isLoading ? (
                <span className="inline-block w-20 h-8 bg-slate-700/50 animate-pulse rounded"></span>
              ) : stats.cachedFiles.toLocaleString()}
            </p>
          </div>
          <div className="bg-nebula-dark/50 rounded-xl p-4">
            <p className="text-sm text-slate-400 mb-1">Total Storage</p>
            <p className="text-2xl font-bold text-white">
              {isLoading ? (
                <span className="inline-block w-16 h-8 bg-slate-700/50 animate-pulse rounded"></span>
              ) : stats.totalStorage}
            </p>
          </div>
          <div className="bg-nebula-dark/50 rounded-xl p-4">
            <p className="text-sm text-slate-400 mb-1">Response Time</p>
            <p className="text-2xl font-bold text-white">
              {isLoading ? (
                <span className="inline-block w-16 h-8 bg-slate-700/50 animate-pulse rounded"></span>
              ) : stats.responseTime}
            </p>
          </div>
        </div>
        
        {/* Network activity pulse */}
        <div className="h-24 bg-nebula-dark/50 rounded-xl p-4 overflow-hidden relative">
          <p className="text-sm text-slate-400 mb-2">Network Activity</p>
          <div className="flex items-end h-12 space-x-1">
            {/* Network pulse bars - will be animated to look like live data */}
            {Array.from({ length: 20 }).map((_, index) => (
              <div 
                key={index} 
                className="w-1.5 bg-primary-light/60 rounded-t"
                style={{ 
                  height: `${Math.floor(Math.random() * 70) + 10}%`,
                  animation: `pulse ${(Math.random() * 0.6 + 1.3).toFixed(1)}s infinite`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
