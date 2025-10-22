import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Activity, Battery, Signal, Thermometer, Pencil } from "lucide-react";
import { loadMockData, saveMockData, generateWeightHistory } from "@/lib/mockData";
import { WeightChart } from "@/components/device/WeightChart";
import { ConsumptionHistory } from "@/components/device/ConsumptionHistory";
import { DevicePolicyConfig } from "@/components/device/DevicePolicyConfig";
import { DeviceDialog } from "@/components/devices/DeviceDialog";
import { useToast } from "@/hooks/use-toast";

const DeviceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [data, setData] = useState(loadMockData());
  const [editOpen, setEditOpen] = useState(false);
  
  const device = data.devices.find(d => d.id === id);
  const assignment = data.deviceAssignments?.find(a => a.deviceId === id && !a.endedAt);
  const product = assignment ? data.products.find(p => p.id === assignment.productId) : null;
  const container = assignment ? data.containers.find(c => c.id === assignment.containerId) : null;
  const location = device ? data.locations.find(l => l.id === device.locationId) : null;
  const zone = device?.zoneId ? data.zones.find(z => z.id === device.zoneId) : null;
  const policies = data.policies.filter(p => p.scopeType === "device" && p.scopeId === id);

  if (!device) {
    return (
      <div className="space-y-6">
        <Link to="/devices">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Dispositivo não encontrado</p>
        </Card>
      </div>
    );
  }

  const weightHistory = generateWeightHistory(device);

  const getStatusColor = (percent: number) => {
    if (percent < 15) return "text-danger";
    if (percent < 30) return "text-warning";
    return "text-success";
  };

  const handleSave = (updated: Partial<typeof device>) => {
    const newData = { ...data };
    const index = newData.devices.findIndex(d => d.id === device.id);
    newData.devices[index] = { ...device, ...updated };
    saveMockData(newData);
    setData(newData);
    toast({ title: "Dispositivo atualizado com sucesso!" });
    setEditOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Link to="/devices">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <Button onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>
        <Badge variant={device.status === "active" ? "default" : "secondary"}>
          {device.status}
        </Badge>
      </div>

      <div>
        <h1 className="text-3xl font-bold">{device.serial}</h1>
        <p className="text-muted-foreground">{product?.name || "Sem produto vinculado"}</p>
      </div>

      {/* (demais cards e abas continuam iguais) */}

      <Tabs defaultValue="chart" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chart">Gráfico</TabsTrigger>
          <TabsTrigger value="consumption">Histórico de Consumo</TabsTrigger>
          <TabsTrigger value="policies">Políticas e Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="chart">
          <Card className="p-6">
            <WeightChart data={weightHistory} />
          </Card>
        </TabsContent>

        <TabsContent value="consumption">
          <ConsumptionHistory device={device} />
        </TabsContent>

        <TabsContent value="policies">
          <DevicePolicyConfig device={device} policies={policies} />
        </TabsContent>
      </Tabs>

      {/* Modal de edição */}
      <DeviceDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={handleSave}
        device={device}
        organizations={data.organizations}
        locations={data.locations}
        zones={data.zones}
      />
    </div>
  );
};

export default DeviceDetailPage;