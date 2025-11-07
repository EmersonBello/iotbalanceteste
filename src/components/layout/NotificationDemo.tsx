import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "./useNotifications";
import { NotificationDropdown } from "./NotificationDropdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, Clock, AlertTriangle, Info, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function NotificationDemo() {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    settings,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    clearAllNotifications,
    updateSettings,
    simulateNewNotification
  } = useNotifications();

  const [showDemo, setShowDemo] = useState(true);

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-red-500">Erro: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                🔔 Sistema de Notificações - Demo
                <Badge variant="secondary">{unreadCount} não lidas</Badge>
              </CardTitle>
              <CardDescription>
                Teste interativo das funcionalidades de notificação
              </CardDescription>
            </div>
            <NotificationDropdown
              alertCount={unreadCount}
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onNotificationClick={(notification) => {
                console.log("Notificação clicada:", notification);
                // Navegação ou ação
              }}
            />
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Painel de Controle */}
        <Card>
          <CardHeader>
            <CardTitle>Painel de Controle</CardTitle>
            <CardDescription>
              Simule e gerencie notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={simulateNewNotification}
                className="flex items-center gap-2"
                variant="default"
              >
                <Plus className="h-4 w-4" />
                Nova Notificação
              </Button>
              
              <Button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                variant="outline"
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Marcar Todas
              </Button>
              
              <Button
                onClick={clearAllNotifications}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Limpar Todas
              </Button>
              
              <Button
                onClick={() => setShowDemo(!showDemo)}
                variant="outline"
              >
                {showDemo ? "Ocultar" : "Mostrar"} Demo
              </Button>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p>📊 Total: {notifications.length} notificações</p>
              <p>🔔 Não lidas: {unreadCount}</p>
              <p>✅ Lidas: {notifications.length - unreadCount}</p>
            </div>
          </CardContent>
        </Card>

        {/* Configurações */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
            <CardDescription>
              Personalize as notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={(e) => updateSettings({ enableNotifications: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Ativar notificações</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.enablePush}
                  onChange={(e) => updateSettings({ enablePush: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Notificações push</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.enableEmail}
                  onChange={(e) => updateSettings({ enableEmail: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Notificações por email</span>
              </label>
            </div>

            <div className="pt-2 border-t">
              <p className="text-sm font-medium mb-2">Categorias</p>
              <div className="space-y-2">
                {Object.entries(settings.categories).map(([category, config]) => (
                  <div key={category} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{category}</span>
                    <Badge variant={config.enabled ? "default" : "secondary"} className="text-xs">
                      {config.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Notificações */}
      {showDemo && (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Notificações</CardTitle>
            <CardDescription>
              Visualização completa de todas as notificações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma notificação encontrada</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-3 rounded-lg border transition-colors",
                        !notification.isRead 
                          ? "bg-muted/30 border-primary/20" 
                          : "bg-card hover:bg-muted/50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={cn(
                              "text-sm font-medium",
                              !notification.isRead ? "text-foreground" : "text-muted-foreground"
                            )}>
                              {notification.title}
                            </h4>
                            
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {notification.timestamp}
                              </span>
                              
                              {!notification.isRead && (
                                <Badge variant="secondary" className="text-xs">
                                  Nova
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          
                          {notification.category && (
                            <Badge variant="outline" className="text-xs mt-2">
                              {notification.category}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-1">
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 px-2 text-xs"
                            >
                              Marcar
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeNotification(notification.id)}
                            className="h-6 px-2 text-xs text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "info":
      return <Info className="h-4 w-4 text-blue-500" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case "success":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "error":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return <Info className="h-4 w-4 text-gray-500" />;
  }
}