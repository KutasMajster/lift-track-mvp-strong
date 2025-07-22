import { WorkoutLogger } from '@/components/WorkoutLogger';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">LiftTrack</h1>
            <p className="text-muted-foreground">Your personal workout companion</p>
          </div>
          <WorkoutLogger />
        </div>
      </div>
    </div>
  );
};

export default Index;
