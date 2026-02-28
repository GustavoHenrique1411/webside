import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const colorClasses = {
  default: {
    bg: 'bg-gradient-to-br from-accent/20 to-accent/5',
    icon: 'bg-accent',
    text: 'text-accent-foreground',
  },
  blue: {
    bg: 'bg-gradient-to-br from-blue-500/20 to-blue-500/5',
    icon: 'bg-blue-500',
    text: 'text-blue-600',
  },
  green: {
    bg: 'bg-gradient-to-br from-green-500/20 to-green-500/5',
    icon: 'bg-green-500',
    text: 'text-green-600',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-500/20 to-purple-500/5',
    icon: 'bg-purple-500',
    text: 'text-purple-600',
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-500/20 to-orange-500/5',
    icon: 'bg-orange-500',
    text: 'text-orange-600',
  },
  red: {
    bg: 'bg-gradient-to-br from-red-500/20 to-red-500/5',
    icon: 'bg-red-500',
    text: 'text-red-600',
  },
};

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  description,
  trend,
  color = 'default' 
}) => {
  const colors = colorClasses[color];
  
  return (
    <div className={`relative overflow-hidden rounded-2xl border p-6 ${colors.bg} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {trend && (
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colors.icon} shadow-lg`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      {/* Decorative gradient overlay */}
      <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-tr from-white/20 to-transparent blur-2xl" />
    </div>
  );
};

export default StatsCard;

