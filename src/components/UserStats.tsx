import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, Weight, Target, Timer } from 'lucide-react';
import { Workout } from '@/types/exercise';

interface UserStatsProps {
  workoutHistory: Workout[];
}

export const UserStats = ({ workoutHistory }: UserStatsProps) => {
  const completedWorkouts = workoutHistory.filter(w => w.isCompleted);
  
  const totalWorkouts = completedWorkouts.length;
  const totalWeight = completedWorkouts.reduce((sum, workout) => 
    sum + (workout.summary?.totalWeight || 0), 0
  );
  const totalSets = completedWorkouts.reduce((sum, workout) => 
    sum + (workout.summary?.totalSets || 0), 0
  );
  const totalReps = completedWorkouts.reduce((sum, workout) => 
    sum + (workout.summary?.totalReps || 0), 0
  );
  const totalDuration = completedWorkouts.reduce((sum, workout) => 
    sum + (workout.duration || 0), 0
  );

  // Calculate consistency (workouts in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentWorkouts = completedWorkouts.filter(w => 
    new Date(w.date) >= thirtyDaysAgo
  ).length;

  // Calculate average workout duration
  const avgDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;

  // Get most frequent exercise category
  const categoryCount: Record<string, number> = {};
  completedWorkouts.forEach(workout => {
    workout.exercises.forEach(ex => {
      categoryCount[ex.exercise.category] = (categoryCount[ex.exercise.category] || 0) + 1;
    });
  });
  const favoriteCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const stats = [
    {
      title: "Total Workouts",
      value: totalWorkouts,
      icon: Calendar,
      color: "text-blue-500"
    },
    {
      title: "Weight Lifted",
      value: `${Math.round(totalWeight).toLocaleString()} lbs`,
      icon: Weight,
      color: "text-green-500"
    },
    {
      title: "Total Sets",
      value: totalSets,
      icon: Target,
      color: "text-purple-500"
    },
    {
      title: "Total Reps",
      value: totalReps.toLocaleString(),
      icon: TrendingUp,
      color: "text-orange-500"
    },
    {
      title: "Total Time",
      value: formatDuration(totalDuration),
      icon: Timer,
      color: "text-red-500"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Your Stats</h2>
        <p className="text-muted-foreground">Track your fitness journey progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentWorkouts}</div>
            <p className="text-xs text-muted-foreground">Workouts in last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(avgDuration)}</div>
            <p className="text-xs text-muted-foreground">Per workout</p>
          </CardContent>
        </Card>
      </div>

      {favoriteCategory && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Favorite Category</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="capitalize">
              {favoriteCategory[0]}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              {favoriteCategory[1]} exercises completed
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};