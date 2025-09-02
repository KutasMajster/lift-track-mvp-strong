import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkoutLogger } from '@/components/WorkoutLogger';
import { WorkoutHistory } from '@/components/WorkoutHistory';
import { ExerciseLibrary } from '@/components/ExerciseLibrary';
import { UserStats } from '@/components/UserStats';
import { Templates } from '@/components/Templates';
import { Measurements } from '@/components/Measurements';
import { Settings } from '@/components/Settings';
import { ProfileSelector } from '@/components/ProfileSelector';
import { GlobalProfileButton } from '@/components/GlobalProfileButton';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useWorkout } from '@/hooks/useWorkout';
import { useProfiles } from '@/hooks/useProfiles';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from 'next-themes';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('workout');
  const { workoutHistory, workoutTemplates } = useWorkout();
  const { activeProfile, profiles } = useProfiles();
  const { setTheme } = useTheme();
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Apply theme when profile changes and handle profile selector visibility
  useEffect(() => {
    if (activeProfile?.settings.theme) {
      setTheme(activeProfile.settings.theme);
    }
    
    // Show profile selector if no active profile or no profiles exist
    if (!activeProfile || profiles.length === 0) {
      setShowProfileSelector(true);
    }
  }, [activeProfile?.settings.theme, activeProfile, profiles.length, setTheme]);

  // Listen for navigation events from WorkoutSummary
  useEffect(() => {
    const handleNavigateToHistory = () => {
      setActiveTab('history');
    };

    window.addEventListener('navigateToHistory', handleNavigateToHistory);
    return () => window.removeEventListener('navigateToHistory', handleNavigateToHistory);
  }, []);

  // Force re-render when workout history or templates change
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [workoutHistory.length, workoutTemplates.length, workoutTemplates]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Welcome to Iron Gains</h2>
              <p className="text-muted-foreground">Your personal workout companion</p>
            </div>
            <UserStats key={refreshKey} workoutHistory={workoutHistory} />
            <Templates key={`templates-${refreshKey}`} workoutTemplates={workoutTemplates} />
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
      case 'settings':
        return <Settings />;
      default:
        return <WorkoutLogger />;
    }
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

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
    </div>
  );
};

export default Index;
