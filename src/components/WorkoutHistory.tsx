import { useState } from 'react';
import { useWorkout } from '@/hooks/useWorkout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { History, BookOpen, Calendar, Timer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Workout } from '@/types/exercise';

export const WorkoutHistory = () => {
  const { 
    workoutHistory, 
    saveAsTemplate
  } = useWorkout();
  
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);

  const handleSaveAsTemplate = (workout: Workout) => {
    const template = saveAsTemplate(workout);
    toast({
      title: "Template Saved!",
      description: `"${template.name}" has been saved as a template.`
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <History className="h-6 w-6" />
          Workout History
        </h2>
        <p className="text-muted-foreground">Track your workout progress over time</p>
      </div>

      <div className="space-y-4">
          {workoutHistory.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No workouts completed yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete your first workout to see it here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {workoutHistory.map(workout => (
                <Card key={workout.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{workout.name}</CardTitle>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(workout.date)}
                          </div>
                          {workout.duration && (
                            <div className="flex items-center gap-1">
                              <Timer className="h-4 w-4" />
                              {formatDuration(workout.duration)}
                            </div>
                          )}
                          <Badge variant="secondary">
                            {workout.exercises.length} exercises
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSaveAsTemplate(workout)}
                        >
                          <BookOpen className="h-4 w-4 mr-1" />
                          Save Template
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedWorkout(
                            expandedWorkout === workout.id ? null : workout.id
                          )}
                        >
                          {expandedWorkout === workout.id ? 'Hide' : 'Details'}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {workout.summary && (
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{workout.summary.totalSets}</div>
                          <div className="text-xs text-muted-foreground">Sets</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{workout.summary.totalReps}</div>
                          <div className="text-xs text-muted-foreground">Reps</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{Math.round(workout.summary.totalWeight)}</div>
                          <div className="text-xs text-muted-foreground">lbs Moved</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{workout.summary.exercisesCompleted}</div>
                          <div className="text-xs text-muted-foreground">Exercises</div>
                        </div>
                      </div>
                      
                      {expandedWorkout === workout.id && (
                        <>
                          <Separator className="my-4" />
                          <div className="space-y-3">
                            {workout.exercises.map(exercise => (
                              <div key={exercise.id} className="border rounded p-3">
                                <h4 className="font-medium mb-2">{exercise.exercise.name}</h4>
                                <div className="grid gap-2">
                                  {exercise.sets.map((set, index) => (
                                    <div key={set.id} className="flex items-center gap-3 text-sm">
                                      <span className="w-8">Set {index + 1}:</span>
                                      <span>{set.weight} lbs × {set.reps} reps</span>
                                      {set.isCompleted && (
                                        <Badge variant="secondary" className="text-xs">✓</Badge>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};