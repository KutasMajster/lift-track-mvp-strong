import { useState } from 'react';
import { WorkoutLogger } from '@/components/WorkoutLogger';
import { WorkoutHistory } from '@/components/WorkoutHistory';
import { ExerciseLibrary } from '@/components/ExerciseLibrary';
import { BottomNavigation } from '@/components/BottomNavigation';

const Index = () => {
  const [activeTab, setActiveTab] = useState('workout');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Welcome to Iron Gains</h2>
            <p className="text-muted-foreground">Your personal workout companion</p>
          </div>
        );
      case 'workout':
        return <WorkoutLogger />;
      case 'history':
        return <WorkoutHistory />;
      case 'library':
        return <ExerciseLibrary />;
      case 'profile':
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      default:
        return <WorkoutLogger />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Iron Gains</h1>
            <p className="text-muted-foreground">Your personal workout companion</p>
          </div>
          {renderContent()}
        </div>
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
