import { useState } from 'react';
import { Bell, Search, Filter, CheckCircle2, Clock, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    timestamp: string;
    isRead: boolean;
    actionUrl?: string;
    resolvedAt?: string;
}

// Mock notifications data
const mockNotifications: Notification[] = [
    {
        id: '1',
        title: 'Alerta de Bateria Baixa',
        message: 'Dispositivo HX711-001 está com bateria em 15%',
        type: 'warning',
        timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
        isRead: false,
        actionUrl: '/devices/dev_1',
    },
    {
        id: '2',
        title: 'Dispositivo Offline',
        message: 'ESP32-003 não responde há 15 minutos',
        type: 'error',
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        isRead: false,
        actionUrl: '/devices/dev_3',
    },
    {
        id: '3',
        title: 'Nível Crítico Detectado',
        message: 'Barril na Zona Norte está com apenas 8% de capacidade',
        type: 'error',
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        isRead: true,
        actionUrl: '/zones/zone_1',
    },
    {
        id: '4',
        title: 'Atualização Disponível',
        message: 'Nova versão 2.1.0 do firmware disponível para 3 dispositivos',
        type: 'info',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isRead: true,
        actionUrl: '/devices',
        resolvedAt: new Date(Date.now() - 1800000).toISOString(),
    },
    {
        id: '5',
        title: 'Backup Concluído',
        message: 'Backup automático dos dados concluído com sucesso',
        type: 'success',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        isRead: true,
        resolvedAt: new Date(Date.now() - 7000000).toISOString(),
    },
];

export default function NotificationsPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'resolved'>('all');

    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'info':
                return <Info className="h-5 w-5 text-blue-500" />;
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            case 'success':
                return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case 'error':
                return <AlertTriangle className="h-5 w-5 text-red-500" />;
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Agora';
        if (diffMins < 60) return `${diffMins} min atrás`;
        if (diffHours < 24) return `${diffHours}h atrás`;
        if (diffDays < 7) return `${diffDays}d atrás`;
        return date.toLocaleDateString('pt-BR');
    };

    const handleResolve = (notificationId: string) => {
        setNotifications(prev =>
            prev.map(n =>
                n.id === notificationId
                    ? { ...n, resolvedAt: n.resolvedAt ? undefined : new Date().toISOString() }
                    : n
            )
        );

        const notification = notifications.find(n => n.id === notificationId);
        toast({
            title: notification?.resolvedAt ? 'Notificação reaberta' : 'Notificação resolvida',
            description: notification?.resolvedAt
                ? 'A notificação foi marcada como pendente novamente.'
                : 'A notificação foi marcada como resolvida.',
        });
    };

    const handleViewDetails = (notification: Notification) => {
        if (notification.actionUrl) {
            navigate(notification.actionUrl);
        }
    };

    const filteredNotifications = notifications.filter(n => {
        const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.message.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTab =
            activeTab === 'all' ||
            (activeTab === 'pending' && !n.resolvedAt) ||
            (activeTab === 'resolved' && n.resolvedAt);

        return matchesSearch && matchesTab;
    });

    const pendingCount = notifications.filter(n => !n.resolvedAt).length;
    const resolvedCount = notifications.filter(n => n.resolvedAt).length;

    return (
        <div className="space-y-6 p-4 sm:p-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
                    <Bell className="h-7 w-7" />
                    Notificações
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                    Central de notificações e alertas do sistema
                </p>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar notificações..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications List */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">
                        Todas ({notifications.length})
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                        Pendentes ({pendingCount})
                    </TabsTrigger>
                    <TabsTrigger value="resolved">
                        Resolvidas ({resolvedCount})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6 space-y-4">
                    {filteredNotifications.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                                <p className="text-muted-foreground">
                                    {searchQuery ? 'Nenhuma notificação encontrada' : 'Nenhuma notificação'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredNotifications.map((notification) => (
                            <Card
                                key={notification.id}
                                className={cn(
                                    'transition-all hover:shadow-md',
                                    !notification.isRead && 'border-l-4 border-l-primary',
                                    notification.resolvedAt && 'opacity-75'
                                )}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <CardTitle className="text-base">{notification.title}</CardTitle>
                                                    {!notification.isRead && (
                                                        <Badge variant="secondary" className="text-xs">Novo</Badge>
                                                    )}
                                                    {notification.resolvedAt && (
                                                        <Badge variant="outline" className="text-xs text-green-600">
                                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                                            Resolvido
                                                        </Badge>
                                                    )}
                                                </div>
                                                <CardDescription className="text-sm">
                                                    {notification.message}
                                                </CardDescription>
                                                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    {formatTimestamp(notification.timestamp)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {notification.actionUrl && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewDetails(notification)}
                                            >
                                                Ver detalhes
                                            </Button>
                                        )}
                                        <Button
                                            variant={notification.resolvedAt ? 'outline' : 'default'}
                                            size="sm"
                                            onClick={() => handleResolve(notification.id)}
                                        >
                                            {notification.resolvedAt ? 'Reabrir' : 'Resolver'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
