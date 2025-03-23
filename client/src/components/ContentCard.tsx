import { ReactNode } from 'react';
import { Link } from 'wouter';

interface ContentCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  link: string;
  tags: string[];
  iconBgClass?: string;
  iconColorClass?: string;
  gradientClass?: string;
  glowClass?: string;
}

export default function ContentCard({ 
  title, 
  description, 
  icon, 
  link, 
  tags,
  iconBgClass = "bg-primary/20",
  iconColorClass = "text-primary/30",
  gradientClass = "from-primary/20 to-secondary/10",
  glowClass = "from-primary to-secondary"
}: ContentCardProps) {
  return (
    <div className="glass card-gradient rounded-xl overflow-hidden group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 border border-slate-700/50 block cursor-pointer"
      onClick={() => window.location.href = link}>
      <div className={`h-40 bg-gradient-to-br ${gradientClass} relative overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`h-20 w-20 ${iconColorClass}`}>
            {icon}
          </div>
        </div>
        
        {/* Glowing line */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${glowClass}`}></div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-semibold">{title}</h3>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-slate-400">{description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-primary/10 text-primary-light rounded text-xs">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
