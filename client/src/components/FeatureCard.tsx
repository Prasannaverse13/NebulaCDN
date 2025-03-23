import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  iconBgClass?: string;
  iconColorClass?: string;
}

export default function FeatureCard({ 
  icon, 
  title, 
  description,
  iconBgClass = "bg-primary/20",
  iconColorClass = "text-primary-light"
}: FeatureCardProps) {
  return (
    <div className="glass card-gradient rounded-xl overflow-hidden hover:translate-y-[-4px] transition-transform duration-300 border border-slate-700/50">
      <div className="p-6">
        <div className={`w-12 h-12 ${iconBgClass} rounded-lg flex items-center justify-center mb-4`}>
          <div className={`h-6 w-6 ${iconColorClass}`}>
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-slate-400">{description}</p>
      </div>
    </div>
  );
}
