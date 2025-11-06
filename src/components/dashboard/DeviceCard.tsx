import { AlertCircle, Battery, Radio, TrendingDown, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import type { Device } from '@/types';
import { cn } from '@/lib/utils';

interface DeviceCardProps {
  device: Device;
  onClick?: () => void;
}

const statusConfig = {
  active: { label: 'Ativo', variant: 'default' as const, className: 'bg-success text-success-foreground' },
  offline: { label: 'Offline', variant: 'secondary' as const, className: 'bg-muted text-muted-foreground' },
  maintenance: { label: 'Manutenção', variant: 'secondary' as const, className: 'bg-warning text-warning-foreground' },
  provisioned: { label: 'Provisionado', variant: 'secondary' as const, className: 'bg-info text-info-foreground' },
  retired: { label: 'Inativo', variant: 'secondary' as const, className: 'bg-muted text-muted-foreground' },
};

function getPercentColor(percent: number): string {
  if (percent < 15) return 'bg-gradient-danger';
  if (percent < 30) return 'bg-gradient-warning';
  return 'bg-gradient-success';
}

function formatTimeUntil(isoString?: string): string {
  if (!isoString) return 'N/A';
  
  const now = new Date().getTime();
  const target = new Date(isoString).getTime();
  const diffHours = Math.max(0, Math.round((target - now) / 3600000));
  
  if (diffHours < 1) return '< 1h';
  if (diffHours < 24) return `${diffHours}h`;
  return `${Math.round(diffHours / 24)}d`;
}

export function DeviceCard({ device, onClick }: DeviceCardProps) {
  const statusInfo = statusConfig[device.status];
  const percent = device.currentPercent || 0;
  const isLow = percent < 30;
  
  return (
    <Card 
      className={cn(
        "p-6 transition-all hover:shadow-lg cursor-pointer group relative",
        isLow && "ring-2 ring-warning/50"
      )}
      onClick={onClick}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{device.serial}</h3>
              <Badge className={statusInfo.className}>
                {statusInfo.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {device.currentProduct?.name}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {isLow && (
              <AlertCircle className="h-5 w-5 text-warning animate-pulse-slow" />
            )}
            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Nível</span>
            <span className="font-semibold">{percent.toFixed(1)}%</span>
          </div>
          <div className="relative h-3 overflow-hidden rounded-full bg-muted">
            <div 
              className={cn("h-full transition-all", getPercentColor(percent))}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-3 gap-4 pt-2 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Battery className="h-3.5 w-3.5" />
            <span>{((device.batteryLevel || 0) * 100).toFixed(0)}%</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Radio className="h-3.5 w-3.5" />
            <span>{device.rssi} dBm</span>
          </div>
          
          {device.predictedRunoutAt && (
            <div className="flex items-center gap-1.5 text-warning">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>~{formatTimeUntil(device.predictedRunoutAt)}</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="pt-2 border-t text-xs text-muted-foreground">
          {device.currentContainer?.name}
        </div>

        {/* Click Hint */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-center text-xs text-muted-foreground pt-1">
            <ExternalLink className="h-3 w-3 mr-1" />
            <span>Clique para ver detalhes</span>
          </div>
        </div>
      </div>
    </Card>
  );
}