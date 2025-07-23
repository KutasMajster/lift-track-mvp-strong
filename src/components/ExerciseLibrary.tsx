import { ExerciseDatabase } from './ExerciseDatabase';
import { BookOpen } from 'lucide-react';

export const ExerciseLibrary = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <BookOpen className="h-6 w-6" />
          Exercise Library
        </h2>
        <p className="text-muted-foreground">Browse and learn about different exercises</p>
      </div>
      
      <ExerciseDatabase 
        onAddExercise={() => {}} 
        isInWorkout={false}
      />
    </div>
  );
};