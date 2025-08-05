import { useState, useEffect } from 'react';
import { WorkoutLogger } from '@/components/WorkoutLogger';
import { WorkoutHistory } from '@/components/WorkoutHistory';
import { ExerciseLibrary } from '@/components/ExerciseLibrary';
import { UserStats } from '@/components/UserStats';
import { Templates } from '@/components/Templates';
import { Measurements } from '@/components/Measurements';
import { ProfileSettings } from '@/components/ProfileSettings';
import { ProfileSelector } from '@/components/ProfileSelector';
import { GlobalProfileButton } from '@/components/GlobalProfileButton';
import { RefreshNotificationDialog } from '@/components/RefreshNotificationDialog';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useWorkout } from '@/hooks/useWorkout';
import { useProfiles } from '@/hooks/useProfiles';
import { useRefreshNotification } from '@/hooks/useRefreshNotification';
import { useTheme } from 'next-themes';

const Index = () => {
  const [activeTab, setActiveTab] = useState('workout');
  const { workoutHistory, workoutTemplates } = useWorkout();
  const { activeProfile, profiles } = useProfiles();
  const { setTheme } = useTheme();
  const { showRefreshDialog, showRefreshNotification, hideRefreshNotification, refreshApp } = useRefreshNotification();
  const [showProfileSelector, setShowProfileSelector] = useState(!activeProfile || profiles.length === 0);

  // Apply theme when profile changes
  useEffect(() => {
    if (activeProfile?.settings.theme) {
      setTheme(activeProfile.settings.theme);
    }
  }, [activeProfile?.settings.theme, setTheme]);

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
            <Templates workoutTemplates={workoutTemplates} onDataChange={showRefreshNotification} />
          </div>
        );
      case 'workout':
        return <WorkoutLogger onDataChange={showRefreshNotification} />;
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
      <GlobalProfileButton onClick={() => setShowProfileSelector(true)} />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Iron Gains</h1>
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
      <RefreshNotificationDialog
        isOpen={showRefreshDialog}
        onClose={hideRefreshNotification}
        onRefresh={refreshApp}
      />
    </div>
  );
};

export default Index;
