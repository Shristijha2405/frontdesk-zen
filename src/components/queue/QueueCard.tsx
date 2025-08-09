import { Clock, User, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QueueItem {
  id: string;
  queueNumber: number;
  patientName: string;
  phone: string;
  waitTime: string;
  status: 'waiting' | 'with-doctor' | 'completed' | 'urgent';
  priority?: boolean;
}

interface QueueCardProps {
  item: QueueItem;
  onStatusUpdate: (id: string, status: QueueItem['status']) => void;
}

const statusConfig = {
  waiting: {
    label: 'Waiting',
    variant: 'secondary' as const,
    color: 'text-muted-foreground'
  },
  'with-doctor': {
    label: 'With Doctor',
    variant: 'default' as const,
    color: 'text-primary'
  },
  completed: {
    label: 'Completed',
    variant: 'secondary' as const,
    color: 'text-success'
  },
  urgent: {
    label: 'Urgent',
    variant: 'destructive' as const,
    color: 'text-destructive'
  }
};

export default function QueueCard({ item, onStatusUpdate }: QueueCardProps) {
  const statusStyle = statusConfig[item.status];

  return (
    <Card className={cn(
      'transition-all duration-300 hover:shadow-medical',
      item.priority && 'ring-2 ring-warning/50 bg-warning-light/10',
      item.status === 'urgent' && 'ring-2 ring-destructive/50 bg-destructive/5'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
              #{item.queueNumber}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{item.patientName}</h3>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Phone className="w-3 h-3" />
                <span>{item.phone}</span>
              </div>
            </div>
          </div>
          <Badge variant={statusStyle.variant}>
            {statusStyle.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Waiting: {item.waitTime}</span>
          </div>
          
          <div className="flex space-x-2">
            {item.status === 'waiting' && (
              <>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onStatusUpdate(item.id, 'with-doctor')}
                >
                  Call In
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => onStatusUpdate(item.id, 'urgent')}
                >
                  Mark Urgent
                </Button>
              </>
            )}
            
            {item.status === 'with-doctor' && (
              <Button 
                size="sm" 
                variant="default"
                onClick={() => onStatusUpdate(item.id, 'completed')}
                className="bg-success hover:bg-success/90"
              >
                Complete
              </Button>
            )}
            
            {item.status === 'urgent' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onStatusUpdate(item.id, 'with-doctor')}
              >
                Call In
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}