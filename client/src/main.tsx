import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add global styles for nebula background effect
const style = document.createElement("style");
style.textContent = `
  body {
    font-family: 'Inter', sans-serif;
    background-color: #0f172a;
    background-image: 
      radial-gradient(circle at 70% 20%, rgba(124, 58, 237, 0.1) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 100%),
      radial-gradient(circle at 30% 80%, rgba(244, 63, 94, 0.1) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 100%);
    background-attachment: fixed;
    background-size: cover;
  }

  /* Glass effect */
  .glass {
    background: rgba(23, 36, 65, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  /* Animated gradient background for cards */
  .card-gradient {
    position: relative;
    overflow: hidden;
  }
    
  .card-gradient::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.04) 0%, rgba(6, 182, 212, 0.03) 50%, transparent 70%);
    animation: rotate 20s linear infinite;
    z-index: -1;
  }
    
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Glitch effect for text */
  .glitch {
    position: relative;
    text-shadow: 0.05em 0 0 rgba(244, 63, 94, 0.4), -0.05em 0 0 rgba(6, 182, 212, 0.4);
    animation: glitch 2s infinite;
  }
    
  @keyframes glitch {
    0% { text-shadow: 0.05em 0 0 rgba(244, 63, 94, 0.4), -0.05em 0 0 rgba(6, 182, 212, 0.4); }
    14% { text-shadow: 0.05em 0 0 rgba(244, 63, 94, 0.4), -0.05em 0 0 rgba(6, 182, 212, 0.4); }
    15% { text-shadow: -0.05em -0.025em 0 rgba(244, 63, 94, 0.4), 0.025em 0.025em 0 rgba(6, 182, 212, 0.4); }
    49% { text-shadow: -0.05em -0.025em 0 rgba(244, 63, 94, 0.4), 0.025em 0.025em 0 rgba(6, 182, 212, 0.4); }
    50% { text-shadow: 0.025em 0.05em 0 rgba(244, 63, 94, 0.4), 0.05em 0 0 rgba(6, 182, 212, 0.4); }
    99% { text-shadow: 0.025em 0.05em 0 rgba(244, 63, 94, 0.4), 0.05em 0 0 rgba(6, 182, 212, 0.4); }
    100% { text-shadow: 0.05em 0 0 rgba(244, 63, 94, 0.4), -0.05em 0 0 rgba(6, 182, 212, 0.4); }
  }

  /* Custom animations */
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes glow {
    0% { box-shadow: 0 0 5px rgba(124, 58, 237, 0.3); }
    100% { box-shadow: 0 0 20px rgba(124, 58, 237, 0.7); }
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .animate-glow {
    animation: glow 2s ease-in-out infinite alternate;
  }

  .animate-pulse-slow {
    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`;

document.head.appendChild(style);

// Add Google Fonts
const linkFont1 = document.createElement("link");
linkFont1.rel = "stylesheet";
linkFont1.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
document.head.appendChild(linkFont1);

const linkFont2 = document.createElement("link");
linkFont2.rel = "stylesheet";
linkFont2.href = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap";
document.head.appendChild(linkFont2);

// Add custom tailwind colors
window.tailwind = {
  config: {
    theme: {
      extend: {
        colors: {
          primary: { DEFAULT: '#7c3aed', dark: '#6d28d9', light: '#8b5cf6' },
          secondary: { DEFAULT: '#06b6d4', dark: '#0891b2', light: '#22d3ee' },
          accent: { DEFAULT: '#f43f5e', dark: '#e11d48', light: '#fb7185' },
          nebula: { DEFAULT: '#12314F', dark: '#0f172a', light: '#1e293b' }
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
          mono: ['JetBrains Mono', 'monospace'],
        }
      }
    }
  }
};

createRoot(document.getElementById("root")!).render(<App />);
