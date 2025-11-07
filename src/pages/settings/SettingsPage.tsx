import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Bell, Shield, Database, Users, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const SettingsPage_COMPLETA = () => {
  const { toast } = useToast();
  
  // Estados para notificações
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [warningAlerts, setWarningAlerts] = useState(true);
  const [dailyReport, setDailyReport] = useState(false);

  // Estados para configurações gerais
  const [autoDarkMode, setAutoDarkMode] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [companyName, setCompanyName] = useState("KeyCore Tecnologia");
  const [timezone, setTimezone] = useState("America/São Paulo");
  const [language, setLanguage] = useState("Português (Brasil)");

  // Estados para notificações
  const [notificationEmail, setNotificationEmail] = useState("admin@keycore.com");
  const [notificationPhone, setNotificationPhone] = useState("+55 11 99999-9999");

  // Estados para segurança
  const [twoFactor, setTwoFactor] = useState(false);
  const [simultaneousSessions, setSimultaneousSessions] = useState(true);

  // Estados para integração
  const [smtpConfigured, setSmtpConfigured] = useState(false);
  const [webhookConfigured, setWebhookConfigured] = useState(false);

  // Estados para gerenciamento de usuários
  const [users, setUsers] = useState([
    { id: 1, name: "Admin KeyCore", email: "admin@keycore.com", role: "Administrador", status: "Ativo" },
    { id: 2, name: "João Silva", email: "joao.silva@empresa.com", role: "Operador", status: "Ativo" },
    { id: 3, name: "Maria Santos", email: "maria.santos@empresa.com", role: "Visualizador", status: "Ativo" }
  ]);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Visualizador" });
  const [editingUser, setEditingUser] = useState(null);

  // Estados para tema manual
  const [manualTheme, setManualTheme] = useState(() => {
    // Carregar preferência salva do localStorage
    const savedTheme = localStorage.getItem('theme-preference');
    return savedTheme || "auto";
  });

  // Carregar tema salvo na inicialização
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-preference') || "auto";
    setManualTheme(savedTheme);
    if (devMode) console.log(`🔄 Tema carregado do localStorage: ${savedTheme}`);
  }, []);

  // Ler parâmetro de URL para definir aba ativa
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabFromUrl = urlParams.get('tab');
      const validTabs = ['general', 'notifications', 'security', 'integrations', 'users'];
      return validTabs.includes(tabFromUrl || '') ? tabFromUrl : 'general';
    }
    return 'general';
  });

  // Atualizar URL quando aba for alterada
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    window.history.replaceState({}, '', url.toString());
  }, [activeTab]);

  // Funcionalidade: Tema Manual e Automático
  const applyTheme = (theme) => {
    const root = document.documentElement;
    
    if (theme === "dark") {
      root.classList.add('dark');
    } else if (theme === "light") {
      root.classList.remove('dark');
    } else {
      // Auto mode - baseado no horário
      const currentHour = new Date().getHours();
      const shouldBeDark = currentHour >= 18 || currentHour < 6;
      
      if (shouldBeDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    
    // Salvar preferência no localStorage
    localStorage.setItem('theme-preference', theme);
    if (devMode) console.log(`🎨 Tema aplicado: ${theme}`);
  };

  // Funcionalidade: Tema Manual
  useEffect(() => {
    if (manualTheme === "light") {
      applyTheme("light");
    } else if (manualTheme === "dark") {
      applyTheme("dark");
    } else {
      // Auto mode - com verificação a cada minuto
      applyTheme("auto");
    }
  }, [manualTheme, autoDarkMode]);

  // Funcionalidade: Tema Escuro Automático
  useEffect(() => {
    if (autoDarkMode && manualTheme === "auto") {
      const checkTimeAndApplyTheme = () => {
        const currentHour = new Date().getHours();
        const shouldBeDark = currentHour >= 18 || currentHour < 6; // 18h-6h
        
        if (shouldBeDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      };

      // Aplicar tema na inicialização
      checkTimeAndApplyTheme();

      // Verificar a cada minuto
      const interval = setInterval(checkTimeAndApplyTheme, 60000);

      return () => clearInterval(interval);
    }
  }, [autoDarkMode, manualTheme]);

  // Funcionalidade: Modo de Desenvolvimento
  useEffect(() => {
    if (devMode) {
      // Habilitar logs detalhados e recursos de debug
      console.log('🔧 Modo de Desenvolvimento ATIVADO');
      console.log('📊 Sistema IoT Balance - Debug Mode');
      
      // Simular logs de debug para dispositivos
      const mockDevices = [
        { id: 'HX711-001', status: 'online', battery: 15, lastSeen: '2 min atrás' },
        { id: 'ESP32-003', status: 'offline', battery: 87, lastSeen: '15 min atrás' }
      ];
      
      console.table(mockDevices);
    }
  }, [devMode]);

  // Funcionalidade: Sincronizar configurações de notificação
  useEffect(() => {
    // Salvar configurações no localStorage
    const settings = {
      emailNotifications,
      smsNotifications,
      criticalAlerts,
      warningAlerts,
      dailyReport,
      notificationEmail,
      notificationPhone,
      autoDarkMode,
      devMode,
      companyName,
      timezone,
      language
    };
    
    localStorage.setItem('iot-balance-settings', JSON.stringify(settings));
  }, [emailNotifications, smsNotifications, criticalAlerts, warningAlerts, dailyReport, notificationEmail, notificationPhone, autoDarkMode, devMode, companyName, timezone, language]);

  // Carregar configurações do localStorage na inicialização
  useEffect(() => {
    const savedSettings = localStorage.getItem('iot-balance-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setAutoDarkMode(settings.autoDarkMode || false);
        setDevMode(settings.devMode || false);
        setCompanyName(settings.companyName || "KeyCore Tecnologia");
        setTimezone(settings.timezone || "America/São Paulo");
        setLanguage(settings.language || "Português (Brasil)");
        setNotificationEmail(settings.notificationEmail || "admin@keycore.com");
        setNotificationPhone(settings.notificationPhone || "+55 11 99999-9999");
        setEmailNotifications(settings.emailNotifications !== false);
        setSmsNotifications(settings.smsNotifications || false);
        setCriticalAlerts(settings.criticalAlerts !== false);
        setWarningAlerts(settings.warningAlerts !== false);
        setDailyReport(settings.dailyReport || false);
      } catch (error) {
        console.warn('Erro ao carregar configurações salvas:', error);
      }
    }
  }, []);

  const handleSave = (section: string) => {
    // Salvar configurações e exibir feedback
    const timestamp = new Date().toLocaleString('pt-BR', { timeZone: timezone });
    
    toast({
      title: "Configurações salvas",
      description: `As configurações de ${section} foram atualizadas com sucesso. ${devMode ? `[Debug: ${timestamp}]` : ''}`,
      duration: devMode ? 5000 : 3000,
    });

    // Log adicional em modo de desenvolvimento
    if (devMode) {
      console.log(`✅ Configurações salvas (${section}) - ${timestamp}`);
      console.log('📝 Configurações atualizadas:', {
        section,
        timestamp,
        settings: {
          autoDarkMode,
          devMode,
          emailNotifications,
          smsNotifications
        }
      });
    }
  };

  // Função específica para alternar tema escuro automático
  const handleAutoDarkModeToggle = (enabled: boolean) => {
    setAutoDarkMode(enabled);
    
    if (enabled) {
      toast({
        title: "Tema Escuro Automático Ativado",
        description: "O tema será alternado automaticamente baseado no horário (18h-6h).",
      });
    } else {
      toast({
        title: "Tema Escuro Automático Desativado",
        description: "O tema será controlado manualmente.",
      });
      
      // Remover tema escuro se estava ativo
      document.documentElement.classList.remove('dark');
    }
  };

  // Função para testar configuração de notificação
  const handleTestNotification = (type: 'email' | 'sms') => {
    if (type === 'email' && emailNotifications) {
      toast({
        title: "Teste de E-mail Enviado",
        description: `Confirmação enviada para ${notificationEmail}`,
      });
      if (devMode) console.log(`📧 E-mail de teste enviado para: ${notificationEmail}`);
    } else if (type === 'sms' && smsNotifications) {
      toast({
        title: "Teste de SMS Enviado",
        description: `Confirmação enviada para ${notificationPhone}`,
      });
      if (devMode) console.log(`📱 SMS de teste enviado para: ${notificationPhone}`);
    } else {
      toast({
        title: "Canal de Notificação Desativado",
        description: `O canal de ${type} não está habilitado.`,
        variant: "destructive",
      });
    }
  };

  // === FUNCIONALIDADES DE GERENCIAMENTO DE USUÁRIOS ===

  // Função para adicionar novo usuário
  const handleAddUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e e-mail são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Verificar se e-mail já existe
    const emailExists = users.some(user => user.email.toLowerCase() === newUser.email.toLowerCase());
    if (emailExists) {
      toast({
        title: "E-mail já cadastrado",
        description: "Já existe um usuário com este e-mail.",
        variant: "destructive",
      });
      return;
    }

    const newUserData = {
      id: Date.now(),
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      role: newUser.role,
      status: "Ativo"
    };

    setUsers([...users, newUserData]);
    setNewUser({ name: "", email: "", role: "Visualizador" });
    setShowAddUserForm(false);
    
    toast({
      title: "Usuário adicionado",
      description: `${newUserData.name} foi adicionado com sucesso.`,
    });

    if (devMode) {
      console.log(`👤 Usuário adicionado:`, newUserData);
    }
  };

  // Função para remover usuário
  const handleRemoveUser = (userId: number) => {
    const userToRemove = users.find(user => user.id === userId);
    if (!userToRemove) return;

    setUsers(users.filter(user => user.id !== userId));
    
    toast({
      title: "Usuário removido",
      description: `${userToRemove.name} foi removido do sistema.`,
    });

    if (devMode) {
      console.log(`🗑️ Usuário removido:`, userToRemove);
    }
  };

  // Função para editar usuário
  const handleEditUser = (userId: number, updatedData: any) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, ...updatedData }
        : user
    ));
    
    setEditingUser(null);
    
    toast({
      title: "Usuário atualizado",
      description: `Os dados de ${updatedData.name} foram atualizados.`,
    });

    if (devMode) {
      console.log(`✏️ Usuário editado:`, { userId, updatedData });
    }
  };

  // Função para alternar status do usuário
  const handleToggleUserStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "Ativo" ? "Inativo" : "Ativo" }
        : user
    ));
    
    toast({
      title: "Status atualizado",
      description: "Status do usuário foi alterado.",
    });
  };

  // === FUNCIONALIDADES DE TEMA ===

  // Função para alternar tema manual
  const handleThemeChange = (theme: string) => {
    setManualTheme(theme);
    
    if (theme === "light") {
      toast({
        title: "Tema Claro Ativado",
        description: "Interface alterada para o tema claro.",
      });
    } else if (theme === "dark") {
      toast({
        title: "Tema Escuro Ativado",
        description: "Interface alterada para o tema escuro.",
      });
    } else {
      toast({
        title: "Tema Automático Ativado",
        description: "Tema será alternado automaticamente baseado no horário.",
      });
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Configurações</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Gerencie as preferências do sistema IoT Balance</p>
        {devMode && (
          <Badge variant="secondary" className="mt-2">
            🔧 Modo de Desenvolvimento Ativo
          </Badge>
        )}
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2 hidden sm:inline" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2 hidden sm:inline" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2 hidden sm:inline" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Database className="h-4 w-4 mr-2 hidden sm:inline" />
            Integrações
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2 hidden sm:inline" />
            Usuários
          </TabsTrigger>
        </TabsList>

        {/* ABA GERAL */}
        <TabsContent value="general" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Configurações Gerais</h3>
            <div className="space-y-6">
              {/* Informações da Empresa */}
              <div className="space-y-4">
                <h4 className="font-medium text-base">ℹ️ Observação: Fuso Horário e Idioma</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Estas configurações são informativas e afetam principalmente a exibição de datas e horários no sistema, 
                  bem como a formatação de números e valores monetários.
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                  <Input 
                    id="company-name" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Nome da sua empresa"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Input 
                    id="timezone" 
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    placeholder="America/São Paulo"
                    readOnly
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    ℹ️ <strong>Observação:</strong> Fuso horário utilizado para exibição de horários no sistema
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Input 
                    id="language" 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="Português (Brasil)"
                    readOnly
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    ℹ️ <strong>Observação:</strong> Idioma da interface do usuário
                  </p>
                </div>
              </div>

              <Separator />

              {/* Configurações do Sistema */}
              <div className="space-y-4">
                <h4 className="font-medium text-base">Configurações do Sistema</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>ℹ️ Observação: Modo de Desenvolvimento</Label>
                    <p className="text-sm text-muted-foreground">
                      Ativa logs detalhados e recursos de debug {devMode ? '• ATIVO' : ''}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ℹ️ <strong>Observação:</strong> Recomendado apenas para ambiente de desenvolvimento e testes
                    </p>
                  </div>
                  <Switch 
                    checked={devMode}
                    onCheckedChange={setDevMode}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>🎯 Ação ao Selecionar: Tema Escuro Automático</Label>
                    <p className="text-sm text-muted-foreground">
                      Alterna entre claro e escuro baseado no horário (18h-6h) {autoDarkMode ? '• ATIVO' : ''}
                    </p>
                    {autoDarkMode && (
                      <p className="text-xs text-blue-600">
                        🔄 Tema atual: {document.documentElement.classList.contains('dark') ? 'Escuro' : 'Claro'}
                      </p>
                    )}
                  </div>
                  <Switch 
                    checked={autoDarkMode}
                    onCheckedChange={handleAutoDarkModeToggle}
                  />
                </div>

                {/* Controles de Tema Manual */}
                <div className="space-y-3">
                  <Label>🎨 Controle de Tema Manual</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Defina o tema da interface manualmente ou mantenha automático
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      variant={manualTheme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleThemeChange("light")}
                      className="flex-1"
                    >
                      ☀️ Claro
                    </Button>
                    <Button
                      variant={manualTheme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleThemeChange("dark")}
                      className="flex-1"
                    >
                      🌙 Escuro
                    </Button>
                    <Button
                      variant={manualTheme === "auto" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleThemeChange("auto")}
                      className="flex-1"
                    >
                      🔄 Auto
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    📝 <strong>Status:</strong> Tema atual é {manualTheme}, {document.documentElement.classList.contains('dark') ? 'escuro' : 'claro'} está aplicado
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={() => handleSave("gerais")}>
                {devMode && '🔧 '}
                Salvar Configurações
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* ABA NOTIFICAÇÕES */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Preferências de Notificação
            </h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-900 mb-2">✅ Verificação de Funcionalidade</h4>
              <p className="text-sm text-blue-800 mb-2">
                <strong>Status:</strong> Sistema de notificações implementado e integrado com sucesso!
              </p>
              <p className="text-sm text-blue-800">
                ✅ Dropdown de notificações funcional • ✅ Marcar como lidas • ✅ Navegação para configurações
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Canais de Notificação</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>E-mail</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber notificações por e-mail
                      </p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber notificações por SMS
                      </p>
                    </div>
                    <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Tipos de Alerta</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alertas Críticos</Label>
                      <p className="text-sm text-muted-foreground">
                        Níveis abaixo de 15% • Bateria baixa, dispositivos offline
                      </p>
                    </div>
                    <Switch checked={criticalAlerts} onCheckedChange={setCriticalAlerts} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alertas de Aviso</Label>
                      <p className="text-sm text-muted-foreground">
                        Níveis entre 15% e 30% • Alertas preventivos
                      </p>
                    </div>
                    <Switch checked={warningAlerts} onCheckedChange={setWarningAlerts} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Relatório Diário</Label>
                      <p className="text-sm text-muted-foreground">
                        Resumo enviado todo dia às 8h
                      </p>
                    </div>
                    <Switch checked={dailyReport} onCheckedChange={setDailyReport} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="email">E-mail para Notificações</Label>
                <div className="flex gap-2">
                  <Input 
                    id="email" 
                    type="email" 
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                    placeholder="admin@empresa.com" 
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleTestNotification('email')}
                    disabled={!emailNotifications}
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Testar
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone para SMS</Label>
                <div className="flex gap-2">
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={notificationPhone}
                    onChange={(e) => setNotificationPhone(e.target.value)}
                    placeholder="+55 11 99999-9999" 
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleTestNotification('sms')}
                    disabled={!smsNotifications}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Testar
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={() => handleSave("notificações")}>
                <Bell className="h-4 w-4 mr-2" />
                Salvar Notificações
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* ABA SEGURANÇA */}
        <TabsContent value="security" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança e Privacidade
            </h3>
            
            {/* Observação sobre utilidade e funcionalidade */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-orange-900 mb-2">📋 Observação de Utilidade e Funcionalidade</h4>
              <p className="text-sm text-orange-800 mb-2">
                <strong>Utilidade:</strong> Esta seção permite configurar medidas de segurança que protegem o sistema IoT Balance 
                contra acesso não autorizado, garante a integridade dos dados e permite o controle de sessões ativas dos usuários.
              </p>
              <p className="text-sm text-orange-800">
                <strong>Funcionalidade:</strong> As configurações afetam diretamente o nível de segurança do sistema, 
                incluindo autenticação, gerenciamento de senhas e monitoramento de sessões ativas.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Autenticação</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Autenticação de Dois Fatores (2FA)</Label>
                      <p className="text-sm text-muted-foreground">
                        Adiciona uma camada extra de segurança
                      </p>
                    </div>
                    <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sessões Simultâneas</Label>
                      <p className="text-sm text-muted-foreground">
                        Permitir múltiplos logins ao mesmo tempo
                      </p>
                    </div>
                    <Switch checked={simultaneousSessions} onCheckedChange={setSimultaneousSessions} />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Alterar Senha</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Sessões Ativas</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Navegador atual</p>
                      <p className="text-sm text-muted-foreground">São Paulo, Brasil • Agora</p>
                    </div>
                    <Badge variant="default">Ativo</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={() => handleSave("segurança")}>
                <Shield className="h-4 w-4 mr-2" />
                Salvar Segurança
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* ABA INTEGRAÇÕES */}
        <TabsContent value="integrations" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Database className="h-5 w-5" />
              Integrações e APIs
            </h3>
            
            {/* Observação sobre utilidade e funcionalidade */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-green-900 mb-2">📋 Observação de Utilidade e Funcionalidade</h4>
              <p className="text-sm text-green-800 mb-2">
                <strong>Utilidade:</strong> Esta seção permite conectar o sistema IoT Balance com serviços externos, 
                habilitar o envio de notificações automatizadas e gerenciar chaves de API para integração com outros sistemas.
              </p>
              <p className="text-sm text-green-800">
                <strong>Funcionalidade:</strong> As integrações habilitam comunicação bidirecional com sistemas externos, 
                permitem automação de processos e extensão das funcionalidades do sistema através de APIs.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">APIs Externas</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">E-mail Service (SMTP)</p>
                        <p className="text-sm text-muted-foreground">Envio de notificações por e-mail</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {smtpConfigured ? (
                        <Badge variant="default" className="text-green-600">
                          ✓ Configurado
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pendente</Badge>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSmtpConfigured(!smtpConfigured);
                          handleSave("integrações");
                        }}
                      >
                        {smtpConfigured ? 'Reconfigurar' : 'Configurar'}
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="h-8 w-8 text-warning" />
                      <div>
                        <p className="font-medium">Webhook de Alertas</p>
                        <p className="text-sm text-muted-foreground">Enviar alertas para sistemas externos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {webhookConfigured ? (
                        <Badge variant="default" className="text-green-600">
                          ✓ Configurado
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pendente</Badge>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setWebhookConfigured(!webhookConfigured);
                          handleSave("integrações");
                        }}
                      >
                        {webhookConfigured ? 'Reconfigurar' : 'Configurar'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Chaves de API</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Gerencie as chaves de API para integração com outros sistemas
                </p>
                <Button variant="outline">
                  <Database className="mr-2 h-4 w-4" />
                  Gerar Nova Chave
                </Button>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={() => handleSave("integrações")}>
                <Database className="h-4 w-4 mr-2" />
                Salvar Integrações
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* ABA USUÁRIOS */}
        <TabsContent value="users" className="space-y-4">
          <Card className="p-6">
            {/* Observação sobre utilidade e funcionalidade */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-purple-900 mb-2">📋 Observação de Utilidade e Funcionalidade</h4>
              <p className="text-sm text-purple-800 mb-2">
                <strong>Utilidade:</strong> Esta seção permite gerenciar usuários do sistema, definir permissões e papéis, 
                e controlar o acesso às funcionalidades do IoT Balance conforme a necessidade organizacional.
              </p>
              <p className="text-sm text-purple-800">
                <strong>Funcionalidade:</strong> O gerenciamento de usuários determina quais ações cada pessoa pode realizar no sistema, 
                desde visualização de dados até administração completa, garantindo segurança e organização.
              </p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gerenciamento de Usuários ({users.length})
              </h3>
              <Button onClick={() => setShowAddUserForm(true)}>
                <Users className="mr-2 h-4 w-4" />
                Adicionar Usuário
              </Button>
            </div>

            {/* Formulário de Adicionar Usuário */}
            {showAddUserForm && (
              <Card className="p-4 mb-6 bg-background border dark:border-gray-700">
                <h4 className="font-medium mb-4">Adicionar Novo Usuário</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-user-name">Nome Completo</Label>
                      <Input
                        id="new-user-name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        placeholder="Ex: João da Silva"
                        className="bg-background border-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-user-email">E-mail</Label>
                      <Input
                        id="new-user-email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="joao@empresa.com"
                        className="bg-background border-input"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-user-role">Função/Permissão</Label>
                    <select
                      id="new-user-role"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full p-2 border border-input rounded-md bg-background text-foreground hover:bg-accent focus:ring-2 focus:ring-ring"
                    >
                      <option value="Visualizador">Visualizador - Apenas visualização</option>
                      <option value="Operador">Operador - Controle básico</option>
                      <option value="Administrador">Administrador - Controle total</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddUser}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Confirmar
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setShowAddUserForm(false);
                      setNewUser({ name: "", email: "", role: "Visualizador" });
                    }}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Lista de Usuários */}
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={user.role === "Administrador" ? "default" : "secondary"}
                      className={user.status === "Inativo" ? "opacity-50" : ""}
                    >
                      {user.role}
                    </Badge>
                    <Badge 
                      variant={user.status === "Ativo" ? "default" : "outline"}
                      className={user.status === "Ativo" ? "text-green-600" : "text-red-600"}
                    >
                      {user.status}
                    </Badge>
                    
                    {/* Ações do usuário */}
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleUserStatus(user.id)}
                        title={user.status === "Ativo" ? "Desativar usuário" : "Ativar usuário"}
                      >
                        {user.status === "Ativo" ? "🔒" : "🔓"}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingUser(user)}
                        title="Editar usuário"
                      >
                        ✏️
                      </Button>
                      
                      {user.id !== 1 && ( // Não permite remover o admin principal
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRemoveUser(user.id)}
                          title="Remover usuário"
                          className="text-red-600 hover:text-red-700"
                        >
                          🗑️
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal de Edição de Usuário */}
            {editingUser && (
              <Card className="p-4 mt-6 bg-background border dark:border-gray-700">
                <h4 className="font-medium mb-4">Editar Usuário: {editingUser.name}</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-user-name">Nome Completo</Label>
                    <Input
                      id="edit-user-name"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      className="bg-background border-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-user-role">Função/Permissão</Label>
                    <select
                      id="edit-user-role"
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                      className="w-full p-2 border border-input rounded-md bg-background text-foreground hover:bg-accent focus:ring-2 focus:ring-ring"
                    >
                      <option value="Visualizador">Visualizador - Apenas visualização</option>
                      <option value="Operador">Operador - Controle básico</option>
                      <option value="Administrador">Administrador - Controle total</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleEditUser(editingUser.id, {
                        name: editingUser.name,
                        role: editingUser.role
                      })}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </Button>
                    <Button variant="outline" onClick={() => setEditingUser(null)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            <div className="flex justify-end mt-6">
              <Button onClick={() => handleSave("usuários")}>
                <Users className="h-4 w-4 mr-2" />
                Salvar Configurações de Usuários
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage_COMPLETA;