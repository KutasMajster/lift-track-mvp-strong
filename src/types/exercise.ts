export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  equipment: Equipment[];
  instructions?: string;
  muscleGroups: MuscleGroup[];
}

export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  isCompleted: boolean;
  restTime?: number;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  sets: WorkoutSet[];
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  date: Date;
  exercises: WorkoutExercise[];
  duration?: number;
  isCompleted: boolean;
}

export enum ExerciseCategory {
  CHEST = 'chest',
  BACK = 'back',
  SHOULDERS = 'shoulders',
  LEGS = 'legs',
  ARMS = 'arms',
  CORE = 'core',
  CARDIO = 'cardio'
}

export enum Equipment {
  BARBELL = 'barbell',
  DUMBBELL = 'dumbbell',
  BODYWEIGHT = 'bodyweight',
  MACHINE = 'machine',
  CABLE = 'cable'
}

export enum MuscleGroup {
  CHEST = 'chest',
  TRICEPS = 'triceps',
  SHOULDERS = 'shoulders',
  BACK = 'back',
  BICEPS = 'biceps',
  QUADRICEPS = 'quadriceps',
  HAMSTRINGS = 'hamstrings',
  GLUTES = 'glutes',
  CALVES = 'calves',
  CORE = 'core'
}