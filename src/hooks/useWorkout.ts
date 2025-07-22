import { useState, useCallback, useEffect } from 'react';
import { Workout, WorkoutExercise, WorkoutSet } from '@/types/exercise';
import { v4 as uuidv4 } from 'uuid';

export const useWorkout = () => {
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<Workout[]>([]);
  const [workoutTimer, setWorkoutTimer] = useState<number>(0);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentWorkout && !currentWorkout.isCompleted) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
    } else {
      setWorkoutTimer(0);
    }
    return () => clearInterval(interval);
  }, [currentWorkout]);

  const startWorkout = useCallback((name: string = 'Workout') => {
    const workout: Workout = {
      id: uuidv4(),
      name,
      date: new Date(),
      exercises: [],
      isCompleted: false
    };
    setCurrentWorkout(workout);
    setWorkoutTimer(0);
  }, []);

  const addExercise = useCallback((exercise: any) => {
    if (!currentWorkout) return;

    const workoutExercise: WorkoutExercise = {
      id: uuidv4(),
      exerciseId: exercise.id,
      exercise,
      sets: [
        {
          id: uuidv4(),
          reps: 0,
          weight: 0,
          isCompleted: false
        }
      ]
    };

    setCurrentWorkout(prev => prev ? {
      ...prev,
      exercises: [...prev.exercises, workoutExercise]
    } : null);
  }, [currentWorkout]);

  const addSet = useCallback((exerciseId: string) => {
    if (!currentWorkout) return;

    const newSet: WorkoutSet = {
      id: uuidv4(),
      reps: 0,
      weight: 0,
      isCompleted: false
    };

    setCurrentWorkout(prev => prev ? {
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, sets: [...ex.sets, newSet] }
          : ex
      )
    } : null);
  }, [currentWorkout]);

  const updateSet = useCallback((exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => {
    if (!currentWorkout) return;

    setCurrentWorkout(prev => prev ? {
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === exerciseId 
          ? {
              ...ex,
              sets: ex.sets.map(set => 
                set.id === setId 
                  ? { ...set, ...updates }
                  : set
              )
            }
          : ex
      )
    } : null);
  }, [currentWorkout]);

  const deleteSet = useCallback((exerciseId: string, setId: string) => {
    if (!currentWorkout) return;

    setCurrentWorkout(prev => prev ? {
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, sets: ex.sets.filter(set => set.id !== setId) }
          : ex
      )
    } : null);
  }, [currentWorkout]);

  const deleteExercise = useCallback((exerciseId: string) => {
    if (!currentWorkout) return;

    setCurrentWorkout(prev => prev ? {
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    } : null);
  }, [currentWorkout]);

  const completeWorkout = useCallback(() => {
    if (!currentWorkout) return;

    const completedWorkout = {
      ...currentWorkout,
      isCompleted: true,
      duration: workoutTimer * 1000
    };

    setWorkoutHistory(prev => [completedWorkout, ...prev]);
    setCurrentWorkout(null);
    setWorkoutTimer(0);
  }, [currentWorkout, workoutTimer]);

  const cancelWorkout = useCallback(() => {
    setCurrentWorkout(null);
    setWorkoutTimer(0);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    currentWorkout,
    workoutHistory,
    workoutTimer,
    formatTime,
    startWorkout,
    addExercise,
    addSet,
    updateSet,
    deleteSet,
    deleteExercise,
    completeWorkout,
    cancelWorkout
  };
};