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
  },

  // Core
  {
    id: 'plank',
    name: 'Plank',
    category: ExerciseCategory.CORE,
    equipment: [Equipment.BODYWEIGHT],
    muscleGroups: [MuscleGroup.CORE],
    instructions: 'Hold forearm plank position, keep body straight from head to heels, engage core throughout.'
  },
  {
    id: 'crunches',
    name: 'Crunches',
    category: ExerciseCategory.CORE,
    equipment: [Equipment.BODYWEIGHT],
    muscleGroups: [MuscleGroup.CORE],
    instructions: 'Lie on back, knees bent, hands behind head. Lift shoulders off ground using core muscles, avoid pulling on neck.'
  },
  {
    id: 'bicycle-crunches',
    name: 'Bicycle Crunches',
    category: ExerciseCategory.CORE,
    equipment: [Equipment.BODYWEIGHT],
    muscleGroups: [MuscleGroup.CORE],
    instructions: 'Lie on back, hands behind head. Alternate bringing knee to opposite elbow in cycling motion.'
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    category: ExerciseCategory.CORE,
    equipment: [Equipment.BODYWEIGHT],
    muscleGroups: [MuscleGroup.CORE],
    instructions: 'Start in plank position. Rapidly alternate bringing knees to chest in running motion, keep core tight.'
  },
  {
    id: 'russian-twists',
    name: 'Russian Twists',
    category: ExerciseCategory.CORE,
    equipment: [Equipment.BODYWEIGHT],
    muscleGroups: [MuscleGroup.CORE],
    instructions: 'Sit with knees bent, lean back slightly. Rotate torso side to side while keeping core engaged.'
  },

  // Cardio
  {
    id: 'running',
    name: 'Running',
    category: ExerciseCategory.CARDIO,
    equipment: [Equipment.BODYWEIGHT],
    muscleGroups: [MuscleGroup.QUADRICEPS, MuscleGroup.HAMSTRINGS, MuscleGroup.CALVES],
    instructions: 'Maintain steady pace, land on midfoot, keep upright posture. Track time and distance.'
  },
  {
    id: 'cycling',
    name: 'Cycling',
    category: ExerciseCategory.CARDIO,
    equipment: [Equipment.MACHINE],
    muscleGroups: [MuscleGroup.QUADRICEPS, MuscleGroup.HAMSTRINGS, MuscleGroup.CALVES],
    instructions: 'Maintain steady cadence, adjust resistance as needed. Track time, distance, and intensity.'
  },
  {
    id: 'jump-rope',
    name: 'Jump Rope',
    category: ExerciseCategory.CARDIO,
    equipment: [Equipment.BODYWEIGHT],
    muscleGroups: [MuscleGroup.CALVES, MuscleGroup.SHOULDERS],
    instructions: 'Jump with minimal knee bend, land on balls of feet. Maintain rhythm and track duration.'
  },
  {
    id: 'burpees',
    name: 'Burpees',
    category: ExerciseCategory.CARDIO,
    equipment: [Equipment.BODYWEIGHT],
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.CORE, MuscleGroup.QUADRICEPS],
    instructions: 'Drop to squat, kick back to plank, do push-up, jump feet back, explosive jump up. Count reps and time.'
  },
  {
    id: 'high-knees',
    name: 'High Knees',
    category: ExerciseCategory.CARDIO,
    equipment: [Equipment.BODYWEIGHT],
    muscleGroups: [MuscleGroup.QUADRICEPS, MuscleGroup.CORE],
    instructions: 'Run in place bringing knees to waist level. Maintain quick tempo and track duration.'
  }
];