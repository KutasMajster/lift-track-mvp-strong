import { useState, useCallback, useEffect } from 'react';
import { Workout, WorkoutExercise, WorkoutSet, WorkoutTemplate, WorkoutSummary } from '@/types/exercise';
import { v4 as uuidv4 } from 'uuid';

const WORKOUT_STORAGE_KEY = 'iron-gains-current-workout';
const TIMER_STORAGE_KEY = 'iron-gains-workout-timer';
const HISTORY_STORAGE_KEY = 'iron-gains-workout-history';
const TEMPLATES_STORAGE_KEY = 'iron-gains-workout-templates';

export const useWorkout = () => {
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(() => {
    const saved = localStorage.getItem(WORKOUT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  
  const [workoutHistory, setWorkoutHistory] = useState<Workout[]>(() => {
    const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>(() => {
    const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [workoutTimer, setWorkoutTimer] = useState<number>(() => {
    const saved = localStorage.getItem(TIMER_STORAGE_KEY);
    return saved ? parseInt(saved) : 0;
  });

  // Persist current workout to localStorage
  useEffect(() => {
    if (currentWorkout) {
      localStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(currentWorkout));
    } else {
      localStorage.removeItem(WORKOUT_STORAGE_KEY);
    }
  }, [currentWorkout]);

  // Persist timer to localStorage
  useEffect(() => {
    if (currentWorkout && !currentWorkout.isCompleted) {
      localStorage.setItem(TIMER_STORAGE_KEY, workoutTimer.toString());
    } else {
      localStorage.removeItem(TIMER_STORAGE_KEY);
    }
  }, [workoutTimer, currentWorkout]);

  // Persist history to localStorage
  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(workoutHistory));
  }, [workoutHistory]);

  // Persist templates to localStorage
  useEffect(() => {
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(workoutTemplates));
  }, [workoutTemplates]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentWorkout && !currentWorkout.isCompleted) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentWorkout]);

  const calculateWorkoutSummary = (workout: Workout): WorkoutSummary => {
    let totalSets = 0;
    let totalReps = 0;
    let totalWeight = 0;
    let exercisesCompleted = 0;

    workout.exercises.forEach(exercise => {
      const completedSets = exercise.sets.filter(set => set.isCompleted);
      totalSets += completedSets.length;
      totalReps += completedSets.reduce((sum, set) => sum + set.reps, 0);
      totalWeight += completedSets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
      if (completedSets.length > 0) exercisesCompleted++;
    });

    return {
      totalSets,
      totalReps,
      totalWeight,
      exercisesCompleted,
      duration: workout.duration || 0
    };
  };

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

  const startWorkoutFromTemplate = useCallback((template: WorkoutTemplate) => {
    const workout: Workout = {
      id: uuidv4(),
      name: template.name,
      date: new Date(),
      exercises: template.exercises.map(templateExercise => ({
        id: uuidv4(),
        exerciseId: templateExercise.exerciseId,
        exercise: templateExercise.exercise,
        sets: Array.from({ length: templateExercise.targetSets }, () => ({
          id: uuidv4(),
          reps: 0,
          weight: 0,
          isCompleted: false
        }))
      })),
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
      duration: workoutTimer * 1000,
      summary: calculateWorkoutSummary({
        ...currentWorkout,
        duration: workoutTimer * 1000
      })
    };

    setWorkoutHistory(prev => [completedWorkout, ...prev]);
    setCurrentWorkout(null);
    setWorkoutTimer(0);
    
    return completedWorkout;
  }, [currentWorkout, workoutTimer]);

  const cancelWorkout = useCallback(() => {
    setCurrentWorkout(null);
    setWorkoutTimer(0);
  }, []);

  const saveAsTemplate = useCallback((workout: Workout) => {
    const template: WorkoutTemplate = {
      id: uuidv4(),
      name: `${workout.name} Template`,
      exercises: workout.exercises.map(ex => ({
        exerciseId: ex.exerciseId,
        exercise: ex.exercise,
        targetSets: ex.sets.length
      })),
      createdFrom: workout.id,
      createdAt: new Date()
    };

    setWorkoutTemplates(prev => [template, ...prev]);
    return template;
  }, []);

  const deleteTemplate = useCallback((templateId: string) => {
    setWorkoutTemplates(prev => prev.filter(t => t.id !== templateId));
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
    workoutTemplates,
    workoutTimer,
    formatTime,
    startWorkout,
    startWorkoutFromTemplate,
    addExercise,
    addSet,
    updateSet,
    deleteSet,
    deleteExercise,
    completeWorkout,
    cancelWorkout,
    saveAsTemplate,
    deleteTemplate
  };
};