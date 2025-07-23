import { Exercise } from '@/types/exercise';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ExerciseDetailProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  onAddExercise?: (exercise: Exercise) => void;
  showAddButton?: boolean;
}

export const ExerciseDetail = ({ 
  exercise, 
  isOpen, 
  onClose, 
  onAddExercise,
  showAddButton = false 
}: ExerciseDetailProps) => {
  if (!exercise) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">{exercise.name}</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          <div>
            <h3 className="font-semibold mb-2">Category</h3>
            <Badge variant="secondary" className="capitalize">
              {exercise.category}
            </Badge>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Equipment</h3>
            <div className="flex flex-wrap gap-1">
              {exercise.equipment.map((eq) => (
                <Badge key={eq} variant="outline" className="capitalize">
                  {eq.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Target Muscles</h3>
            <div className="flex flex-wrap gap-1">
              {exercise.muscleGroups.map((muscle) => (
                <Badge key={muscle} variant="default" className="capitalize">
                  {muscle}
                </Badge>
              ))}
            </div>
          </div>

          {exercise.instructions && (
            <div>
              <h3 className="font-semibold mb-2">Instructions</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {exercise.instructions}
              </p>
            </div>
          )}

          {showAddButton && onAddExercise && (
            <Button 
              onClick={() => {
                onAddExercise(exercise);
                onClose();
              }}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to Workout
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};