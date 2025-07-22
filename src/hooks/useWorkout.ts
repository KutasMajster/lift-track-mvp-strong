import { useState, useCallback } from 'react';
import { Workout, WorkoutExercise, WorkoutSet } from '@/types/exercise';
import { v4 as uuidv4 } from 'uuid';

export const useWorkout = () => {
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<Workout[]>([]);

  const startWorkout = useCallback((name: string = 'Workout') => {
    const workout: Workout = {
      id: uuidv4(),
      name,
      date: new Date(),
      exercises: [],
      isCompleted: false
    };
    setCurrentWorkout(workout);
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

  const completeWorkout = useCallback(() => {
    if (!currentWorkout) return;

    const completedWorkout = {
      ...currentWorkout,
      isCompleted: true,
      duration: Date.now() - currentWorkout.date.getTime()
    };

    setWorkoutHistory(prev => [completedWorkout, ...prev]);
    setCurrentWorkout(null);
  }, [currentWorkout]);

  const cancelWorkout = useCallback(() => {
    setCurrentWorkout(null);
  }, []);

  return {
    currentWorkout,
    workoutHistory,
    startWorkout,
    addExercise,
    addSet,
    updateSet,
    completeWorkout,
    cancelWorkout
  };
};