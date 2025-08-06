import { useState } from 'react';
import { useWorkout } from '@/hooks/useWorkout';
import { useUnitConversion } from '@/hooks/useUnitConversion';
import { useRestTimer } from '@/hooks/useRestTimer';
import { ExerciseDatabase } from './ExerciseDatabase';
import { WorkoutSummary } from './WorkoutSummary';
import { ExerciseDetail } from './ExerciseDetail';
import { RestTimer } from './RestTimer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Square, Plus, Check, X, Trash2, Timer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Exercise, ExerciseCategory } from '@/types/exercise';

interface WorkoutLoggerProps {}

export const WorkoutLogger = ({}: WorkoutLoggerProps) => {
  const {
    currentWorkout,
    workoutTimer,
    formatTime,
    startWorkout,
    addExercise,
    addSet,
    updateSet,
    deleteSet,
    deleteExercise,
    completeWorkout,
    cancelWorkout,
    saveAsTemplate
  } = useWorkout();

  const { convertWeight, convertWeightToStorage, getWeightUnit } = useUnitConversion();
  const {
    timeLeft,
    isRunning,
    isVisible,
    isActive,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    stopTimer,
    showTimer,
    hideTimer,
    skipTimer,
    formatTime: formatRestTime
  } = useRestTimer();

  const [workoutName, setWorkoutName] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [completedWorkout, setCompletedWorkout] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showExerciseDetail, setShowExerciseDetail] = useState(false);

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
    const completed = completeWorkout();
    if (completed) {
      setCompletedWorkout(completed);
      setShowSummary(true);
    }
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

  const handleSaveAsTemplate = () => {
    if (completedWorkout) {
      const template = saveAsTemplate(completedWorkout);
      toast({
        title: "Template Saved!",
        description: `"${template.name}" has been saved as a template.`
      });
    }
  };

  const handleStartNewWorkout = () => {
    setShowSummary(false);
    setCompletedWorkout(null);
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
    setCompletedWorkout(null);
  };

  if (showSummary && completedWorkout) {
    return (
      <div className="space-y-6">
        <WorkoutSummary 
          workout={completedWorkout}
          onSaveAsTemplate={handleSaveAsTemplate}
          onStartNewWorkout={handleStartNewWorkout}
          onClose={handleCloseSummary}
        />
      </div>
    );
  }

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

      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Square className="h-5 w-5" />
                {currentWorkout.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {formatTime(workoutTimer)}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {isActive && !isVisible && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={showTimer}
                  className="flex items-center gap-1"
                >
                  <Timer className="h-4 w-4" />
                  {formatRestTime(timeLeft)}
                </Button>
              )}
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
                  <div className="flex items-center justify-between">
                    <CardTitle 
                      className="text-lg cursor-pointer hover:text-primary transition-colors"
                      onClick={() => {
                        setSelectedExercise(workoutExercise.exercise);
                        setShowExerciseDetail(true);
                      }}
                    >
                      {workoutExercise.exercise.name}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteExercise(workoutExercise.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {workoutExercise.sets.map((set, index) => (
                    <div key={set.id} className="flex items-center gap-3">
                      <span className="text-sm font-medium w-8">{index + 1}</span>
                      <div className="flex-1 flex gap-2">
                        {workoutExercise.exercise.category === ExerciseCategory.CARDIO ? (
                          // Cardio exercises - duration and distance
                          <>
                            <Input
                              type="number"
                              placeholder="Duration (min)"
                              value={set.duration ? Math.floor(set.duration / 60) : ''}
                              min="0"
                              onChange={(e) => {
                                const minutes = parseInt(e.target.value) || 0;
                                updateSet(workoutExercise.id, set.id, { 
                                  duration: minutes * 60 
                                });
                              }}
                              className="w-24"
                            />
                            <span className="self-center text-sm">min</span>
                            <Input
                              type="number"
                              placeholder="Distance (m)"
                              value={set.distance || ''}
                              min="0"
                              step="100"
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                updateSet(workoutExercise.id, set.id, { 
                                  distance: value 
                                });
                              }}
                              className="w-24"
                            />
                            <span className="self-center text-sm">m</span>
                          </>
                        ) : (
                          // Regular exercises - weight and reps
                          <>
                            <Input
                              type="number"
                              placeholder="Weight"
                              value={set.weight ? convertWeight(set.weight).value : ''}
                              min="0"
                              step="0.5"
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (value >= 0) {
                                  const weightForStorage = convertWeightToStorage(value);
                                  updateSet(workoutExercise.id, set.id, { 
                                    weight: weightForStorage 
                                  });
                                } else {
                                  updateSet(workoutExercise.id, set.id, { 
                                    weight: 0 
                                  });
                                }
                              }}
                              className="w-20"
                            />
                            <span className="self-center text-sm">{getWeightUnit()} ×</span>
                            <Input
                              type="number"
                              placeholder="Reps"
                              value={set.reps || ''}
                              min="0"
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                updateSet(workoutExercise.id, set.id, { 
                                  reps: value >= 0 ? value : 0 
                                });
                              }}
                              className="w-16"
                            />
                          </>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant={set.isCompleted ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            updateSet(workoutExercise.id, set.id, { 
                              isCompleted: !set.isCompleted 
                            });
                            if (!set.isCompleted) {
                              startTimer(90);
                            }
                          }}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        {workoutExercise.sets.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSet(workoutExercise.id, set.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
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

      <ExerciseDetail
        exercise={selectedExercise}
        isOpen={showExerciseDetail}
        onClose={() => setShowExerciseDetail(false)}
        showAddButton={false}
      />
      
      <RestTimer
        isOpen={isVisible}
        onClose={hideTimer}
        defaultTime={90}
        isActive={isActive}
        timeLeft={timeLeft}
        isRunning={isRunning}
        onReopen={showTimer}
        onPause={pauseTimer}
        onResume={resumeTimer}
        onReset={() => resetTimer(90)}
        onSetTime={(seconds) => {
          resetTimer(seconds);
          startTimer(seconds);
        }}
        onSkip={skipTimer}
      />
    </div>
  );
};