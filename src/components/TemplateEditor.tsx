import { useState, useEffect } from 'react';
import { WorkoutTemplate } from '@/types/exercise';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ExerciseDatabase } from './ExerciseDatabase';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Exercise } from '@/types/exercise';

interface TemplateEditorProps {
  template: WorkoutTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: WorkoutTemplate) => void;
  onDelete: (templateId: string) => void;
}

export const TemplateEditor = ({
  template,
  isOpen,
  onClose,
  onSave,
  onDelete
}: TemplateEditorProps) => {
  const [editedTemplate, setEditedTemplate] = useState<WorkoutTemplate | null>(template);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);

  // Sync editedTemplate with template prop changes
  useEffect(() => {
    setEditedTemplate(template);
  }, [template]);

  if (!template || !editedTemplate) return null;

  const handleSave = () => {
    if (editedTemplate) {
      onSave(editedTemplate);
      onClose();
    }
  };

  const handleDelete = () => {
    onDelete(template.id);
    onClose();
  };

  const handleNameChange = (name: string) => {
    setEditedTemplate(prev => prev ? { ...prev, name } : null);
  };

  const handleAddExercise = (exercise: Exercise) => {
    setEditedTemplate(prev => prev ? {
      ...prev,
      exercises: [...prev.exercises, {
        exerciseId: exercise.id,
        exercise,
        targetSets: 3
      }]
    } : null);
    setShowExerciseSelector(false);
  };

  const handleRemoveExercise = (index: number) => {
    setEditedTemplate(prev => prev ? {
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    } : null);
  };

  const handleSetCountChange = (index: number, targetSets: number) => {
    setEditedTemplate(prev => prev ? {
      ...prev,
      exercises: prev.exercises.map((ex, i) => 
        i === index ? { ...ex, targetSets: Math.max(1, targetSets) } : ex
      )
    } : null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              value={editedTemplate.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter template name"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Exercises</h3>
              <Button
                onClick={() => setShowExerciseSelector(true)}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Exercise
              </Button>
            </div>

            {editedTemplate.exercises.map((ex, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{ex.exercise.name}</h4>
                  <div className="flex gap-1 mt-1">
                    {ex.exercise.muscleGroups.map(muscle => (
                      <Badge key={muscle} variant="secondary" className="text-xs capitalize">
                        {muscle}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSetCountChange(index, ex.targetSets - 1)}
                    disabled={ex.targetSets <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="min-w-[2rem] text-center">{ex.targetSets}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSetCountChange(index, ex.targetSets + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveExercise(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            {editedTemplate.exercises.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No exercises added yet. Click "Add Exercise" to get started.
              </p>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="destructive" onClick={handleDelete}>
              Delete Template
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        <Dialog open={showExerciseSelector} onOpenChange={setShowExerciseSelector}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Exercise</DialogTitle>
            </DialogHeader>
            <ExerciseDatabase
              onAddExercise={handleAddExercise}
              isInWorkout={true}
            />
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};