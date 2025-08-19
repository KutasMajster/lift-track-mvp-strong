import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfiles } from '@/hooks/useProfiles';
import { Workout, WorkoutExercise, WorkoutSet, WorkoutTemplate, WorkoutSummary } from '@/types/exercise';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export const useSupabaseWorkout = () => {
  const { user } = useAuth();
  const { activeProfile } = useProfiles();
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<Workout[]>([]);
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>([]);
  const [workoutTimer, setWorkoutTimer] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Fetch workouts from Supabase
  const fetchWorkouts = async () => {
    if (!user || !activeProfile) return;

    try {
      const { data: workoutsData, error: workoutsError } = await supabase
        .from('workouts')
        .select(`
          *,
          workout_exercises (
            *,
            workout_sets (*)
          )
        `)
        .eq('user_id', user.id)
        .eq('profile_id', activeProfile.id)
        .eq('is_completed', true)
        .order('date', { ascending: false });

      if (workoutsError) throw workoutsError;

      // Convert Supabase data to Workout format
      const formattedWorkouts: Workout[] = workoutsData?.map(workout => ({
        id: workout.id,
        name: workout.name,
        date: new Date(workout.date),
        duration: workout.duration,
        isCompleted: workout.is_completed,
        summary: workout.summary,
        exercises: workout.workout_exercises.map((exercise: any, index: number) => ({
          id: exercise.id,
          exerciseId: exercise.exercise_id,
          exercise: exercise.exercise_data,
          sets: exercise.workout_sets
            .sort((a: any, b: any) => a.order_index - b.order_index)
            .map((set: any) => ({
              id: set.id,
              reps: set.reps,
              weight: set.weight,
              duration: set.duration,
              distance: set.distance,
              isCompleted: set.is_completed
            }))
        }))
      })) || [];

      setWorkoutHistory(formattedWorkouts);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      toast({
        title: "Error Loading Workouts",
        description: "Could not load your workout history.",
        variant: "destructive"
      });
    }
  };

  // Fetch workout templates from Supabase
  const fetchTemplates = async () => {
    if (!user || !activeProfile) return;

    try {
      const { data: templatesData, error: templatesError } = await supabase
        .from('workout_templates')
        .select(`
          *,
          template_exercises (*)
        `)
        .eq('user_id', user.id)
        .eq('profile_id', activeProfile.id)
        .order('created_at', { ascending: false });

      if (templatesError) throw templatesError;

      const formattedTemplates: WorkoutTemplate[] = templatesData?.map(template => ({
        id: template.id,
        name: template.name,
        createdFrom: template.created_from,
        createdAt: new Date(template.created_at),
        exercises: template.template_exercises
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((exercise: any) => ({
            exerciseId: exercise.exercise_id,
            exercise: exercise.exercise_data,
            targetSets: exercise.target_sets,
            lastUsedValues: exercise.last_used_values
          }))
      })) || [];

      setWorkoutTemplates(formattedTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error Loading Templates",
        description: "Could not load your workout templates.",
        variant: "destructive"
      });
    }
  };

  // Load data when user or profile changes
  useEffect(() => {
    if (user && activeProfile) {
      setLoading(true);
      Promise.all([fetchWorkouts(), fetchTemplates()]).finally(() => {
        setLoading(false);
      });
    } else {
      setWorkoutHistory([]);
      setWorkoutTemplates([]);
      setCurrentWorkout(null);
      setLoading(false);
    }
  }, [user?.id, activeProfile?.id]);

  // Timer effect for current workout
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

  const startWorkout = (name: string = 'Workout') => {
    const workout: Workout = {
      id: uuidv4(),
      name,
      date: new Date(),
      exercises: [],
      isCompleted: false
    };
    setCurrentWorkout(workout);
    setWorkoutTimer(0);
  };

  const startWorkoutFromTemplate = (template: WorkoutTemplate) => {
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
  };

  const addExercise = (exercise: any) => {
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
  };

  const addSet = (exerciseId: string) => {
    if (!currentWorkout) return;

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
  };

  const updateSet = (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => {
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
  };

  const deleteSet = (exerciseId: string, setId: string) => {
    if (!currentWorkout) return;

    setCurrentWorkout(prev => prev ? {
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, sets: ex.sets.filter(set => set.id !== setId) }
          : ex
      )
    } : null);
  };

  const deleteExercise = (exerciseId: string) => {
    if (!currentWorkout) return;

    setCurrentWorkout(prev => prev ? {
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    } : null);
  };

  const completeWorkout = async () => {
    if (!currentWorkout || !user || !activeProfile) return;

    const completedWorkout = {
      ...currentWorkout,
      isCompleted: true,
      duration: workoutTimer * 1000,
      summary: calculateWorkoutSummary({
        ...currentWorkout,
        duration: workoutTimer * 1000
      })
    };

    try {
      // Save workout to Supabase
      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .insert({
          id: completedWorkout.id,
          user_id: user.id,
          profile_id: activeProfile.id,
          name: completedWorkout.name,
          date: completedWorkout.date.toISOString(),
          duration: completedWorkout.duration,
          is_completed: true,
          summary: completedWorkout.summary
        })
        .select()
        .single();

      if (workoutError) throw workoutError;

      // Save exercises and sets
      for (const [exerciseIndex, exercise] of completedWorkout.exercises.entries()) {
        const { data: exerciseData, error: exerciseError } = await supabase
          .from('workout_exercises')
          .insert({
            id: exercise.id,
            workout_id: completedWorkout.id,
            exercise_id: exercise.exerciseId,
            exercise_data: exercise.exercise,
            order_index: exerciseIndex
          })
          .select()
          .single();

        if (exerciseError) throw exerciseError;

        // Save sets
        for (const [setIndex, set] of exercise.sets.entries()) {
          const { error: setError } = await supabase
            .from('workout_sets')
            .insert({
              id: set.id,
              workout_exercise_id: exercise.id,
              reps: set.reps,
              weight: set.weight,
              duration: set.duration,
              distance: set.distance,
              is_completed: set.isCompleted,
              order_index: setIndex
            });

          if (setError) throw setError;
        }
      }

      setWorkoutHistory(prev => [completedWorkout, ...prev]);
      setCurrentWorkout(null);
      setWorkoutTimer(0);

      toast({
        title: "Workout Completed!",
        description: "Your workout has been saved successfully."
      });

      return completedWorkout;
    } catch (error) {
      console.error('Error saving workout:', error);
      toast({
        title: "Error Saving Workout",
        description: "Could not save your workout. Please try again.",
        variant: "destructive"
      });
    }
  };

  const cancelWorkout = () => {
    setCurrentWorkout(null);
    setWorkoutTimer(0);
  };

  const saveAsTemplate = async (workout: Workout) => {
    if (!user || !activeProfile) return;

    try {
      const template: WorkoutTemplate = {
        id: uuidv4(),
        name: `${workout.name} Template`,
        createdFrom: workout.id,
        createdAt: new Date(),
        exercises: workout.exercises.map(ex => {
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
        })
      };

      // Save template to Supabase
      const { data: templateData, error: templateError } = await supabase
        .from('workout_templates')
        .insert({
          id: template.id,
          user_id: user.id,
          profile_id: activeProfile.id,
          name: template.name,
          created_from: template.createdFrom
        })
        .select()
        .single();

      if (templateError) throw templateError;

      // Save template exercises
      for (const [exerciseIndex, exercise] of template.exercises.entries()) {
        const { error: exerciseError } = await supabase
          .from('template_exercises')
          .insert({
            template_id: template.id,
            exercise_id: exercise.exerciseId,
            exercise_data: exercise.exercise,
            target_sets: exercise.targetSets,
            last_used_values: exercise.lastUsedValues,
            order_index: exerciseIndex
          });

        if (exerciseError) throw exerciseError;
      }

      setWorkoutTemplates(prev => [template, ...prev]);

      toast({
        title: "Template Created!",
        description: `"${template.name}" has been saved to your templates.`
      });

      return template;
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Error Saving Template",
        description: "Could not save your template. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteTemplate = async (templateId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('workout_templates')
        .delete()
        .eq('id', templateId)
        .eq('user_id', user.id);

      if (error) throw error;

      setWorkoutTemplates(prev => prev.filter(t => t.id !== templateId));

      toast({
        title: "Template Deleted",
        description: "The template has been removed from your library."
      });
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error Deleting Template",
        description: "Could not delete the template. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateTemplate = async (updatedTemplate: WorkoutTemplate) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('workout_templates')
        .update({
          name: updatedTemplate.name
        })
        .eq('id', updatedTemplate.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setWorkoutTemplates(prev => 
        prev.map(template => 
          template.id === updatedTemplate.id ? updatedTemplate : template
        )
      );

      toast({
        title: "Template Updated",
        description: "The template has been updated successfully."
      });
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: "Error Updating Template",
        description: "Could not update the template. Please try again.",
        variant: "destructive"
      });
    }
  };

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
    loading,
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
    updateTemplate,
    refetch: () => Promise.all([fetchWorkouts(), fetchTemplates()])
  };
};