import { useState } from "react";
import { Bell, X, ChevronRight, AlertTriangle, Info, CheckCircle, Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

interface NotificationDropdownProps {
  alertCount: number;
  notifications?: Notification[];
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onNotificationClick?: (notification: Notification) => void;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Alerta de Bateria Baixa",
    message: "Dispositivo HX711-001 está com bateria em 15%",
    type: "warning",
    timestamp: "2 min atrás",
    isRead: false,
    actionUrl: "/devices/hx711-001"
  },
  {
    id: "2",
    title: "Dispositivo Offline",
    message: "ESP32-003 não responde há 15 minutos",
    type: "error",
    timestamp: "5 min atrás",
    isRead: false,
    actionUrl: "/devices/esp32-003"
  },
  {
    id: "3",
    title: "Atualização Disponível",
    message: "Nova versão 2.1.0 do firmware disponível para 3 dispositivos",
    type: "info",
    timestamp: "1 hora atrás",
    isRead: true,
    actionUrl: "/devices"
  },
  {
    id: "4",
    title: "Backup Concluído",
    message: "Backup automático dos dados concluído com sucesso",
    type: "success",
    timestamp: "2 horas atrás",
    isRead: true
  },
  {
    id: "5",
    title: "Zona Desconectada",
    message: "Zona Norte apresentou falha na conectividade",
    type: "warning",
    timestamp: "3 horas atrás",
    isRead: true,
    actionUrl: "/zones/norte"
  }
];

export function NotificationDropdown({ 
  alertCount,
  notifications = mockNotifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(notifications);

  const unreadCount = localNotifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const handleMarkAsRead = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const updated = localNotifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    setLocalNotifications(updated);
    onMarkAsRead?.(notificationId);
  };

  const handleMarkAllAsRead = () => {
    const updated = localNotifications.map(n => ({ ...n, isRead: true }));
    setLocalNotifications(updated);
    onMarkAllAsRead?.();
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      const updated = localNotifications.map(n => 
        n.id === notification.id ? { ...n, isRead: true } : n
      );
      setLocalNotifications(updated);
    }
    setIsOpen(false);
    onNotificationClick?.(notification);
  };

  const handleViewDetails = (notification: Notification, event: React.MouseEvent) => {
    event.stopPropagation();
    // Não fecha o popover, apenas executa a ação
    onNotificationClick?.(notification);
  };

  const handleViewAllNotifications = () => {
    setIsOpen(false);
    // Navegar para página de todas as notificações
    window.location.href = "/notifications";
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Bell className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        {/* Header */}
        <div className="p-3 border-b">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <h3 className="font-semibold text-sm">Notificações</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="w-full text-xs h-7 text-muted-foreground hover:text-foreground"
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>

        {/* Lista de Notificações */}
        <ScrollArea className="max-h-96">
          {localNotifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhuma notificação</p>
            </div>
          ) : (
            <div className="divide-y">
              {localNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-muted/50 cursor-pointer transition-colors relative",
                    !notification.isRead && "bg-muted/25"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {!notification.isRead && (
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                  
                  <div className="flex items-start gap-3 ml-4">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={cn(
                          "text-sm font-medium leading-tight",
                          !notification.isRead && "text-foreground",
                          notification.isRead && "text-muted-foreground"
                        )}>
                          {notification.title}
                        </h4>
                        
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {notification.timestamp}
                          </span>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className={cn(
                        "text-xs mt-1 leading-relaxed",
                        !notification.isRead ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {notification.message}
                      </p>
                      
                      {notification.actionUrl && (
                        <button
                          onClick={(e) => handleViewDetails(notification, e)}
                          className="flex items-center gap-1 mt-2 text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
                        >
                          <span>Ver detalhes</span>
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {localNotifications.length > 0 && (
          <div className="p-3 border-t bg-muted/20">
            <Button 
              variant="ghost" 
              className="w-full text-sm h-8 hover:bg-muted"
              onClick={handleViewAllNotifications}
            >
              Ver todas as notificações
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}