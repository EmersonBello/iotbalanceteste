import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { NotificationDropdown } from "./NotificationDropdown";
import type { Notification } from "./notification-types";
import { mockNotifications } from "./notification-types";

interface HeaderProps {
  alertCount: number;
}

export const Header = ({ alertCount }: HeaderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    console.log("Notificação clicada:", notification);
    // Aqui você pode adicionar navegação ou outras ações
    if (notification.actionUrl) {
      // navigate(notification.actionUrl); // Se usar React Router
    }
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="px-6 py-4 flex items-center justify-between">
        <SidebarTrigger />
        
        <div className="flex items-center gap-4">
          <NotificationDropdown
            alertCount={alertCount}
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onNotificationClick={handleNotificationClick}
          />
        </div>
      </div>
    </header>
  );
};