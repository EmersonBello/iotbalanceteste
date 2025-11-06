import { AlertTriangle, AlertCircle, Info, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { Alert } from '@/types';
import { cn } from '@/lib/utils';

interface AlertCardProps {
  alert: Alert;
  onAcknowledge?: (alertId: string) => void;
  isAcknowledged?: boolean;
}

const severityConfig = {
  critical: {
    icon: AlertCircle,
    label: 'Crítico',
    className: 'bg-danger text-danger-foreground',
    iconColor: 'text-danger',
  },
  warning: {
    icon: AlertTriangle,
    label: 'Aviso',
    className: 'bg-warning text-warning-foreground',
    iconColor: 'text-warning',
  },
  info: {
    icon: Info,
    label: 'Info',
    className: 'bg-info text-info-foreground',
    iconColor: 'text-info',
  },
};

function formatRelativeTime(isoString: string): string {
  const now = new Date().getTime();
  const then = new Date(isoString).getTime();
  const diffMinutes = Math.floor((now - then) / 60000);
  
  if (diffMinutes < 1) return 'Agora';
  if (diffMinutes < 60) return `${diffMinutes}m atrás`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h atrás`;
  return `${Math.floor(diffHours / 24)}d atrás`;
}

export function AlertCard({ alert, onAcknowledge, isAcknowledged = false }: AlertCardProps) {
  const config = severityConfig[alert.severity];
  const Icon = config.icon;
  
  // Não renderiza o card se foi reconhecido
  if (isAcknowledged) {
    return null;
  }
  
  return (
    <Card className={cn(
      "p-4 transition-all hover:shadow-md",
      alert.severity === 'critical' && "ring-2 ring-danger/50",
      isAcknowledged && "opacity-50"
    )}>
      <div className="flex gap-4">
        <div className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          alert.severity === 'critical' ? 'bg-danger/10' : 'bg-warning/10'
        )}>
          <Icon className={cn("h-5 w-5", config.iconColor)} />
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className={config.className}>
                  {config.label}
                </Badge>
                <span className="text-sm font-semibold">
                  {alert.device?.serial}
                </span>
                {isAcknowledged && (
                  <Badge variant="outline" className="text-success border-success">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Reconhecido
                  </Badge>
                )}
              </div>
              <p className="text-sm text-foreground">{alert.message}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{alert.location?.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatRelativeTime(alert.openedAt)}</span>
            </div>
          </div>
          
          {alert.status === 'open' && !isAcknowledged && (
            <div className="pt-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onAcknowledge?.(alert.id)}
                className="hover:bg-success hover:text-success-foreground"
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Reconhecer
              </Button>
            </div>
          )}

          {isAcknowledged && (
            <div className="pt-2">
              <div className="flex items-center gap-2 text-xs text-success">
                <CheckCircle2 className="h-3 w-3" />
                <span>Reconhecido - Será removido da lista</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}