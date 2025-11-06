import { useState, useEffect, useCallback } from "react";
import type { Notification, NotificationAction, NotificationFilter, NotificationSettings } from "./notification-types";
import { mockNotifications } from "./notification-types";

const defaultSettings: NotificationSettings = {
  enableNotifications: true,
  enablePush: true,
  enableEmail: false,
  categories: {
    device: { enabled: true, priority: "high" },
    system: { enabled: true, priority: "medium" },
    location: { enabled: true, priority: "medium" },
    user: { enabled: true, priority: "low" }
  },
  quietHours: {
    enabled: false,
    start: "22:00",
    end: "08:00"
  }
};

const STORAGE_KEYS = {
  NOTIFICATIONS: "iot_balance_notifications",
  SETTINGS: "iot_balance_notification_settings",
  READ_STATUS: "iot_balance_read_notifications"
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    try {
      // Carregar notificações
      const savedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const readStatus = localStorage.getItem(STORAGE_KEYS.READ_STATUS);
      
      if (savedNotifications) {
        const parsedNotifications = JSON.parse(savedNotifications);
        // Aplicar status de leitura salvo
        if (readStatus) {
          const readIds = JSON.parse(readStatus);
          const updated = parsedNotifications.map((n: Notification) => ({
            ...n,
            isRead: readIds.includes(n.id)
          }));
          setNotifications(updated);
        } else {
          setNotifications(parsedNotifications);
        }
      } else {
        // Se não há notificações salvas, usar mock
        setNotifications(mockNotifications);
      }

      // Carregar configurações
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }

      setIsLoading(false);
    } catch (err) {
      setError("Erro ao carregar notificações");
      setIsLoading(false);
    }
  }, []);

  // Salvar no localStorage quando notificações mudarem
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      
      // Salvar apenas os IDs das notificações lidas para economizar espaço
      const readIds = notifications.filter(n => n.isRead).map(n => n.id);
      localStorage.setItem(STORAGE_KEYS.READ_STATUS, JSON.stringify(readIds));
    }
  }, [notifications, isLoading]);

  // Salvar configurações quando mudarem
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Ações
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, "id" | "createdAt" | "updatedAt">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      timestamp: "agora"
    };

    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Simular novas notificações (para desenvolvimento)
  const simulateNewNotification = useCallback(() => {
    const types: Notification["type"][] = ["info", "warning", "success", "error"];
    const messages = [
      "Novo dispositivo conectado à rede",
      "Calibração de sensor necessária",
      "Relatório mensal gerado com sucesso",
      "Falha na comunicação com servidor",
      "Temperatura fora do range normal",
      "Backup programado iniciado"
    ];

    addNotification({
      title: "Notificação de Teste",
      message: messages[Math.floor(Math.random() * messages.length)],
      type: types[Math.floor(Math.random() * types.length)],
      timestamp: "agora",
      isRead: false,
      category: "system"
    });
  }, [addNotification]);

  // Gerar timestamp relativo
  const getRelativeTime = useCallback((date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "agora";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min atrás`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} horas atrás`;
    return `${Math.floor(diffInSeconds / 86400)} dias atrás`;
  }, []);

  // Atualizar timestamps relativos
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(prev => 
        prev.map(n => ({
          ...n,
          timestamp: getRelativeTime(n.createdAt)
        }))
      );
    }, 60000); // Atualizar a cada minuto

    return () => clearInterval(interval);
  }, [getRelativeTime]);

  return {
    // Estado
    notifications,
    unreadCount,
    isLoading,
    error,
    settings,
    
    // Ações
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    clearAllNotifications,
    updateSettings,
    simulateNewNotification,
    
    // Utilitários
    getRelativeTime
  };
}