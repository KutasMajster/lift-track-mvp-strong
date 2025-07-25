import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ruler, Plus, TrendingUp, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface Measurement {
  id: string;
  type: string;
  value: number;
  unit: string;
  date: Date;
  notes?: string;
}

export interface MeasurementType {
  id: string;
  name: string;
  unit: string;
  category: 'body' | 'performance';
}

const MEASUREMENT_TYPES: MeasurementType[] = [
  { id: 'weight', name: 'Weight', unit: 'lbs', category: 'body' },
  { id: 'body_fat', name: 'Body Fat %', unit: '%', category: 'body' },
  { id: 'muscle_mass', name: 'Muscle Mass', unit: 'lbs', category: 'body' },
  { id: 'chest', name: 'Chest', unit: 'in', category: 'body' },
  { id: 'bicep', name: 'Bicep', unit: 'in', category: 'body' },
  { id: 'waist', name: 'Waist', unit: 'in', category: 'body' },
  { id: 'thigh', name: 'Thigh', unit: 'in', category: 'body' },
  { id: 'neck', name: 'Neck', unit: 'in', category: 'body' },
  { id: 'forearm', name: 'Forearm', unit: 'in', category: 'body' }
];

const MEASUREMENTS_STORAGE_KEY = 'iron-gains-measurements';

export const Measurements = () => {
  const [measurements, setMeasurements] = useState<Measurement[]>(() => {
    const saved = localStorage.getItem(MEASUREMENTS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedType, setSelectedType] = useState<MeasurementType>(MEASUREMENT_TYPES[0]);
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');

  // Persist measurements to localStorage
  useEffect(() => {
    localStorage.setItem(MEASUREMENTS_STORAGE_KEY, JSON.stringify(measurements));
  }, [measurements]);

  const handleAddMeasurement = () => {
    if (!value || parseFloat(value) <= 0) {
      toast({
        title: "Invalid Value",
        description: "Please enter a valid positive number.",
        variant: "destructive"
      });
      return;
    }

    const measurement: Measurement = {
      id: `${Date.now()}-${Math.random()}`,
      type: selectedType.id,
      value: parseFloat(value),
      unit: selectedType.unit,
      date: new Date(),
      notes: notes.trim() || undefined
    };

    setMeasurements(prev => [measurement, ...prev]);
    setValue('');
    setNotes('');
    
    toast({
      title: "Measurement Added!",
      description: `${selectedType.name}: ${value} ${selectedType.unit}`
    });
  };

  const getLatestMeasurement = (type: string) => {
    return measurements
      .filter(m => m.type === type)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  };

  const getMeasurementHistory = (type: string) => {
    return measurements
      .filter(m => m.type === type)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateProgress = (type: string) => {
    const history = getMeasurementHistory(type);
    if (history.length < 2) return null;
    
    const latest = history[0];
    const previous = history[1];
    const diff = latest.value - previous.value;
    const percentage = ((diff / previous.value) * 100);
    
    return {
      diff,
      percentage,
      isPositive: diff > 0
    };
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Ruler className="h-6 w-6" />
          Body Measurements
        </h2>
        <p className="text-muted-foreground">Track your body composition and progress</p>
      </div>

      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add">Add Measurement</TabsTrigger>
          <TabsTrigger value="history">History & Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-6">
          {/* Current Stats Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Current Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {MEASUREMENT_TYPES.map(type => {
                  const latest = getLatestMeasurement(type.id);
                  const progress = calculateProgress(type.id);
                  
                  return (
                    <div key={type.id} className="text-center p-3 border rounded-lg">
                      <div className="font-medium text-sm">{type.name}</div>
                      {latest ? (
                        <>
                          <div className="text-xl font-bold">
                            {latest.value} {type.unit}
                          </div>
                          {progress && (
                            <div className={`text-xs flex items-center justify-center gap-1 ${
                              progress.isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                              <TrendingUp className="h-3 w-3" />
                              {progress.isPositive ? '+' : ''}{progress.diff.toFixed(1)} {type.unit}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {formatDate(latest.date)}
                          </div>
                        </>
                      ) : (
                        <div className="text-muted-foreground text-sm">No data</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                New Measurement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Measurement Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {MEASUREMENT_TYPES.map(type => (
                    <Button
                      key={type.id}
                      variant={selectedType.id === type.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(type)}
                      className="justify-start"
                    >
                      {type.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="value">Value ({selectedType.unit})</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder={`Enter ${selectedType.name.toLowerCase()}`}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    placeholder="Add notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleAddMeasurement} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Measurement
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {measurements.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Ruler className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No measurements recorded yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add your first measurement to start tracking progress
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {MEASUREMENT_TYPES.map(type => {
                const history = getMeasurementHistory(type.id);
                if (history.length === 0) return null;

                return (
                  <Card key={type.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{type.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {history.slice(0, 5).map((measurement, index) => (
                          <div key={measurement.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge variant={index === 0 ? "default" : "secondary"}>
                                {measurement.value} {measurement.unit}
                              </Badge>
                              {measurement.notes && (
                                <span className="text-sm text-muted-foreground">
                                  {measurement.notes}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {formatDate(measurement.date)}
                            </div>
                          </div>
                        ))}
                      </div>
                      {history.length > 5 && (
                        <div className="text-center mt-3">
                          <span className="text-sm text-muted-foreground">
                            +{history.length - 5} more measurements
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};