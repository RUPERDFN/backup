import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Bell, 
  Clock, 
  ShoppingCart, 
  ChefHat, 
  AlertTriangle, 
  Calendar,
  Smartphone,
  Mail,
  MessageSquare
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'cooking' | 'shopping' | 'expiry' | 'meal_time' | 'recipe_suggestion';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledTime: string;
  isActive: boolean;
  frequency: 'once' | 'daily' | 'weekly' | 'custom';
}

interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  categories: {
    cooking: boolean;
    shopping: boolean;
    expiry: boolean;
    mealTime: boolean;
    suggestions: boolean;
  };
}

export default function SmartNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'not-001',
      type: 'meal_time',
      title: 'Hora de comer',
      message: 'Es hora de preparar tu almuerzo. ¿Paella valenciana hoy?',
      priority: 'medium',
      scheduledTime: '13:30',
      isActive: true,
      frequency: 'daily'
    },
    {
      id: 'not-002',
      type: 'shopping',
      title: 'Lista de compra',
      message: 'Tienes 8 ingredientes pendientes para esta semana',
      priority: 'low',
      scheduledTime: '10:00',
      isActive: true,
      frequency: 'weekly'
    },
    {
      id: 'not-003',
      type: 'expiry',
      title: 'Ingredientes caducan',
      message: 'Los tomates caducan mañana. ¿Hacemos gazpacho?',
      priority: 'high',
      scheduledTime: '09:00',
      isActive: true,
      frequency: 'custom'
    },
    {
      id: 'not-004',
      type: 'cooking',
      title: 'Tiempo de cocción',
      message: 'La paella lleva 15 minutos. ¡5 minutos más!',
      priority: 'urgent',
      scheduledTime: '14:20',
      isActive: false,
      frequency: 'once'
    },
    {
      id: 'not-005',
      type: 'recipe_suggestion',
      title: 'Nueva receta',
      message: 'Basado en tus gustos: ¿Qué tal una crema de calabaza?',
      priority: 'low',
      scheduledTime: '18:00',
      isActive: true,
      frequency: 'daily'
    }
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    pushEnabled: true,
    emailEnabled: false,
    smsEnabled: false,
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    },
    categories: {
      cooking: true,
      shopping: true,
      expiry: true,
      mealTime: true,
      suggestions: false
    }
  });

  const [permissionStatus, setPermissionStatus] = useState<'default' | 'granted' | 'denied'>('default');

  useEffect(() => {
    // Check notification permission status
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
    }
  };

  const toggleNotification = (id: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === id 
        ? { ...notification, isActive: !notification.isActive }
        : notification
    ));
  };

  const updateSettings = (key: keyof NotificationSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateCategorySetting = (category: keyof NotificationSettings['categories'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: value
      }
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cooking': return <ChefHat className="w-4 h-4" />;
      case 'shopping': return <ShoppingCart className="w-4 h-4" />;
      case 'expiry': return <AlertTriangle className="w-4 h-4" />;
      case 'meal_time': return <Clock className="w-4 h-4" />;
      case 'recipe_suggestion': return <Bell className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cooking': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'shopping': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'expiry': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'meal_time': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'recipe_suggestion': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const sendTestNotification = () => {
    if (permissionStatus === 'granted') {
      new Notification('SkinChef - Prueba', {
        body: 'Las notificaciones están funcionando correctamente',
        icon: '/favicon.ico'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-green via-black to-dark-green p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bell className="w-10 h-10 text-chalk-green" />
            <h1 className="text-4xl font-bold text-chalk-white">Notificaciones Inteligentes</h1>
          </div>
          <p className="text-chalk/70 text-lg">
            Configura recordatorios personalizados para cocinar sin estrés
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Settings */}
          <div className="space-y-6">
            {/* Permission */}
            <Card className="glass-container border-chalk-green/30">
              <CardHeader>
                <CardTitle className="text-chalk-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Permisos de Notificación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-chalk-white">Estado del navegador</div>
                      <div className="text-sm text-chalk/60">
                        {permissionStatus === 'granted' && 'Notificaciones permitidas'}
                        {permissionStatus === 'denied' && 'Notificaciones bloqueadas'}
                        {permissionStatus === 'default' && 'Sin configurar'}
                      </div>
                    </div>
                    <Badge className={`${
                      permissionStatus === 'granted' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      permissionStatus === 'denied' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    } border`}>
                      {permissionStatus === 'granted' ? 'Activo' : 
                       permissionStatus === 'denied' ? 'Bloqueado' : 'Pendiente'}
                    </Badge>
                  </div>

                  {permissionStatus !== 'granted' && (
                    <Button
                      onClick={requestNotificationPermission}
                      className="w-full bg-chalk-green text-dark-green hover:bg-chalk-green/80"
                    >
                      Activar Notificaciones
                    </Button>
                  )}

                  {permissionStatus === 'granted' && (
                    <Button
                      onClick={sendTestNotification}
                      variant="outline"
                      className="w-full text-chalk border-chalk-green/30 hover:bg-chalk-green/20"
                    >
                      Enviar Prueba
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Channel Settings */}
            <Card className="glass-container border-chalk-green/30">
              <CardHeader>
                <CardTitle className="text-chalk-white">Canales de Notificación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-chalk-green" />
                    <Label className="text-chalk">Notificaciones push</Label>
                  </div>
                  <Switch
                    checked={settings.pushEnabled}
                    onCheckedChange={(checked) => updateSettings('pushEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-chalk-green" />
                    <Label className="text-chalk">Email</Label>
                  </div>
                  <Switch
                    checked={settings.emailEnabled}
                    onCheckedChange={(checked) => updateSettings('emailEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-chalk-green" />
                    <Label className="text-chalk">SMS</Label>
                  </div>
                  <Switch
                    checked={settings.smsEnabled}
                    onCheckedChange={(checked) => updateSettings('smsEnabled', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Category Settings */}
            <Card className="glass-container border-chalk-green/30">
              <CardHeader>
                <CardTitle className="text-chalk-white">Tipos de Notificación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-chalk-green" />
                    <Label className="text-chalk">Cocción y temporizadores</Label>
                  </div>
                  <Switch
                    checked={settings.categories.cooking}
                    onCheckedChange={(checked) => updateCategorySetting('cooking', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-chalk-green" />
                    <Label className="text-chalk">Lista de compra</Label>
                  </div>
                  <Switch
                    checked={settings.categories.shopping}
                    onCheckedChange={(checked) => updateCategorySetting('shopping', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-chalk-green" />
                    <Label className="text-chalk">Ingredientes caducando</Label>
                  </div>
                  <Switch
                    checked={settings.categories.expiry}
                    onCheckedChange={(checked) => updateCategorySetting('expiry', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-chalk-green" />
                    <Label className="text-chalk">Horarios de comida</Label>
                  </div>
                  <Switch
                    checked={settings.categories.mealTime}
                    onCheckedChange={(checked) => updateCategorySetting('mealTime', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-chalk-green" />
                    <Label className="text-chalk">Sugerencias de recetas</Label>
                  </div>
                  <Switch
                    checked={settings.categories.suggestions}
                    onCheckedChange={(checked) => updateCategorySetting('suggestions', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Notifications */}
          <div>
            <Card className="glass-container border-chalk-green/30">
              <CardHeader>
                <CardTitle className="text-chalk-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Notificaciones Programadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 bg-black/20 rounded-lg border border-chalk-green/20"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(notification.type)}
                          <h3 className="font-semibold text-chalk-white">{notification.title}</h3>
                        </div>
                        <Switch
                          checked={notification.isActive}
                          onCheckedChange={() => toggleNotification(notification.id)}
                        />
                      </div>

                      <p className="text-sm text-chalk/70 mb-3">{notification.message}</p>

                      <div className="flex items-center gap-2">
                        <Badge className={`${getTypeColor(notification.type)} border text-xs`}>
                          {notification.type}
                        </Badge>
                        <Badge className={`${getPriorityColor(notification.priority)} border text-xs`}>
                          {notification.priority}
                        </Badge>
                        <div className="text-xs text-chalk/60 ml-auto">
                          {notification.scheduledTime} • {notification.frequency}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full mt-4 bg-chalk-green text-dark-green hover:bg-chalk-green/80">
                  + Crear Nueva Notificación
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}