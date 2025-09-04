import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfiles } from '@/hooks/useProfiles';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings as SettingsIcon, Palette, Scale, Timer, LogOut, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';

export const Settings = () => {
  const navigate = useNavigate();
  const { activeProfile, updateSettings, loading } = useProfiles();
  const { signOut } = useAuth();
  const { setTheme } = useTheme();
  const [restTimeValue, setRestTimeValue] = useState('90');

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

  if (loading || !activeProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">
          {loading ? 'Loading settings...' : 'Loading profile...'}
        </p>
      </div>
    );
  }

  // Ensure settings exist with defaults
  const settings = activeProfile.settings || {
    theme: 'system',
    weightUnit: 'kg',
    measurementUnit: 'metric',
    defaultRestTime: 90
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
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
    if (settings?.defaultRestTime) {
      setRestTimeValue(settings.defaultRestTime.toString());
    } else {
      setRestTimeValue('90');
    }
  }, [settings?.defaultRestTime]);

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
          <SettingsIcon className="h-6 w-6" />
          Settings
        </h2>
        <p className="text-muted-foreground">Customize your app experience</p>
      </div>

      {/* Current User */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-4xl">
              {activeProfile.avatar && activeProfile.avatar !== 'default' ? activeProfile.avatar : '💪'}
            </div>
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
              value={settings?.theme || 'system'}
              onValueChange={handleThemeChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose your preferred color theme (System follows your device settings)
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
              value={settings?.weightUnit || 'kg'}
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
              value={settings?.measurementUnit || 'metric'}
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