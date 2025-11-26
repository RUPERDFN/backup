import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Check } from "lucide-react";
import type { Achievement } from "/shared/schema";

interface AchievementBadgeProps {
  achievement: Achievement & { unlocked?: boolean; hidden?: boolean };
  compact?: boolean;
  showProgress?: boolean;
  progress?: number;
}

const tierColors = {
  bronze: "bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700",
  silver: "bg-gray-100 dark:bg-gray-900/20 border-gray-300 dark:border-gray-700",
  gold: "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700",
  platinum: "bg-purple-100 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700"
};

const tierBadgeColors = {
  bronze: "bg-orange-500 dark:bg-orange-600",
  silver: "bg-gray-500 dark:bg-gray-600",
  gold: "bg-yellow-500 dark:bg-yellow-600",
  platinum: "bg-purple-500 dark:bg-purple-600"
};

export default function AchievementBadge({ 
  achievement, 
  compact = false,
  showProgress = false,
  progress = 0
}: AchievementBadgeProps) {
  const isLocked = !achievement.unlocked;
  const isHidden = achievement.hidden;
  
  if (isHidden) {
    return (
      <Card className="bg-gray-50 dark:bg-gray-900/50 border-2 border-dashed" data-testid={`achievement-badge-hidden-${achievement.key}`}>
        <CardContent className="p-4 text-center">
          <Lock className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Logro secreto</p>
        </CardContent>
      </Card>
    );
  }

  const tierClass = tierColors[achievement.tier as keyof typeof tierColors] || tierColors.bronze;
  const badgeClass = tierBadgeColors[achievement.tier as keyof typeof tierBadgeColors] || tierBadgeColors.bronze;
  
  const requirement = achievement.requirement as { type: string; target: number; action: string };
  const progressPercent = showProgress && requirement ? Math.min((progress / requirement.target) * 100, 100) : 0;

  return (
    <Card 
      className={`border-2 transition-all ${tierClass} ${isLocked ? 'opacity-60' : 'shadow-md'}`}
      data-testid={`achievement-badge-${achievement.key}`}
    >
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="flex items-start gap-3">
          <div className={`text-4xl ${compact ? 'text-3xl' : ''} ${isLocked ? 'grayscale' : ''}`}>
            {achievement.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-bold ${compact ? 'text-sm' : 'text-base'} text-gray-900 dark:text-gray-100`}>
                {achievement.name}
              </h3>
              {achievement.unlocked && (
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" data-testid={`achievement-unlocked-${achievement.key}`} />
              )}
            </div>
            <p className={`text-gray-600 dark:text-gray-300 ${compact ? 'text-xs' : 'text-sm'} mb-2`}>
              {achievement.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={`${badgeClass} text-white text-xs`} data-testid={`achievement-tier-${achievement.tier}`}>
                {achievement.tier.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs" data-testid={`achievement-points-${achievement.points}`}>
                {achievement.points} XP
              </Badge>
              {!compact && (
                <Badge variant="secondary" className="text-xs" data-testid={`achievement-category-${achievement.category}`}>
                  {achievement.category}
                </Badge>
              )}
            </div>
            {showProgress && !achievement.unlocked && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>Progreso</span>
                  <span>{progress} / {requirement.target}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${badgeClass}`}
                    style={{ width: `${progressPercent}%` }}
                    data-testid={`achievement-progress-${achievement.key}`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
