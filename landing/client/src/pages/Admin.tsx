import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Users, DollarSign, BarChart3, AlertTriangle, Shield, Activity } from 'lucide-react';

export default function Admin() {
  const { data: dashboard, isLoading: dashboardLoading } = useQuery({
    queryKey: ['/api/admin/dashboard'],
    retry: false
  });

  const { data: revenue, isLoading: revenueLoading } = useQuery({
    queryKey: ['/api/admin/revenue'],
    retry: false
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    retry: false
  });

  const { data: systemHealth, isLoading: systemLoading } = useQuery({
    queryKey: ['/api/admin/system'],
    retry: false
  });

  if (dashboardLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-green via-black to-dark-green text-chalk-white">
        <div className="container mx-auto p-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-chalk-green border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Cargando panel de administración...</p>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => `€${amount.toFixed(2)}`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-green via-black to-dark-green text-chalk-white">
      <div className="container mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-chalk-green mb-2 font-handwritten">
            Panel de Administración
          </h1>
          <p className="text-chalk/70">Dashboard ejecutivo - TheCookFlow</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-dark-green/30 border border-chalk-green/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-chalk-green data-[state=active]:text-dark-green">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="revenue" className="data-[state=active]:bg-chalk-green data-[state=active]:text-dark-green">
              <DollarSign className="w-4 h-4 mr-2" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-chalk-green data-[state=active]:text-dark-green">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-chalk-green data-[state=active]:text-dark-green">
              <Activity className="w-4 h-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPIs Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-dark-green/20 border-chalk-green/30">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm text-chalk/70">LTV</CardTitle>
                    {(dashboard as any)?.kpis?.ltv?.change > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chalk-green">
                    {formatCurrency((dashboard as any)?.kpis?.ltv?.current || 0)}
                  </div>
                  <p className="text-xs text-chalk/60">
                    {dashboard?.kpis?.ltv?.change > 0 ? '+' : ''}
                    {formatPercentage(dashboard?.kpis?.ltv?.change || 0)} vs último mes
                  </p>
                  <div className="mt-2">
                    <Progress 
                      value={(dashboard?.kpis?.ltv?.current / dashboard?.kpis?.ltv?.target) * 100} 
                      className="h-1"
                    />
                    <p className="text-xs text-chalk/50 mt-1">
                      Objetivo: {formatCurrency(dashboard?.kpis?.ltv?.target || 0)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-dark-green/20 border-chalk-green/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-chalk/70">ARPU</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chalk-green">
                    {formatCurrency(dashboard?.kpis?.arpu?.current || 0)}
                  </div>
                  <p className="text-xs text-chalk/60">
                    +{formatPercentage(dashboard?.kpis?.arpu?.change || 0)} vs último mes
                  </p>
                  <div className="mt-2">
                    <Progress 
                      value={(dashboard?.kpis?.arpu?.current / dashboard?.kpis?.arpu?.target) * 100} 
                      className="h-1"
                    />
                    <p className="text-xs text-chalk/50 mt-1">
                      Objetivo: {formatCurrency(dashboard?.kpis?.arpu?.target || 0)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-dark-green/20 border-chalk-green/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-chalk/70">Trial → Paid</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chalk-green">
                    {formatPercentage(dashboard?.kpis?.conversionRates?.trialToPaid || 0)}
                  </div>
                  <p className="text-xs text-chalk/60">Conversión trial</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-chalk/60">Onboarding:</span>
                      <span>{formatPercentage(dashboard?.kpis?.conversionRates?.onboardingCompletion || 0)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-chalk/60">Paywall:</span>
                      <span>{formatPercentage(dashboard?.kpis?.conversionRates?.paywallConversion || 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-dark-green/20 border-chalk-green/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-chalk/70">Churn Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chalk-green">
                    {formatPercentage(dashboard?.kpis?.churn?.monthly || 0)}
                  </div>
                  <p className="text-xs text-chalk/60">Mensual</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-chalk/60">Día 7:</span>
                      <span>{formatPercentage(dashboard?.kpis?.churn?.day7 || 0)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-chalk/60">Día 30:</span>
                      <span>{formatPercentage(dashboard?.kpis?.churn?.day30 || 0)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-chalk/60">Día 90:</span>
                      <span>{formatPercentage(dashboard?.kpis?.churn?.day90 || 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue & Users Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-dark-green/20 border-chalk-green/30">
                <CardHeader>
                  <CardTitle className="text-chalk-green">Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-chalk/60">Hoy</p>
                      <p className="text-xl font-bold">{formatCurrency(dashboard?.revenue?.today || 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-chalk/60">Este Mes</p>
                      <p className="text-xl font-bold">{formatCurrency(dashboard?.revenue?.thisMonth || 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-chalk/60">MRR</p>
                      <p className="text-xl font-bold text-chalk-green">{formatCurrency(dashboard?.revenue?.mrr || 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-chalk/60">ARR</p>
                      <p className="text-xl font-bold text-chalk-green">{formatCurrency(dashboard?.revenue?.arr || 0)}</p>
                    </div>
                  </div>
                  <div className="border-t border-chalk-green/20 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-chalk/60">Growth MoM:</span>
                      <span className="text-green-400">+{formatPercentage(dashboard?.revenue?.growth?.mom || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-chalk/60">Growth YoY:</span>
                      <span className="text-green-400">+{formatPercentage(dashboard?.revenue?.growth?.yoy || 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-dark-green/20 border-chalk-green/30">
                <CardHeader>
                  <CardTitle className="text-chalk-green">Users Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-chalk/60">Total Users</p>
                      <p className="text-xl font-bold">{dashboard?.users?.total?.toLocaleString() || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-chalk/60">MAU</p>
                      <p className="text-xl font-bold">{dashboard?.users?.activeThisMonth?.toLocaleString() || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-chalk/60">Nuevos</p>
                      <p className="text-xl font-bold text-chalk-green">{dashboard?.users?.newThisMonth?.toLocaleString() || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-chalk/60">Premium</p>
                      <p className="text-xl font-bold text-chalk-green">{dashboard?.users?.premiumUsers?.toLocaleString() || 0}</p>
                    </div>
                  </div>
                  <div className="border-t border-chalk-green/20 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-chalk/60">En Trial:</span>
                      <span>{dashboard?.users?.trialUsers?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-chalk/60">Premium Rate:</span>
                      <span>{formatPercentage((dashboard?.users?.premiumUsers / dashboard?.users?.total) * 100 || 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content & Ads */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-dark-green/20 border-chalk-green/30">
                <CardHeader>
                  <CardTitle className="text-chalk-green">Content Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-chalk/60">Menús Generados:</span>
                    <span className="font-bold">{dashboard?.content?.menusGenerated?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-chalk/60">Recetas Vistas:</span>
                    <span className="font-bold">{dashboard?.content?.recipesViewed?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-chalk/60">Listas Creadas:</span>
                    <span className="font-bold">{dashboard?.content?.shoppingListsCreated?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-chalk/60">Menús Compartidos:</span>
                    <span className="font-bold">{dashboard?.content?.sharedMenus?.toLocaleString() || 0}</span>
                  </div>
                  <div className="border-t border-chalk-green/20 pt-3">
                    <div className="flex justify-between">
                      <span className="text-chalk/60">Avg Menús/Usuario:</span>
                      <span className="font-bold text-chalk-green">{dashboard?.content?.avgMenusPerUser?.toFixed(1) || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-dark-green/20 border-chalk-green/30">
                <CardHeader>
                  <CardTitle className="text-chalk-green">Advertising Revenue</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-chalk/60">Impressions:</span>
                    <span className="font-bold">{dashboard?.ads?.impressions?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-chalk/60">Clicks:</span>
                    <span className="font-bold">{dashboard?.ads?.clicks?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-chalk/60">Revenue:</span>
                    <span className="font-bold text-chalk-green">{formatCurrency(dashboard?.ads?.revenue || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-chalk/60">RPM:</span>
                    <span className="font-bold">{formatCurrency(dashboard?.ads?.rpm || 0)}</span>
                  </div>
                  <div className="border-t border-chalk-green/20 pt-3">
                    <div className="flex justify-between">
                      <span className="text-chalk/60">Fill Rate:</span>
                      <span className="font-bold text-chalk-green">{formatPercentage(dashboard?.ads?.fillRate || 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            {revenueLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-chalk-green border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Cargando datos de revenue...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-dark-green/20 border-chalk-green/30">
                  <CardHeader>
                    <CardTitle className="text-chalk-green">Revenue Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-chalk/60">Total Revenue:</span>
                      <span className="font-bold text-xl">{formatCurrency(revenue?.summary?.totalRevenue || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-chalk/60">Subscriptions:</span>
                      <span className="font-bold">{formatCurrency(revenue?.summary?.subscriptionRevenue || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-chalk/60">Packs:</span>
                      <span className="font-bold">{formatCurrency(revenue?.summary?.packRevenue || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-chalk/60">Ads:</span>
                      <span className="font-bold">{formatCurrency(revenue?.summary?.adRevenue || 0)}</span>
                    </div>
                    <div className="flex justify-between text-red-400">
                      <span>Refunds:</span>
                      <span>-{formatCurrency(revenue?.summary?.refunds || 0)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-dark-green/20 border-chalk-green/30">
                  <CardHeader>
                    <CardTitle className="text-chalk-green">By Country</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {revenue?.byCountry?.map((country: any) => (
                      <div key={country.country} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {country.country}
                          </Badge>
                          <span className="text-sm text-chalk/60">{country.users} users</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatCurrency(country.revenue)}</div>
                          <div className="text-xs text-chalk/60">ARPU: {formatCurrency(country.arpu)}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-dark-green/20 border-chalk-green/30">
                  <CardHeader>
                    <CardTitle className="text-chalk-green">Projections</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-chalk/60">Next Month:</span>
                        <span className="font-bold text-chalk-green">{formatCurrency(revenue?.projections?.nextMonth || 0)}</span>
                      </div>
                      <Progress value={revenue?.projections?.confidence || 0} className="h-2" />
                      <p className="text-xs text-chalk/50 mt-1">
                        {formatPercentage(revenue?.projections?.confidence || 0)} confidence
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-chalk/60">Next Quarter:</span>
                        <span className="font-bold text-chalk-green">{formatCurrency(revenue?.projections?.nextQuarter || 0)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {usersLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-chalk-green border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Cargando datos de usuarios...</p>
              </div>
            ) : (
              <Card className="bg-dark-green/20 border-chalk-green/30">
                <CardHeader>
                  <CardTitle className="text-chalk-green">User Management</CardTitle>
                  <div className="flex space-x-2">
                    {Object.entries(users?.filters || {}).map(([filter, count]) => (
                      <Badge key={filter} variant="outline" className="text-xs">
                        {filter}: {count}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users?.users?.slice(0, 10).map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border border-chalk-green/20 rounded">
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-chalk/60">{user.email}</p>
                          </div>
                          <Badge 
                            variant={user.status === 'premium' ? 'default' : 'outline'}
                            className={user.status === 'premium' ? 'bg-chalk-green text-dark-green' : ''}
                          >
                            {user.status}
                          </Badge>
                        </div>
                        <div className="text-right text-sm">
                          <p>{user.menusGenerated} menús</p>
                          <p className="text-chalk/60">{formatCurrency(user.revenue)} revenue</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex justify-between items-center">
                    <p className="text-sm text-chalk/60">
                      Mostrando {users?.users?.length || 0} de {users?.pagination?.totalUsers || 0} usuarios
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" disabled>
                        Anterior
                      </Button>
                      <Button variant="outline" size="sm">
                        Siguiente
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            {systemLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-chalk-green border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Cargando estado del sistema...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-dark-green/20 border-chalk-green/30">
                  <CardHeader>
                    <CardTitle className="text-chalk-green flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Services Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(systemHealth?.services || {}).map(([service, data]: [string, any]) => (
                      <div key={service} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${data.status === 'healthy' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                          <span className="capitalize">{service}</span>
                        </div>
                        <div className="text-right text-sm">
                          <div>{data.responseTime}ms</div>
                          <div className="text-chalk/60">{data.uptime}% uptime</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-dark-green/20 border-chalk-green/30">
                  <CardHeader>
                    <CardTitle className="text-chalk-green flex items-center">
                      <Activity className="w-5 h-5 mr-2" />
                      Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-chalk/60">Avg Response:</span>
                      <span className="font-bold">{systemHealth?.performance?.avgResponseTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-chalk/60">Error Rate:</span>
                      <span className="font-bold">{systemHealth?.performance?.errorRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-chalk/60">Throughput:</span>
                      <span className="font-bold">{systemHealth?.performance?.throughput} req/min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-chalk/60">Memory:</span>
                      <span className="font-bold">{systemHealth?.performance?.memoryUsage}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-dark-green/20 border-chalk-green/30 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-chalk-green flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Recent Errors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400">{systemHealth?.errors?.last24h}</div>
                        <div className="text-sm text-chalk/60">Last 24h</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">{systemHealth?.errors?.critical}</div>
                        <div className="text-sm text-chalk/60">Critical</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{systemHealth?.errors?.resolved}</div>
                        <div className="text-sm text-chalk/60">Resolved</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {systemHealth?.errors?.topErrors?.map((error: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 border border-chalk-green/20 rounded">
                          <div>
                            <span className="font-medium">{error.error}</span>
                            <span className="text-sm text-chalk/60 ml-2">({error.count}x)</span>
                          </div>
                          <span className="text-xs text-chalk/50">{error.lastSeen}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <p className="text-sm text-chalk/50">
            Panel actualizado automáticamente cada 5 minutos • 
            Última actualización: {new Date().toLocaleTimeString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
}