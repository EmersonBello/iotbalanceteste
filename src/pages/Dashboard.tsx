import { useState, useEffect } from 'react';
import { Activity, AlertCircle, Battery, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { DeviceCard } from '@/components/dashboard/DeviceCard';
import { AlertCard } from '@/components/dashboard/AlertCard';
import { WaiterRefillChart } from '@/components/dashboard/WaiterRefillChart';
import { AlertFrequencyChart } from '@/components/dashboard/AlertFrequencyChart';
import { loadMockData, getDashboardStats, getWaiterPerformanceMetrics, getAlertFrequencyByZone } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [data] = useState(() => loadMockData());
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(new Set());
  const stats = getDashboardStats(data);

  // Carrega alertas reconhecidos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('acknowledgedAlerts');
    if (saved) {
      setAcknowledgedAlerts(new Set(JSON.parse(saved)));
    }
  }, []);

  // Salva alertas reconhecidos no localStorage
  useEffect(() => {
    localStorage.setItem('acknowledgedAlerts', JSON.stringify([...acknowledgedAlerts]));
  }, [acknowledgedAlerts]);

  const handleAcknowledgeAlert = (alertId: string) => {
    // Adiciona o alerta ao conjunto de reconhecidos
    setAcknowledgedAlerts(prev => new Set([...prev, alertId]));

    toast({
      title: "Alerta reconhecido",
      description: "O alerta foi marcado como reconhecido e será removido da lista.",
    });
  };

  const handleDeviceClick = (deviceId: string) => {
    toast({
      title: "Navegando para dispositivo",
      description: "Redirecionando para página de detalhes do dispositivo.",
    });

    // Navega para a página de detalhes do dispositivo
    navigate(`/devices/${deviceId}`);
  };

  // Filtra apenas alertas não reconhecidos
  const activeAlerts = data.alerts.filter(alert => !acknowledgedAlerts.has(alert.id));

  // Ordena dispositivos por nível de carga
  const sortedDevices = [...data.devices].sort((a, b) => {
    const aPercent = a.currentPercent || 100;
    const bPercent = b.currentPercent || 100;
    return aPercent - bPercent;
  });

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Visão geral do sistema IoT Balance
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Seção: Visão Geral */}
        <div>
          <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold tracking-tight">
            Visão Geral
          </h2>
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Dispositivos Ativos"
              value={stats.activeDevices}
              icon={Activity}
              trend={`${stats.totalDevices} total`}
              variant="success"
            />
            <StatsCard
              title="Alertas Críticos"
              value={activeAlerts.filter(alert => alert.severity === 'critical').length}
              icon={AlertCircle}
              trend="Requer atenção imediata"
              variant="danger"
            />
            <StatsCard
              title="Níveis Baixos"
              value={stats.devicesRunningLow}
              icon={TrendingDown}
              trend="Próximos de esgotar"
              variant="warning"
            />
            <StatsCard
              title="Bateria Média"
              value={`${(stats.avgBatteryLevel * 100).toFixed(0)}%`}
              icon={Battery}
              trend={`${stats.offlineDevices} offline`}
              variant="default"
            />
          </div>
        </div>

        {/* Seção: Analytics de Performance */}
        <div>
          <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold tracking-tight">
            Analytics de Performance
          </h2>
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <WaiterRefillChart data={getWaiterPerformanceMetrics(data)} />
            <AlertFrequencyChart data={getAlertFrequencyByZone(data)} />
          </div>
        </div>

        {/* Seção: Alertas Ativos */}
        {activeAlerts.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Alertas Ativos
              </h2>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {activeAlerts.length} alerta{activeAlerts.length !== 1 ? 's' : ''} ativo
                {activeAlerts.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {activeAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={handleAcknowledgeAlert}
                  isAcknowledged={acknowledgedAlerts.has(alert.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mensagem quando não há alertas ativos */}
        {activeAlerts.length === 0 && data.alerts.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="text-center py-8">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-success/10 p-4">
                  <Activity className="h-8 w-8 text-success" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-success mb-2">
                Nenhum alerta ativo
              </h3>
              <p className="text-sm text-muted-foreground">
                Todos os alertas foram reconhecidos. Sistema operando normalmente.
              </p>
            </div>
          </div>
        )}

        {/* Seção: Todos os Dispositivos */}
        <div>
          <div className="mb-4 sm:mb-6 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Todos os Dispositivos
            </h2>
            <span className="text-xs sm:text-sm text-muted-foreground">
              {sortedDevices.length} dispositivo
              {sortedDevices.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedDevices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                onClick={() => handleDeviceClick(device.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}