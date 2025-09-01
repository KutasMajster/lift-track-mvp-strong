
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Timer, Weight, RotateCcw, Save } from 'lucide-react';
import { useUnitConversion } from '@/hooks/useUnitConversion';
import { Workout } from '@/types/exercise';

interface WorkoutCompletionModalProps {
  workout: Workout;
  isOpen: boolean;
  onClose: () => void;
  onSaveAsTemplate: () => void;
  onStartNewWorkout: () => void;
  onViewHistory: () => void;
}

export const WorkoutCompletionModal = ({ 
  workout, 
  isOpen,
  onClose,
  onSaveAsTemplate, 
  onStartNewWorkout,
  onViewHistory 
}: WorkoutCompletionModalProps) => {
  const { convertWeight, getWeightUnit } = useUnitConversion();
  
  const formatDuration = (duration: number) => {
    const minutes = Math.round(duration / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const handleSaveTemplate = () => {
    onSaveAsTemplate();
    onClose();
  };

  const handleStartNew = () => {
    onStartNewWorkout();
    onClose();
  };

  const handleViewHistory = () => {
    onViewHistory();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md mx-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <DialogTitle className="text-xl">Workout Complete!</DialogTitle>
          <p className="text-muted-foreground">Great job on completing "{workout.name}"</p>
        </DialogHeader>
        
        <div className="space-y-6">
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
                <div className="text-2xl font-bold">{Math.round(convertWeight(workout.summary.totalWeight).value)}</div>
                <div className="text-xs text-muted-foreground">{getWeightUnit()} Moved</div>
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
            <Button onClick={handleSaveTemplate} variant="outline" className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save as Template
            </Button>
            <Button onClick={handleStartNew} className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Start New Workout
            </Button>
            <Button onClick={handleViewHistory} variant="ghost" className="w-full">
              View History
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
