import { useState, useEffect } from 'react';
import { useProfiles } from '@/hooks/useProfiles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings as SettingsIcon, Palette, Scale, Timer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';

export const Settings = () => {
  const { activeProfile, updateSettings, loading } = useProfiles();
  const { setTheme } = useTheme();
  const [restTimeValue, setRestTimeValue] = useState('90');

  // Update rest time value when activeProfile changes
  useEffect(() => {
    if (activeProfile?.settings?.defaultRestTime) {
      setRestTimeValue(activeProfile.settings.defaultRestTime.toString());
    } else {
      setRestTimeValue('90');
    }
  }, [activeProfile?.settings?.defaultRestTime]);

  if (loading || !activeProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  // Ensure settings exist with defaults
  const settings = activeProfile.settings || {
    theme: 'light',
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
        <p className="text-muted-foreground">Customize your preferences</p>
      </div>

      {/* Color Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Theme
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select
              value={settings?.theme || 'light'}
              onValueChange={handleThemeChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light (White)</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose your preferred color theme
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Weight Units */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Weight Units
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                <SelectItem value="lbs">Pounds (lbs)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose your preferred weight unit
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Default Rest Time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Default Rest Time
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Rest Time (seconds)</Label>
            <Input
              type="number"
              min="30"
              max="600"
              step="15"
              value={restTimeValue}
              onChange={(e) => handleRestTimeChange(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Default time between sets (30-600 seconds)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};