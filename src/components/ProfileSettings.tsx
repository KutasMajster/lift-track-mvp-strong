import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfiles } from '@/hooks/useProfiles';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Settings, Palette, Scale, Timer, LogOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';

export const ProfileSettings = () => {
  const navigate = useNavigate();
  const { activeProfile, updateSettings, loading } = useProfiles();
  const { signOut } = useAuth();
  const { setTheme } = useTheme();
  const [restTimeValue, setRestTimeValue] = useState('90');

  // Debug logging to understand the issue
  console.log('ProfileSettings render - loading:', loading, 'activeProfile:', activeProfile);

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });
      navigate('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Logout Error",
        description: "Could not log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!activeProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <p className="text-muted-foreground text-center">No active profile found</p>
        <p className="text-sm text-muted-foreground text-center">Please refresh the page or sign in again</p>
        <Button onClick={handleLogout} variant="outline">
          Sign Out
        </Button>
      </div>
    );
  }

  const handleThemeChange = (theme: 'light' | 'dark') => {
    setTheme(theme);
    updateSettings({ theme });
    toast({
      title: "Theme Updated",
      description: `Theme changed to ${theme}`
    });
  };

  const handleWeightUnitChange = (weightUnit: 'lbs' | 'kg') => {
    updateSettings({ weightUnit });
    toast({
      title: "Weight Unit Updated",
      description: `Weight unit changed to ${weightUnit}`
    });
  };

  const handleMeasurementUnitChange = (measurementUnit: 'imperial' | 'metric') => {
    updateSettings({ measurementUnit });
    toast({
      title: "Measurement Unit Updated",
      description: `Measurement unit changed to ${measurementUnit}`
    });
  };

  // Update rest time value when activeProfile changes
  useEffect(() => {
    if (activeProfile?.settings?.defaultRestTime) {
      setRestTimeValue(activeProfile.settings.defaultRestTime.toString());
    }
  }, [activeProfile]);

  const handleRestTimeChange = (value: string) => {
    setRestTimeValue(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 30 && numValue <= 600) {
      updateSettings({ defaultRestTime: numValue });
      toast({
        title: "Default Rest Time Updated",
        description: `Default rest time changed to ${numValue} seconds`
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Settings className="h-6 w-6" />
          Profile Settings
        </h2>
        <p className="text-muted-foreground">Customize your app experience</p>
      </div>

      {/* Current Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 text-4xl">
              <AvatarFallback>{activeProfile.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{activeProfile.name}</h3>
              <p className="text-sm text-muted-foreground">
                Member since {new Date(activeProfile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select
              value={activeProfile.settings.theme}
              onValueChange={handleThemeChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose your preferred color theme
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Units Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Units & Measurements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Weight Unit</Label>
            <Select
              value={activeProfile.settings.weightUnit}
              onValueChange={handleWeightUnitChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                <SelectItem value="kg">Kilograms (kg)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Measurement System</Label>
            <Select
              value={activeProfile.settings.measurementUnit}
              onValueChange={handleMeasurementUnitChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="imperial">Imperial (inches, feet)</SelectItem>
                <SelectItem value="metric">Metric (centimeters, meters)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Workout Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Workout Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Default Rest Time (seconds)</Label>
            <Input
              type="number"
              min="30"
              max="600"
              step="15"
              value={restTimeValue}
              onChange={(e) => handleRestTimeChange(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Time between sets (30-600 seconds)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Performance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Performance & Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-save Workouts</Label>
              <p className="text-xs text-muted-foreground">
                Automatically save workout progress
              </p>
            </div>
            <Switch checked={true} disabled />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Exercise Timer</Label>
              <p className="text-xs text-muted-foreground">
                Show timer during workouts
              </p>
            </div>
            <Switch checked={true} disabled />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Progress Analytics</Label>
              <p className="text-xs text-muted-foreground">
                Track and analyze workout data
              </p>
            </div>
            <Switch checked={true} disabled />
          </div>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card>
        <CardContent className="pt-6">
          <Button 
            onClick={handleLogout} 
            variant="destructive" 
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};