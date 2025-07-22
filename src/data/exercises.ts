import { Exercise, ExerciseCategory, Equipment, MuscleGroup } from '@/types/exercise';

export const EXERCISES: Exercise[] = [
  // Chest
  {
    id: 'bench-press',
    name: 'Bench Press',
    category: ExerciseCategory.CHEST,
    equipment: [Equipment.BARBELL],
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS],
    instructions: 'Lie on bench, lower bar to chest, press up explosively'
  },
  {
    id: 'incline-bench-press',
    name: 'Incline Bench Press',
    category: ExerciseCategory.CHEST,
    equipment: [Equipment.BARBELL, Equipment.DUMBBELL],
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS]
  },
  {
    id: 'dumbbell-flyes',
    name: 'Dumbbell Flyes',
    category: ExerciseCategory.CHEST,
    equipment: [Equipment.DUMBBELL],
    muscleGroups: [MuscleGroup.CHEST]
  },
  {
    id: 'push-ups',
    name: 'Push-ups',
    category: ExerciseCategory.CHEST,
    equipment: [Equipment.BODYWEIGHT],
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS]
  },

  // Back
  {
    id: 'deadlift',
    name: 'Deadlift',
    category: ExerciseCategory.BACK,
    equipment: [Equipment.BARBELL],
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES],
    instructions: 'Hip hinge movement, keep bar close to body'
  },
  {
    id: 'pull-ups',
    name: 'Pull-ups',
    category: ExerciseCategory.BACK,
    equipment: [Equipment.BODYWEIGHT],
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS]
  },
  {
    id: 'barbell-rows',
    name: 'Barbell Rows',
    category: ExerciseCategory.BACK,
    equipment: [Equipment.BARBELL],
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS]
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    category: ExerciseCategory.BACK,
    equipment: [Equipment.MACHINE, Equipment.CABLE],
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS]
  },

  // Legs
  {
    id: 'squat',
    name: 'Squat',
    category: ExerciseCategory.LEGS,
    equipment: [Equipment.BARBELL],
    muscleGroups: [MuscleGroup.QUADRICEPS, MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
    instructions: 'Descend by bending at hips and knees, keep chest up'
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    category: ExerciseCategory.LEGS,
    equipment: [Equipment.MACHINE],
    muscleGroups: [MuscleGroup.QUADRICEPS, MuscleGroup.GLUTES]
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    category: ExerciseCategory.LEGS,
    equipment: [Equipment.BARBELL, Equipment.DUMBBELL],
    muscleGroups: [MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES]
  },
  {
    id: 'walking-lunges',
    name: 'Walking Lunges',
    category: ExerciseCategory.LEGS,
    equipment: [Equipment.BODYWEIGHT, Equipment.DUMBBELL],
    muscleGroups: [MuscleGroup.QUADRICEPS, MuscleGroup.GLUTES]
  },

  // Shoulders
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    category: ExerciseCategory.SHOULDERS,
    equipment: [Equipment.BARBELL, Equipment.DUMBBELL],
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS]
  },
  {
    id: 'lateral-raises',
    name: 'Lateral Raises',
    category: ExerciseCategory.SHOULDERS,
    equipment: [Equipment.DUMBBELL],
    muscleGroups: [MuscleGroup.SHOULDERS]
  },

  // Arms
  {
    id: 'bicep-curls',
    name: 'Bicep Curls',
    category: ExerciseCategory.ARMS,
    equipment: [Equipment.DUMBBELL, Equipment.BARBELL],
    muscleGroups: [MuscleGroup.BICEPS]
  },
  {
    id: 'tricep-dips',
    name: 'Tricep Dips',
    category: ExerciseCategory.ARMS,
    equipment: [Equipment.BODYWEIGHT],
    muscleGroups: [MuscleGroup.TRICEPS]
  }
];