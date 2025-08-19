-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settings JSONB DEFAULT '{
    "theme": "system",
    "weightUnit": "kg",
    "measurementUnit": "metric",
    "defaultRestTime": 90
  }'::jsonb
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create workouts table
CREATE TABLE public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER, -- in milliseconds
  is_completed BOOLEAN DEFAULT false,
  summary JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on workouts
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

-- Create workouts policies
CREATE POLICY "Users can manage own workouts" ON public.workouts
  FOR ALL USING (auth.uid() = user_id);

-- Create workout exercises table
CREATE TABLE public.workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE NOT NULL,
  exercise_id TEXT NOT NULL,
  exercise_data JSONB NOT NULL, -- stores the complete exercise object
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on workout exercises
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;

-- Create workout exercises policies
CREATE POLICY "Users can manage workout exercises" ON public.workout_exercises
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workouts w 
      WHERE w.id = workout_id AND w.user_id = auth.uid()
    )
  );

-- Create workout sets table
CREATE TABLE public.workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_exercise_id UUID REFERENCES public.workout_exercises(id) ON DELETE CASCADE NOT NULL,
  reps INTEGER DEFAULT 0,
  weight NUMERIC DEFAULT 0,
  duration INTEGER, -- in seconds
  distance NUMERIC,
  is_completed BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on workout sets
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;

-- Create workout sets policies
CREATE POLICY "Users can manage workout sets" ON public.workout_sets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workout_exercises we 
      JOIN public.workouts w ON w.id = we.workout_id
      WHERE we.id = workout_exercise_id AND w.user_id = auth.uid()
    )
  );

-- Create workout templates table
CREATE TABLE public.workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_from UUID, -- reference to original workout
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on workout templates
ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;

-- Create workout templates policies
CREATE POLICY "Users can manage own templates" ON public.workout_templates
  FOR ALL USING (auth.uid() = user_id);

-- Create template exercises table
CREATE TABLE public.template_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.workout_templates(id) ON DELETE CASCADE NOT NULL,
  exercise_id TEXT NOT NULL,
  exercise_data JSONB NOT NULL,
  target_sets INTEGER NOT NULL,
  last_used_values JSONB,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on template exercises
ALTER TABLE public.template_exercises ENABLE ROW LEVEL SECURITY;

-- Create template exercises policies
CREATE POLICY "Users can manage template exercises" ON public.template_exercises
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workout_templates wt 
      WHERE wt.id = template_id AND wt.user_id = auth.uid()
    )
  );

-- Create measurements table
CREATE TABLE public.measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  weight NUMERIC,
  body_fat NUMERIC,
  muscle_mass NUMERIC,
  chest NUMERIC,
  waist NUMERIC,
  hips NUMERIC,
  biceps NUMERIC,
  thighs NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on measurements
ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;

-- Create measurements policies
CREATE POLICY "Users can manage own measurements" ON public.measurements
  FOR ALL USING (auth.uid() = user_id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    'default'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_workouts_user_id ON public.workouts(user_id);
CREATE INDEX idx_workouts_date ON public.workouts(date DESC);
CREATE INDEX idx_workout_exercises_workout_id ON public.workout_exercises(workout_id);
CREATE INDEX idx_workout_sets_exercise_id ON public.workout_sets(workout_exercise_id);
CREATE INDEX idx_template_exercises_template_id ON public.template_exercises(template_id);
CREATE INDEX idx_measurements_user_date ON public.measurements(user_id, date DESC);