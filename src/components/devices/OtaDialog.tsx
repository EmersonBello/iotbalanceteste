import { useState, useEffect } from "react";
import { Download, Play, Clock, CheckCircle2, AlertCircle, Wifi, Battery, Server, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import type { Device } from "@/types";
import { cn } from "@/lib/utils";

interface OtaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  devices: Device[];
  onScheduleUpdate: (firmwareId: string, deviceIds: string[], executeImmediately: boolean) => void;
}

interface UpdateProgress {
  deviceId: string;
  deviceName: string;
  status: "pending" | "downloading" | "updating" | "completed" | "failed";
  progress: number;
  error?: string;
  estimatedTime: number;
  startedAt?: string;
  completedAt?: string;
}

interface FirmwareVersion {
  id: string;
  version: string;
  description: string;
  size: string;
  releaseDate: string;
  mandatory: boolean;
  notes: string[];
}

const mockFirmwareVersions: FirmwareVersion[] = [
  {
    id: "fw_2.1.0",
    version: "2.1.0",
    description: "Versão estável com melhorias de conectividade",
    size: "2.3 MB",
    releaseDate: "2025-11-01",
    mandatory: true,
    notes: [
      "Melhoria na estabilidade da conexão WiFi",
      "Correção de bug na leitura de sensor",
      "Otimização do consumo de bateria"
    ]
  },
  {
    id: "fw_2.0.5",
    version: "2.0.5",
    description: "Patch de segurança",
    size: "1.8 MB", 
    releaseDate: "2025-10-15",
    mandatory: false,
    notes: [
      "Correção de vulnerabilidade de segurança",
      "Melhorias no logging de eventos"
    ]
  }
];

const firmwaresByDevice: Record<string, string> = {
  "HX711": "fw_2.1.0",
  "ESP32": "fw_2.0.5",
};

