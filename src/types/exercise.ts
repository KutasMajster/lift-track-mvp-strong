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

export interface WorkoutSummary {
  totalSets: number;
  totalReps: number;
  totalWeight: number;
  exercisesCompleted: number;
  duration: number;
}

export interface Workout {
  id: string;
  name: string;
  date: Date;
  exercises: WorkoutExercise[];
  duration?: number;
  isCompleted: boolean;
  summary?: WorkoutSummary;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: {
    exerciseId: string;
    exercise: Exercise;
    targetSets: number;
  }[];
  createdFrom?: string; // workout id it was created from
  createdAt: Date;
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