import { useRef, useEffect } from 'react';

export default function NetworkVisualization() {
  return (
    <div className="relative w-full h-80 bg-nebula-dark/50 rounded-2xl overflow-hidden">
      {/* Nebula background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
      
      {/* Network nodes visualization */}
      <div className="absolute inset-0 p-4">
        {/* Animated node map - shows data moving between nodes */}
        <div className="relative h-full">
          {/* Central Node (User) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full border-4 border-primary-dark shadow-lg shadow-primary/30 z-10"></div>
          
          {/* Distributed Nodes */}
          <div className="absolute top-[15%] left-[20%] w-6 h-6 bg-secondary rounded-full shadow-md shadow-secondary/30 animate-pulse-slow"></div>
          <div className="absolute top-[80%] left-[30%] w-5 h-5 bg-secondary rounded-full shadow-md shadow-secondary/30 animate-pulse-slow" style={{ animationDelay: "0.5s" }}></div>
          <div className="absolute top-[20%] left-[70%] w-7 h-7 bg-secondary rounded-full shadow-md shadow-secondary/30 animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-[60%] left-[75%] w-5 h-5 bg-secondary rounded-full shadow-md shadow-secondary/30 animate-pulse-slow" style={{ animationDelay: "1.5s" }}></div>
          <div className="absolute top-[40%] left-[25%] w-4 h-4 bg-accent rounded-full shadow-md shadow-accent/30 animate-pulse-slow" style={{ animationDelay: "0.3s" }}></div>
          <div className="absolute top-[30%] left-[40%] w-4 h-4 bg-accent rounded-full shadow-md shadow-accent/30 animate-pulse-slow" style={{ animationDelay: "0.8s" }}></div>
          <div className="absolute top-[65%] left-[55%] w-4 h-4 bg-accent rounded-full shadow-md shadow-accent/30 animate-pulse-slow" style={{ animationDelay: "1.3s" }}></div>
          <div className="absolute top-[85%] left-[75%] w-4 h-4 bg-accent rounded-full shadow-md shadow-accent/30 animate-pulse-slow" style={{ animationDelay: "1.8s" }}></div>
          
          {/* Connection lines, animated with CSS */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            {/* Connection lines from central node to distributed nodes */}
            <line x1="200" y1="150" x2="80" y2="45" stroke="url(#line-gradient)" strokeWidth="1.5" strokeDasharray="5,5">
              <animate attributeName="stroke-dashoffset" from="0" to="100" dur="3s" repeatCount="indefinite" />
            </line>
            <line x1="200" y1="150" x2="120" y2="240" stroke="url(#line-gradient)" strokeWidth="1.5" strokeDasharray="5,5">
              <animate attributeName="stroke-dashoffset" from="0" to="100" dur="4s" repeatCount="indefinite" />
            </line>
            <line x1="200" y1="150" x2="280" y2="60" stroke="url(#line-gradient)" strokeWidth="1.5" strokeDasharray="5,5">
              <animate attributeName="stroke-dashoffset" from="0" to="100" dur="3.5s" repeatCount="indefinite" />
            </line>
            <line x1="200" y1="150" x2="300" y2="180" stroke="url(#line-gradient)" strokeWidth="1.5" strokeDasharray="5,5">
              <animate attributeName="stroke-dashoffset" from="0" to="100" dur="4.5s" repeatCount="indefinite" />
            </line>
            <line x1="200" y1="150" x2="100" y2="120" stroke="url(#line-gradient)" strokeWidth="1.5" strokeDasharray="5,5">
              <animate attributeName="stroke-dashoffset" from="0" to="100" dur="3.2s" repeatCount="indefinite" />
            </line>
            <line x1="200" y1="150" x2="160" y2="90" stroke="url(#line-gradient)" strokeWidth="1.5" strokeDasharray="5,5">
              <animate attributeName="stroke-dashoffset" from="0" to="100" dur="3.8s" repeatCount="indefinite" />
            </line>
            <line x1="200" y1="150" x2="220" y2="195" stroke="url(#line-gradient)" strokeWidth="1.5" strokeDasharray="5,5">
              <animate attributeName="stroke-dashoffset" from="0" to="100" dur="4.2s" repeatCount="indefinite" />
            </line>
            <line x1="200" y1="150" x2="300" y2="255" stroke="url(#line-gradient)" strokeWidth="1.5" strokeDasharray="5,5">
              <animate attributeName="stroke-dashoffset" from="0" to="100" dur="3.6s" repeatCount="indefinite" />
            </line>
            
            {/* Define gradient for lines */}
            <defs>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Data packets moving along lines - simulated with small circles */}
          <div className="absolute top-1/2 left-1/2 h-2 w-2 bg-white rounded-full animate-ping opacity-75" style={{ animationDelay: "0.2s" }}></div>
          <div className="absolute top-1/2 left-1/2 h-2 w-2 bg-white rounded-full animate-ping opacity-75" style={{ animationDelay: "1.2s" }}></div>
          <div className="absolute top-1/2 left-1/2 h-2 w-2 bg-white rounded-full animate-ping opacity-75" style={{ animationDelay: "2.2s" }}></div>
        </div>
      </div>
      
      {/* Overlay text */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-nebula-dark to-transparent pt-8 pb-4 px-4">
        <div className="text-center">
          <p className="text-slate-300 text-sm">Decentralized Content Distribution</p>
        </div>
      </div>
    </div>
  );
}