export function OtaDialog({ open, onOpenChange, devices, onScheduleUpdate }: OtaDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<"select" | "confirm" | "progress">("select");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [selectedFirmware, setSelectedFirmware] = useState<string>(firmwaresByDevice["HX711"] || "fw_2.1.0");
  const [executeImmediately, setExecuteImmediately] = useState(true);
  const [updateProgress, setUpdateProgress] = useState<UpdateProgress[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const currentFirmware = mockFirmwareVersions.find(f => f.id === selectedFirmware);
  const availableDevices = devices.filter(device => {
    const requiredFirmware = firmwaresByDevice[device.model] || "fw_2.1.0";
    return requiredFirmware === selectedFirmware && device.status === "active";
  });

  useEffect(() => {
    if (open) {
      // Reset estado quando abrir
      setStep("select");
      setSelectedDevices([]);
      setExecuteImmediately(true);
      setIsUpdating(false);
      setUpdateProgress([]);
    }
  }, [open]);

  const handleDeviceSelect = (deviceId: string, checked: boolean) => {
    if (checked) {
      setSelectedDevices(prev => [...prev, deviceId]);
    } else {
      setSelectedDevices(prev => prev.filter(id => id !== deviceId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDevices(availableDevices.map(d => d.id));
    } else {
      setSelectedDevices([]);
    }
  };

  const handleStartUpdate = () => {
    if (selectedDevices.length === 0) {
      toast({
        title: "Nenhum dispositivo selecionado",
        description: "Selecione pelo menos um dispositivo para atualizar.",
        variant: "destructive"
      });
      return;
    }

    if (currentFirmware?.mandatory) {
      setExecuteImmediately(true);
    }

    setStep("confirm");
  };

  const handleExecuteUpdate = async () => {
    setStep("progress");
    setIsUpdating(true);

    // Inicializa progresso para todos os dispositivos
    const initialProgress: UpdateProgress[] = selectedDevices.map(deviceId => {
      const device = devices.find(d => d.id === deviceId);
      return {
        deviceId,
        deviceName: device?.serial || "Desconhecido",
        status: "pending",
        progress: 0,
        estimatedTime: 120, // 2 minutos estimado
        startedAt: new Date().toISOString(),
      };
    });

    setUpdateProgress(initialProgress);

    // Simula o processo de atualização
    for (let i = 0; i < selectedDevices.length; i++) {
      const deviceId = selectedDevices[i];
      const device = devices.find(d => d.id === deviceId);
      
      if (!device) continue;

      // Etapa 1: Download (10 segundos)
      setUpdateProgress(prev => prev.map(p => 
        p.deviceId === deviceId 
          ? { ...p, status: "downloading" as const, progress: 10 }
          : p
      ));

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Etapa 2: Baixando firmware (20 segundos)
      for (let progress = 10; progress <= 100; progress += 10) {
        setUpdateProgress(prev => prev.map(p => 
          p.deviceId === deviceId 
            ? { ...p, progress }
            : p
        ));
        await new Promise(resolve => setTimeout(resolve, 400));
      }

      // Etapa 3: Instalando (15 segundos)
      setUpdateProgress(prev => prev.map(p => 
        p.deviceId === deviceId 
          ? { ...p, status: "updating" as const, progress: 100 }
          : p
      ));

      await new Promise(resolve => setTimeout(resolve, 3000));

      // Etapa 4: Concluído
      setUpdateProgress(prev => prev.map(p => 
        p.deviceId === deviceId 
          ? { 
              ...p, 
              status: "completed" as const, 
              progress: 100,
              completedAt: new Date().toISOString()
            }
          : p
      ));
    }

    setIsUpdating(false);
    
    // Callback para o componente pai
    onScheduleUpdate(selectedFirmware, selectedDevices, executeImmediately);

    // Feedback de sucesso
    toast({
      title: "Atualização OTA concluída!",
      description: `${selectedDevices.length} dispositivo(s) atualizados com sucesso.`,
    });
  };

  const handleClose = () => {
    if (!isUpdating) {
      onOpenChange(false);
    }
  };

  const getStatusIcon = (status: UpdateProgress["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case "downloading":
        return <Download className="h-4 w-4 text-info animate-pulse" />;
      case "updating":
        return <Server className="h-4 w-4 text-warning animate-pulse" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-danger" />;
    }
  };

  const getStatusText = (status: UpdateProgress["status"]) => {
    switch (status) {
      case "pending": return "Aguardando...";
      case "downloading": return "Baixando firmware...";
      case "updating": return "Instalando...";
      case "completed": return "Concluído";
      case "failed": return "Falhou";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Atualização OTA
          </DialogTitle>
          <DialogDescription>
            Atualize o firmware dos seus dispositivos remotamente
          </DialogDescription>
        </DialogHeader>

        {/* Etapa 1: Seleção */}
        {step === "select" && (
          <div className="space-y-6">
            {/* Seleção de Firmware */}
            <div>
              <h3 className="text-sm font-medium mb-3">Selecionar Firmware</h3>
              <div className="space-y-2">
                {mockFirmwareVersions.map((firmware) => (
                  <div
                    key={firmware.id}
                    className={cn(
                      "p-3 border rounded-lg cursor-pointer transition-all",
                      selectedFirmware === firmware.id 
                        ? "border-primary bg-primary/5" 
                        : "hover:border-muted-foreground/50"
                    )}
                    onClick={() => setSelectedFirmware(firmware.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">v{firmware.version}</span>
                          {firmware.mandatory && (
                            <Badge variant="destructive" className="text-xs">Obrigatório</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {firmware.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                          <span>Tamanho: {firmware.size}</span>
                          <span>Data: {new Date(firmware.releaseDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2",
                        selectedFirmware === firmware.id 
                          ? "border-primary bg-primary" 
                          : "border-muted-foreground"
                      )}>
                        {selectedFirmware === firmware.id && (
                          <div className="w-full h-full rounded-full bg-white scale-50" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seleção de Dispositivos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">
                  Selecionar Dispositivos ({availableDevices.length} disponíveis)
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                  const shouldSelectAll = selectedDevices.length !== availableDevices.length;
                  handleSelectAll(shouldSelectAll);
}}
                >
                  {selectedDevices.length === availableDevices.length ? "Desmarcar todos" : "Marcar todos"}
                </Button>
              </div>
              
              <div className="max-h-60 overflow-y-auto space-y-2">
                {availableDevices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <Checkbox
                      checked={selectedDevices.includes(device.id)}
                      onCheckedChange={(checked) => handleDeviceSelect(device.id, checked as boolean)}
                    />
                    <div className="flex-1 grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="font-medium">{device.serial}</p>
                        <p className="text-muted-foreground text-xs">{device.model}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Battery className="h-3 w-3" />
                        <span>{(device.batteryLevel * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Wifi className="h-3 w-3" />
                        <span>{device.rssi} dBm</span>
                      </div>
                      <Badge variant="secondary" className="w-fit text-xs">
                        {device.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedDevices.length} dispositivo(s) selecionado(s)
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleStartUpdate} disabled={selectedDevices.length === 0}>
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Etapa 2: Confirmação */}
        {step === "confirm" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Confirmar Atualização</h3>
              <p className="text-sm text-muted-foreground">
                Você está prestes a atualizar {selectedDevices.length} dispositivo(s) para a versão {currentFirmware?.version}
              </p>
            </div>

            {/* Opções de Execução */}
            {currentFirmware && !currentFirmware.mandatory && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Opções de Atualização</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <input
                      type="radio"
                      checked={executeImmediately}
                      onChange={() => setExecuteImmediately(true)}
                      className="text-primary"
                    />
                    <Play className="h-4 w-4 text-success" />
                    <div>
                      <p className="text-sm font-medium">Executar agora</p>
                      <p className="text-xs text-muted-foreground">Inicia a atualização imediatamente</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <input
                      type="radio"
                      checked={!executeImmediately}
                      onChange={() => setExecuteImmediately(false)}
                      className="text-primary"
                    />
                    <Clock className="h-4 w-4 text-info" />
                    <div>
                      <p className="text-sm font-medium">Agendar para mais tarde</p>
                      <p className="text-xs text-muted-foreground">Agenda a atualização em horário conveniente</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Resumo */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="text-sm font-medium">Resumo da Atualização</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Firmware:</p>
                  <p className="font-medium">v{currentFirmware?.version}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Dispositivos:</p>
                  <p className="font-medium">{selectedDevices.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tamanho:</p>
                  <p className="font-medium">{currentFirmware?.size}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tempo estimado:</p>
                  <p className="font-medium">~{Math.ceil(selectedDevices.length * 2)} min</p>
                </div>
              </div>
            </div>

            {/* Notas do firmware */}
            {currentFirmware && currentFirmware.notes.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">O que há de novo na v{currentFirmware.version}</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {currentFirmware.notes.map((note, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("select")}>
                Voltar
              </Button>
              <Button onClick={handleExecuteUpdate}>
                <Play className="mr-2 h-4 w-4" />
                {executeImmediately ? "Iniciar Atualização" : "Agendar"}
              </Button>
            </div>
          </div>
        )}

        {/* Etapa 3: Progresso */}
        {step === "progress" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Atualizando Dispositivos</h3>
              <p className="text-sm text-muted-foreground">
                Acompanhe o progresso da atualização OTA
              </p>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {updateProgress.map((progress) => (
                <div key={progress.deviceId} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(progress.status)}
                      <span className="font-medium">{progress.deviceName}</span>
                    </div>
                    <Badge variant={
                      progress.status === "completed" ? "default" :
                      progress.status === "failed" ? "destructive" :
                      "secondary"
                    }>
                      {getStatusText(progress.status)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{progress.progress}%</span>
                    </div>
                    <Progress value={progress.progress} className="h-2" />
                  </div>

                  {progress.error && (
                    <div className="text-sm text-danger bg-danger/10 p-2 rounded">
                      Erro: {progress.error}
                    </div>
                  )}

                  {progress.status === "completed" && progress.completedAt && (
                    <div className="text-xs text-success">
                      Concluído em: {new Date(progress.completedAt).toLocaleTimeString('pt-BR')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!isUpdating && updateProgress.every(p => p.status === "completed") && (
              <div className="text-center">
                <Button onClick={handleClose} className="w-full">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Finalizar
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}