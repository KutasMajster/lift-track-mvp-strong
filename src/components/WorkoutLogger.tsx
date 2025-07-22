import { useState } from 'react';
import { useWorkout } from '@/hooks/useWorkout';
import { ExerciseDatabase } from './ExerciseDatabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Square, Plus, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const WorkoutLogger = () => {
  const {
    currentWorkout,
    workoutHistory,
    startWorkout,
    addExercise,
    addSet,
    updateSet,
    completeWorkout,
    cancelWorkout
  } = useWorkout();

  const [workoutName, setWorkoutName] = useState('');

  const handleStartWorkout = () => {
    const name = workoutName.trim() || 'Workout';
    startWorkout(name);
    setWorkoutName('');
    toast({
      title: "Workout Started!",
      description: `Started "${name}"`
    });
  };

  const handleCompleteWorkout = () => {
    completeWorkout();
    toast({
      title: "Workout Completed!",
      description: "Great job! Your workout has been saved."
    });
  };

  const handleCancelWorkout = () => {
    cancelWorkout();
    toast({
      title: "Workout Cancelled",
      description: "Your workout has been cancelled."
    });
  };

  if (!currentWorkout) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Start New Workout
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Workout name (optional)"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
            />
            <Button onClick={handleStartWorkout} className="w-full">
              Start Workout
            </Button>
          </CardContent>
        </Card>

        {workoutHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workoutHistory.slice(0, 5).map(workout => (
                  <div key={workout.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h4 className="font-medium">{workout.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {workout.date.toLocaleDateString()} • {workout.exercises.length} exercises
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {Math.round((workout.duration || 0) / 60000)}m
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Square className="h-5 w-5" />
              {currentWorkout.name}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancelWorkout}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleCompleteWorkout}>
                <Check className="h-4 w-4 mr-1" />
                Complete
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="exercises" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="exercises">Current Workout</TabsTrigger>
          <TabsTrigger value="database">Add Exercise</TabsTrigger>
        </TabsList>

        <TabsContent value="exercises" className="space-y-4">
          {currentWorkout.exercises.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No exercises added yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Switch to "Add Exercise" tab to get started
                </p>
              </CardContent>
            </Card>
          ) : (
            currentWorkout.exercises.map(workoutExercise => (
              <Card key={workoutExercise.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{workoutExercise.exercise.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {workoutExercise.sets.map((set, index) => (
                    <div key={set.id} className="flex items-center gap-3">
                      <span className="text-sm font-medium w-8">{index + 1}</span>
                      <div className="flex-1 flex gap-2">
                        <Input
                          type="number"
                          placeholder="Weight"
                          value={set.weight || ''}
                          onChange={(e) => updateSet(workoutExercise.id, set.id, { 
                            weight: parseFloat(e.target.value) || 0 
                          })}
                          className="w-20"
                        />
                        <span className="self-center text-sm">lbs ×</span>
                        <Input
                          type="number"
                          placeholder="Reps"
                          value={set.reps || ''}
                          onChange={(e) => updateSet(workoutExercise.id, set.id, { 
                            reps: parseInt(e.target.value) || 0 
                          })}
                          className="w-16"
                        />
                      </div>
                      <Button
                        variant={set.isCompleted ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSet(workoutExercise.id, set.id, { 
                          isCompleted: !set.isCompleted 
                        })}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Separator />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSet(workoutExercise.id)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Set
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="database">
          <ExerciseDatabase 
            onAddExercise={addExercise} 
            isInWorkout={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};