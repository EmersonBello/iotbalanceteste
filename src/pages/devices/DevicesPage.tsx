import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Activity, Battery, Signal, Download, Settings, Wifi } from "lucide-react";
import { loadMockData, saveMockData } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { DeviceDialog } from "@/components/devices/DeviceDialog";
import { OtaDialog } from "@/components/devices/OtaDialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import type { Device } from "@/types";

const DevicesPage = () => {
  const { toast } = useToast();
  const [data, setData] = useState(loadMockData());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [otaDialogOpen, setOtaDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  const handleSave = (device: Partial<Device>) => {
    const newData = { ...data };
    
    if (editingDevice) {
      const index = newData.devices.findIndex(d => d.id === editingDevice.id);
      newData.devices[index] = { ...editingDevice, ...device };
      toast({ title: "Dispositivo atualizado com sucesso!" });
    } else {
      const newDevice: Device = {
        id: `dev_${Date.now()}`,
        organizationId: device.organizationId!,
        locationId: device.locationId!,
        zoneId: device.zoneId || undefined,
        serial: device.serial!,
        model: device.model || "HX711",
        firmwareVersion: "1.0.0",
        status: "active",
        lastSeenAt: new Date().toISOString(),
        batteryLevel: 1.0,
        rssi: -60,
        calibrationFactor: device.calibrationFactor || 1.0,
        offset: device.offset || 0,
        unit: "g",
        currentPercent: 100,
        minReportingIntervalS: 15,
        maxReportingIntervalS: 300,
        createdAt: new Date().toISOString(),
      };
      newData.devices.push(newDevice);
      toast({ title: "Dispositivo criado com sucesso!" });
    }
    
    saveMockData(newData);
    setData(newData);
    setDialogOpen(false);
    setEditingDevice(null);
  };

  const handleEdit = (device: Device) => {
    setEditingDevice(device);
    setDialogOpen(true);
  };

  const handleScheduleOta = (firmwareId: string, deviceIds: string[], executeImmediately: boolean = false) => {
    if (executeImmediately) {
      // Executa atualização diretamente
      toast({
        title: "Atualização OTA iniciada!",
        description: `Iniciando atualização em ${deviceIds.length} dispositivo(s).`,
      });
    } else {
      // Agenda atualização
      toast({
        title: "Atualização OTA agendada!",
        description: `${deviceIds.length} dispositivo(s) serão atualizados.`,
      });
    }
  };

  const getStatusColor = (percent: number) => {
    if (percent < 15) return "text-danger";
    if (percent < 30) return "text-warning";
    return "text-success";
  };

  const getStatusBadge = (device: Device) => {
    if (device.status === 'active') {
      return <Badge variant="default" className="bg-success text-success-foreground">Ativo</Badge>;
    } else if (device.status === 'offline') {
      return <Badge variant="secondary" className="bg-muted text-muted-foreground">Offline</Badge>;
    } else if (device.status === 'maintenance') {
      return <Badge variant="outline" className="text-warning border-warning">Manutenção</Badge>;
    }
    return <Badge variant="secondary">{device.status}</Badge>;
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dispositivos</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gerencie sensores e configurações
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setOtaDialogOpen(true)}
            className="flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Download className="mr-2 h-4 w-4" />
            Atualizar OTA
          </Button>
          <Button
            onClick={() => { setEditingDevice(null); setDialogOpen(true); }}
            className="flex-1 sm:flex-none"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Dispositivo
          </Button>
        </div>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Ativos</p>
              <p className="text-lg font-bold">
                {data.devices.filter(d => d.status === 'active').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Offline</p>
              <p className="text-lg font-bold">
                {data.devices.filter(d => d.status === 'offline').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Battery className="h-5 w-5 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Bateria Baixa</p>
              <p className="text-lg font-bold">
                {data.devices.filter(d => (d.batteryLevel || 0) < 0.3).length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-info" />
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-lg font-bold">{data.devices.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.devices.map((device) => {
        const assignment = data.deviceAssignments?.find(
          a => a.deviceId === device.id && !a.endedAt
        );
        const product = assignment 
          ? data.products.find(p => p.id === assignment.productId)
          : null;
        const location = data.locations.find(l => l.id === device.locationId);

          return (
            <div key={device.id} className="space-y-2">
              <Link to={`/devices/${device.id}`}>
                <Card className="p-4 sm:p-6 hover:border-primary/50 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <Activity className={`h-6 w-6 sm:h-8 sm:w-8 ${getStatusColor(device.currentPercent)} group-hover:scale-110 transition-transform`} />
                    {getStatusBadge(device)}
                  </div>
                  
                  <h3 className="text-base sm:text-lg font-semibold mb-1 truncate">
                    {device.serial}
                  </h3>
                  {product && (
                    <p className="text-sm text-muted-foreground mb-2">{product.name}</p>
                  )}
                  {location && (
                    <p className="text-xs text-muted-foreground mb-4">{location.name}</p>
                  )}
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Nível</span>
                        <span className={`font-medium ${getStatusColor(device.currentPercent)}`}>
                          {device.currentPercent.toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={device.currentPercent} 
                        className={`h-2 ${device.currentPercent < 30 ? '[&>div]:bg-warning' : ''}`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Battery className="h-4 w-4" />
                        <span>{(device.batteryLevel * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Signal className="h-4 w-4" />
                        <span>{device.rssi} dBm</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
              
              {/* Botão OTA individual */}
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  setOtaDialogOpen(true);
                  // Pré-selecionar este dispositivo
                  setTimeout(() => {
                    const element = document.querySelector(`[data-device-id="${device.id}"]`) as HTMLElement;
                    if (element) {
                      element.click();
                    }
                  }, 100);
                }}
                className="w-full text-xs"
              >
                <Download className="mr-1 h-3 w-3" />
                Atualizar OTA
              </Button>
            </div>
          );
        })}
      </div>

      <DeviceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        device={editingDevice}
        organizations={data.organizations}
        locations={data.locations}
        zones={data.zones}
      />

      <OtaDialog
        open={otaDialogOpen}
        onOpenChange={setOtaDialogOpen}
        devices={data.devices}
        onScheduleUpdate={handleScheduleOta}
      />
    </div>
  );
};

export default DevicesPage;