import { useState } from 'react';
import { WorkoutLogger } from '@/components/WorkoutLogger';
import { WorkoutHistory } from '@/components/WorkoutHistory';
import { ExerciseLibrary } from '@/components/ExerciseLibrary';
import { UserStats } from '@/components/UserStats';
import { Templates } from '@/components/Templates';
import { Measurements } from '@/components/Measurements';
import { ProfileSettings } from '@/components/ProfileSettings';
import { ProfileSelector } from '@/components/ProfileSelector';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useWorkout } from '@/hooks/useWorkout';
import { useProfiles } from '@/hooks/useProfiles';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('workout');
  const { workoutHistory, workoutTemplates } = useWorkout();
  const { activeProfile, profiles } = useProfiles();
  const [showProfileSelector, setShowProfileSelector] = useState(!activeProfile || profiles.length === 0);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Welcome to Iron Gains</h2>
              <p className="text-muted-foreground">Your personal workout companion</p>
            </div>
            <UserStats workoutHistory={workoutHistory} />
            <Templates workoutTemplates={workoutTemplates} />
          </div>
        );
      case 'workout':
        return <WorkoutLogger />;
      case 'history':
        return <WorkoutHistory />;
      case 'measure':
        return <Measurements />;
      case 'library':
        return <ExerciseLibrary />;
      case 'profile':
        return <ProfileSettings />;
      default:
        return <WorkoutLogger />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">Iron Gains</h1>
              {activeProfile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProfileSelector(true)}
                  className="flex items-center gap-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{activeProfile.avatar}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{activeProfile.name}</span>
                </Button>
              )}
            </div>
            <p className="text-muted-foreground">Your personal workout companion</p>
          </div>
          {renderContent()}
        </div>
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <ProfileSelector 
        isOpen={showProfileSelector} 
        onClose={() => setShowProfileSelector(false)} 
      />
    </div>
  );
};

export default Index;
