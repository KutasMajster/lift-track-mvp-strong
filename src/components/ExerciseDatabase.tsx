import { useState } from 'react';
import { EXERCISES } from '@/data/exercises';
import { Exercise, ExerciseCategory } from '@/types/exercise';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';

interface ExerciseDatabaseProps {
  onAddExercise: (exercise: Exercise) => void;
  isInWorkout: boolean;
}

export const ExerciseDatabase = ({ onAddExercise, isInWorkout }: ExerciseDatabaseProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');

  const filteredExercises = EXERCISES.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Object.values(ExerciseCategory);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Badge>
          {categories.map(category => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer capitalize"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {filteredExercises.map(exercise => (
          <Card key={exercise.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{exercise.name}</CardTitle>
                {isInWorkout && (
                  <Button 
                    size="sm" 
                    onClick={() => onAddExercise(exercise)}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <CardDescription className="text-xs">
                {exercise.equipment.join(', ')} • {exercise.muscleGroups.join(', ')}
              </CardDescription>
            </CardHeader>
            {exercise.instructions && (
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">{exercise.instructions}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};