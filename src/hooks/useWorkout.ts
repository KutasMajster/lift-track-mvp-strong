import { useState, useCallback, useEffect } from 'react';
import { Workout, WorkoutExercise, WorkoutSet, WorkoutTemplate, WorkoutSummary } from '@/types/exercise';
import { useProfiles } from './useProfiles';
import { v4 as uuidv4 } from 'uuid';

const WORKOUT_STORAGE_KEY = 'iron-gains-current-workout';
const TIMER_STORAGE_KEY = 'iron-gains-workout-timer';
const HISTORY_STORAGE_KEY = 'iron-gains-workout-history';
const TEMPLATES_STORAGE_KEY = 'iron-gains-workout-templates';

export const useWorkout = () => {
  const { activeProfile } = useProfiles();
  
  // Generate stable storage keys based on active profile
  const getStorageKeys = () => {
    const profileId = activeProfile?.id || 'default';
    return {
      currentWorkout: `${WORKOUT_STORAGE_KEY}-${profileId}`,
      history: `${HISTORY_STORAGE_KEY}-${profileId}`,
      templates: `${TEMPLATES_STORAGE_KEY}-${profileId}`,
      timer: `${TIMER_STORAGE_KEY}-${profileId}`
    };
  };

  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(() => {
    const keys = getStorageKeys();
    const saved = localStorage.getItem(keys.currentWorkout);
    return saved ? JSON.parse(saved) : null;
  });
  
  const [workoutHistory, setWorkoutHistory] = useState<Workout[]>(() => {
    const keys = getStorageKeys();
    const saved = localStorage.getItem(keys.history);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>(() => {
    const keys = getStorageKeys();
    const saved = localStorage.getItem(keys.templates);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [workoutTimer, setWorkoutTimer] = useState<number>(() => {
    const keys = getStorageKeys();
    const saved = localStorage.getItem(keys.timer);
    return saved ? parseInt(saved) : 0;
  });

  // Reload data when active profile changes - force fresh data
  useEffect(() => {
    if (activeProfile?.id) {
      const keys = getStorageKeys();
      const saved = localStorage.getItem(keys.currentWorkout);
      setCurrentWorkout(saved ? JSON.parse(saved) : null);
      
      const historySaved = localStorage.getItem(keys.history);
      setWorkoutHistory(historySaved ? JSON.parse(historySaved) : []);
      
      const templatesSaved = localStorage.getItem(keys.templates);
      setWorkoutTemplates(templatesSaved ? JSON.parse(templatesSaved) : []);
      
      const timerSaved = localStorage.getItem(keys.timer);
      setWorkoutTimer(timerSaved ? parseInt(timerSaved) : 0);
    }
  }, [activeProfile?.id]);

  // Persist current workout to localStorage
  useEffect(() => {
    const keys = getStorageKeys();
    if (currentWorkout) {
      localStorage.setItem(keys.currentWorkout, JSON.stringify(currentWorkout));
    } else {
      localStorage.removeItem(keys.currentWorkout);
    }
  }, [currentWorkout, activeProfile?.id]);

  // Persist timer to localStorage
  useEffect(() => {
    const keys = getStorageKeys();
    if (currentWorkout && !currentWorkout.isCompleted) {
      localStorage.setItem(keys.timer, workoutTimer.toString());
    } else {
      localStorage.removeItem(keys.timer);
    }
  }, [workoutTimer, currentWorkout, activeProfile?.id]);

  // Persist history to localStorage
  useEffect(() => {
    const keys = getStorageKeys();
    localStorage.setItem(keys.history, JSON.stringify(workoutHistory));
  }, [workoutHistory, activeProfile?.id]);

  // Persist templates to localStorage
  useEffect(() => {
    const keys = getStorageKeys();
    localStorage.setItem(keys.templates, JSON.stringify(workoutTemplates));
  }, [workoutTemplates, activeProfile?.id]);

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
          reps: templateExercise.lastUsedValues?.reps || 0,
          weight: templateExercise.lastUsedValues?.weight || 0,
          duration: templateExercise.lastUsedValues?.duration,
          distance: templateExercise.lastUsedValues?.distance,
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

    // Find the exercise and get the last set for auto-fill
    const exercise = currentWorkout.exercises.find(ex => ex.id === exerciseId);
    const lastSet = exercise?.sets[exercise.sets.length - 1];

    const newSet: WorkoutSet = {
      id: uuidv4(),
      reps: lastSet?.reps || 0,
      weight: lastSet?.weight || 0,
      duration: lastSet?.duration || undefined,
      distance: lastSet?.distance || undefined,
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
      exercises: workout.exercises.map(ex => {
        // Get the last completed set or the last set for values
        const lastCompletedSet = ex.sets.filter(set => set.isCompleted).pop();
        const lastSet = lastCompletedSet || ex.sets[ex.sets.length - 1];
        
        return {
          exerciseId: ex.exerciseId,
          exercise: ex.exercise,
          targetSets: ex.sets.length,
          lastUsedValues: lastSet ? {
            reps: lastSet.reps || 0,
            weight: lastSet.weight || 0,
            duration: lastSet.duration,
            distance: lastSet.distance
          } : undefined
        };
      }),
      createdFrom: workout.id,
      createdAt: new Date()
    };

    setWorkoutTemplates(prev => [template, ...prev]);
    return template;
  }, []);

  const deleteTemplate = useCallback((templateId: string) => {
    setWorkoutTemplates(prev => {
      const filtered = prev.filter(t => t.id !== templateId);
      // Force a new array reference to ensure re-render
      return [...filtered];
    });
  }, []);

  const updateTemplate = useCallback((updatedTemplate: WorkoutTemplate) => {
    setWorkoutTemplates(prev => {
      const updated = prev.map(template => 
        template.id === updatedTemplate.id ? updatedTemplate : template
      );
      // Force a new array reference to ensure re-render
      return [...updated];
    });
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
    deleteTemplate,
    updateTemplate
  };
};