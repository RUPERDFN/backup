import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Flame, Award } from "lucide-react";
import AchievementBadge from "@/components/AchievementBadge";
import type { Achievement, UserStats } from "@shared/schema";

type EnrichedAchievement = Achievement & { unlocked?: boolean; hidden?: boolean };

export default function Achievements() {
  const { data: achievements, isLoading: achievementsLoading } = useQuery<EnrichedAchievement[]>({
    queryKey: ['/api/gamification/achievements']
  });

  const { data: stats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ['/api/gamification/stats']
  });

  const { data: myAchievementsData } = useQuery<{ achievements: any[], unviewedCount: number }>({
    queryKey: ['/api/gamification/my-achievements']
  });

  if (achievementsLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="max-w-7xl mx-auto pt-20">
          <p className="text-center text-gray-600 dark:text-gray-400">Cargando logros...</p>
        </div>
      </div>
    );
  }

  const unlockedCount = achievements?.filter(a => a.unlocked).length || 0;
  const totalCount = achievements?.length || 0;
  const completionPercent = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  const level = stats?.level || 1;
  const totalPoints = stats?.totalPoints || 0;
  const nextLevelPoints = level * 100;
  const levelProgress = (totalPoints % 100);

  const categories = [
    { key: 'all', label: 'Todos', icon: Trophy },
    { key: 'planning', label: 'Planificación', icon: Target },
    { key: 'cooking', label: 'Cocina', icon: Award },
    { key: 'shopping', label: 'Compras', icon: Target },
    { key: 'dedication', label: 'Dedicación', icon: Flame }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-7xl mx-auto pt-20 pb-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100" data-testid="achievements-title">
            🏆 Logros
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Completa desafíos y desbloquea logros</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card data-testid="stats-level">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Nivel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{level}</div>
              <Progress value={levelProgress} className="mt-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {levelProgress} / 100 XP
              </p>
            </CardContent>
          </Card>

          <Card data-testid="stats-points">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Puntos Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalPoints}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">XP acumulados</p>
            </CardContent>
          </Card>

          <Card data-testid="stats-completion">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Progreso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {unlockedCount}/{totalCount}
              </div>
              <Progress value={completionPercent} className="mt-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {completionPercent.toFixed(0)}% completado
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8" data-testid="stats-activity">
          <CardHeader>
            <CardTitle>Actividad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats?.menusCreated || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Menús Creados</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats?.recipesCooked || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Recetas Cocinadas</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats?.shoppingCompleted || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Compras Completadas</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats?.currentStreak || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Racha Actual</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6" data-testid="achievements-tabs">
            {categories.map(cat => (
              <TabsTrigger 
                key={cat.key} 
                value={cat.key}
                className="text-xs md:text-sm"
                data-testid={`tab-${cat.key}`}
              >
                <cat.icon className="w-4 h-4 mr-1" />
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(cat => {
            const filteredAchievements = cat.key === 'all' 
              ? achievements 
              : achievements?.filter(a => a.category === cat.key);

            return (
              <TabsContent key={cat.key} value={cat.key} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAchievements?.map(achievement => {
                    const req = achievement.requirement as { type: string; target: number; action: string };
                    let progress = 0;

                    if (stats && req) {
                      switch (req.action) {
                        case 'menu_created':
                          progress = stats.menusCreated || 0;
                          break;
                        case 'recipe_cooked':
                          progress = stats.recipesCooked || 0;
                          break;
                        case 'shopping_completed':
                          progress = stats.shoppingCompleted || 0;
                          break;
                        case 'streak_days':
                          progress = stats.currentStreak || 0;
                          break;
                      }
                    }

                    return (
                      <AchievementBadge 
                        key={achievement.id} 
                        achievement={achievement}
                        showProgress
                        progress={progress}
                      />
                    );
                  })}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
