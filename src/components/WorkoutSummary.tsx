import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Timer, Weight, RotateCcw } from 'lucide-react';
import { Workout } from '@/types/exercise';

interface WorkoutSummaryProps {
  workout: Workout;
  onSaveAsTemplate: () => void;
  onStartNewWorkout: () => void;
  onClose: () => void;
}

export const WorkoutSummary = ({ 
  workout, 
  onSaveAsTemplate, 
  onStartNewWorkout,
  onClose 
}: WorkoutSummaryProps) => {
  const formatDuration = (duration: number) => {
    const minutes = Math.round(duration / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-xl">Workout Complete!</CardTitle>
        <p className="text-muted-foreground">Great job on completing "{workout.name}"</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {workout.summary && (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{workout.summary.totalSets}</div>
              <div className="text-xs text-muted-foreground">Sets Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{workout.summary.totalReps}</div>
              <div className="text-xs text-muted-foreground">Total Reps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(workout.summary.totalWeight)}</div>
              <div className="text-xs text-muted-foreground">lbs Moved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {workout.duration ? formatDuration(workout.duration) : '0m'}
              </div>
              <div className="text-xs text-muted-foreground">Duration</div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-medium">Exercises Completed:</h4>
          {workout.exercises.map(exercise => {
            const completedSets = exercise.sets.filter(set => set.isCompleted).length;
            return (
              <div key={exercise.id} className="flex items-center justify-between">
                <span className="text-sm">{exercise.exercise.name}</span>
                <Badge variant="secondary">{completedSets}/{exercise.sets.length} sets</Badge>
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <Button onClick={onSaveAsTemplate} variant="outline" className="w-full">
            Save as Template
          </Button>
          <Button onClick={onStartNewWorkout} className="w-full">
            <RotateCcw className="h-4 w-4 mr-1" />
            Start New Workout
          </Button>
          <Button onClick={onClose} variant="ghost" className="w-full">
            View History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};