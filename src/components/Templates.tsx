import { useState } from 'react';
import { useWorkout } from '@/hooks/useWorkout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Play, Edit, Trash2, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { WorkoutTemplate } from '@/types/exercise';
import { TemplateEditor } from './TemplateEditor';

interface TemplatesProps {
  workoutTemplates: WorkoutTemplate[];
  onDataChange?: () => void;
}

export const Templates = ({ workoutTemplates, onDataChange }: TemplatesProps) => {
  const { 
    startWorkoutFromTemplate,
    deleteTemplate,
    updateTemplate
  } = useWorkout();
  
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | null>(null);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);

  const handleStartFromTemplate = (template: WorkoutTemplate) => {
    startWorkoutFromTemplate(template);
    toast({
      title: "Workout Started!",
      description: `Started "${template.name}" from template.`
    });
  };

  const handleDeleteTemplate = (template: WorkoutTemplate) => {
    deleteTemplate(template.id);
    onDataChange?.();
    toast({
      title: "Template Deleted",
      description: `"${template.name}" template has been deleted.`
    });
  };

  const handleEditTemplate = (template: WorkoutTemplate) => {
    setEditingTemplate(template);
    setShowTemplateEditor(true);
  };

  const handleUpdateTemplate = (template: WorkoutTemplate) => {
    updateTemplate(template);
    onDataChange?.();
    toast({
      title: "Template Updated",
      description: `"${template.name}" has been updated.`
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <BookOpen className="h-6 w-6" />
          Workout Templates
        </h2>
        <p className="text-muted-foreground">Quick start your favorite workouts</p>
      </div>

      {workoutTemplates.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No workout templates saved</p>
            <p className="text-sm text-muted-foreground mt-1">
              Save a completed workout as a template to reuse it later
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {workoutTemplates.map(template => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(template.createdAt)}
                      </div>
                      <Badge variant="secondary">
                        {template.exercises.length} exercises
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartFromTemplate(template)}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTemplate(template)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {template.exercises.map((exercise, index) => (
                    <div key={`${exercise.exerciseId}-${index}`} className="flex items-center justify-between text-sm">
                      <span>{exercise.exercise.name}</span>
                      <Badge variant="outline">{exercise.targetSets} sets</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TemplateEditor
        template={editingTemplate}
        isOpen={showTemplateEditor}
        onClose={() => {
          setShowTemplateEditor(false);
          setEditingTemplate(null);
        }}
        onSave={handleUpdateTemplate}
        onDelete={(templateId) => {
          deleteTemplate(templateId);
          setShowTemplateEditor(false);
          setEditingTemplate(null);
          onDataChange?.();
          toast({
            title: "Template Deleted",
            description: "Template has been deleted."
          });
        }}
      />
    </div>
  );
};