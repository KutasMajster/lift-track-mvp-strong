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
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
    instructions: 'Set bench to 30-45 degree incline. Lower weight to upper chest, press up while maintaining control. Targets upper chest fibers.'
  },
  {
    id: 'dumbbell-flyes',
    name: 'Dumbbell Flyes',
    category: ExerciseCategory.CHEST,
    equipment: [Equipment.DUMBBELL],
    muscleGroups: [MuscleGroup.CHEST],
    instructions: 'Lie on bench with dumbbells above chest. Lower in wide arc with slight elbow bend, feel stretch in chest, then bring back up.'
  },
  {
    id: 'push-ups',
    name: 'Push-ups',
    category: ExerciseCategory.CHEST,
    equipment: [Equipment.BODYWEIGHT],
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS],
    instructions: 'Start in plank position, hands slightly wider than shoulders. Lower body until chest nearly touches ground, push back up.'
  },

  // Back
  {
    id: 'deadlift',
    name: 'Deadlift',
    category: ExerciseCategory.BACK,
    equipment: [Equipment.BARBELL],
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES],
    instructions: 'Stand with feet hip-width apart, bar over mid-foot. Hinge at hips, keep bar close to body throughout movement. Drive through heels to stand.'
  },
  {
    id: 'pull-ups',
    name: 'Pull-ups',
    category: ExerciseCategory.BACK,
    equipment: [Equipment.BODYWEIGHT],
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    instructions: 'Hang from bar with overhand grip, hands shoulder-width apart. Pull body up until chin clears bar, lower with control.'
  },
  {
    id: 'barbell-rows',
    name: 'Barbell Rows',
    category: ExerciseCategory.BACK,
    equipment: [Equipment.BARBELL],
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    instructions: 'Hinge at hips, maintain flat back. Pull bar to lower chest/upper abdomen, squeeze shoulder blades together at top.'
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    category: ExerciseCategory.BACK,
    equipment: [Equipment.MACHINE, Equipment.CABLE],
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    instructions: 'Sit with thighs secured under pads. Pull bar down to upper chest, lean slightly back, focus on using lats.'
  },

  // Legs
  {
    id: 'squat',
    name: 'Squat',
    category: ExerciseCategory.LEGS,
    equipment: [Equipment.BARBELL],
    muscleGroups: [MuscleGroup.QUADRICEPS, MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
    instructions: 'Stand with feet shoulder-width apart. Descend by bending at hips and knees, keep chest up, go until thighs parallel to floor.'
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    category: ExerciseCategory.LEGS,
    equipment: [Equipment.MACHINE],
    muscleGroups: [MuscleGroup.QUADRICEPS, MuscleGroup.GLUTES],
    instructions: 'Sit in leg press machine, feet on platform shoulder-width apart. Lower weight until knees at 90 degrees, press through heels.'
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    category: ExerciseCategory.LEGS,
    equipment: [Equipment.BARBELL, Equipment.DUMBBELL],
    muscleGroups: [MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES],
    instructions: 'Stand holding weight, feet hip-width apart. Hinge at hips, lower weight while keeping legs mostly straight. Feel stretch in hamstrings.'
  },
  {
    id: 'walking-lunges',
    name: 'Walking Lunges',
    category: ExerciseCategory.LEGS,
    equipment: [Equipment.BODYWEIGHT, Equipment.DUMBBELL],
    muscleGroups: [MuscleGroup.QUADRICEPS, MuscleGroup.GLUTES],
    instructions: 'Step forward into lunge position, lower back knee toward ground. Push off front foot to step into next lunge.'
  },

  // Shoulders
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    category: ExerciseCategory.SHOULDERS,
    equipment: [Equipment.BARBELL, Equipment.DUMBBELL],
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
    instructions: 'Stand with feet shoulder-width apart. Press weight overhead in straight line, keep core tight, avoid arching back.'
  },
  {
    id: 'lateral-raises',
    name: 'Lateral Raises',
    category: ExerciseCategory.SHOULDERS,
    equipment: [Equipment.DUMBBELL],
    muscleGroups: [MuscleGroup.SHOULDERS],
    instructions: 'Stand with dumbbells at sides. Raise arms out to sides until parallel to floor, slight bend in elbows, lower with control.'
  },

  // Arms
  {
    id: 'bicep-curls',
    name: 'Bicep Curls',
    category: ExerciseCategory.ARMS,
    equipment: [Equipment.DUMBBELL, Equipment.BARBELL],
    muscleGroups: [MuscleGroup.BICEPS],
    instructions: 'Stand with weights in hands, elbows at sides. Curl weights up by flexing biceps, lower slowly without swinging.'
  },
  {
    id: 'tricep-dips',
    name: 'Tricep Dips',
    category: ExerciseCategory.ARMS,
    equipment: [Equipment.BODYWEIGHT],
    muscleGroups: [MuscleGroup.TRICEPS],
    instructions: 'Support body on parallel bars or bench edge. Lower body by bending elbows, push back up using triceps.'
  }
];