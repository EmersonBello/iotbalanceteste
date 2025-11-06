export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  category?: string;
  priority?: "low" | "medium" | "high" | "critical";
  deviceId?: string;
  deviceName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationFilter {
  type?: Notification["type"][];
  isRead?: boolean;
  category?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface NotificationSettings {
  enableNotifications: boolean;
  enablePush: boolean;
  enableEmail: boolean;
  categories: {
    [key: string]: {
      enabled: boolean;
      priority: "low" | "medium" | "high" | "critical";
    };
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm
    end: string; // HH:mm
  };
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  filters: NotificationFilter;
  settings: NotificationSettings;
}

export type NotificationAction = 
  | { type: "MARK_AS_READ"; payload: string }
  | { type: "MARK_ALL_AS_READ" }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "SET_FILTERS"; payload: NotificationFilter }
  | { type: "UPDATE_SETTINGS"; payload: Partial<NotificationSettings> }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

// Mock data para desenvolvimento
export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Alerta de Bateria Baixa",
    message: "Dispositivo HX711-001 está com bateria em 15%",
    type: "warning",
    timestamp: "2 min atrás",
    isRead: false,
    actionUrl: "/devices/hx711-001",
    category: "device",
    priority: "high",
    deviceId: "hx711-001",
    deviceName: "HX711-001",
    createdAt: new Date(Date.now() - 2 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000)
  },
  {
    id: "2", 
    title: "Dispositivo Offline",
    message: "ESP32-003 não responde há 15 minutos",
    type: "error",
    timestamp: "5 min atrás",
    isRead: false,
    actionUrl: "/devices/esp32-003",
    category: "device",
    priority: "critical",
    deviceId: "esp32-003", 
    deviceName: "ESP32-003",
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: "3",
    title: "Atualização Disponível", 
    message: "Nova versão 2.1.0 do firmware disponível para 3 dispositivos",
    type: "info",
    timestamp: "1 hora atrás",
    isRead: true,
    actionUrl: "/devices",
    category: "system",
    priority: "medium",
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 60 * 60 * 1000)
  },
  {
    id: "4",
    title: "Backup Concluído",
    message: "Backup automático dos dados concluído com sucesso", 
    type: "success",
    timestamp: "2 horas atrás",
    isRead: true,
    category: "system",
    priority: "low",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: "5",
    title: "Zona Desconectada",
    message: "Zona Norte apresentou falha na conectividade",
    type: "warning", 
    timestamp: "3 horas atrás",
    isRead: true,
    actionUrl: "/zones/norte",
    category: "location",
    priority: "high",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
  }
];