import { useProfiles } from '@/hooks/useProfiles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Settings, Palette, Scale, Ruler } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const ProfileSettings = () => {
  const { activeProfile, updateSettings } = useProfiles();

  if (!activeProfile) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No active profile selected</p>
      </div>
    );
  }

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
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
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose your preferred theme or sync with system settings
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
    </div>
  );
};