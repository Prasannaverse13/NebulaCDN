import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="glass border-t border-slate-700 py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center">
          <div className="flex items-center space-x-2">
            <svg className="h-6 w-6 text-primary-light" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-9.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5 9.5h-2v-2h-2v-2h2V9.5h2v5.5z"/>
            </svg>
            <span className="text-white font-medium">© {new Date().getFullYear()} <span className="text-primary">Nebula</span>CDN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
