import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'accent';
  className?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  variant = 'default',
  className 
}: StatsCardProps) {
  const variantStyles = {
    default: 'bg-card',
    primary: 'bg-gradient-primary text-primary-foreground',
    success: 'bg-gradient-to-br from-success to-success/80 text-success-foreground',
    warning: 'bg-gradient-to-br from-warning to-warning/80 text-warning-foreground',
    accent: 'bg-gradient-accent text-accent-foreground'
  };

  const iconStyles = {
    default: 'bg-primary/10 text-primary',
    primary: 'bg-primary-foreground/20 text-primary-foreground',
    success: 'bg-success-foreground/20 text-success-foreground',
    warning: 'bg-warning-foreground/20 text-warning-foreground',
    accent: 'bg-accent-foreground/20 text-accent-foreground'
  };

  return (
    <Card className={cn(
      'shadow-card-medical hover:shadow-medical transition-all duration-300',
      variantStyles[variant],
      className
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            iconStyles[variant]
          )}>
            <Icon className="w-5 h-5" />
          </div>
          {trend && (
            <div className={cn(
              'text-xs font-medium',
              trend.isPositive ? 'text-success' : 'text-destructive',
              variant !== 'default' && 'text-current opacity-80'
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className={cn(
            'text-2xl font-bold',
            variant === 'default' ? 'text-foreground' : 'text-current'
          )}>
            {value}
          </p>
          <p className={cn(
            'text-sm',
            variant === 'default' ? 'text-muted-foreground' : 'text-current opacity-80'
          )}>
            {title}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}