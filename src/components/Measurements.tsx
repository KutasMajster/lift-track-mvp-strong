import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ruler, Plus, TrendingUp, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useProfiles } from '@/hooks/useProfiles';
import { useUnitConversion } from '@/hooks/useUnitConversion';
import { useMeasurements, MeasurementEntry } from '@/hooks/useMeasurements';

// Use MeasurementEntry from the hook instead
type Measurement = MeasurementEntry;

export interface MeasurementType {
  id: string;
  name: string;
  unit: string;
  category: 'body' | 'performance';
}

const getMeasurementTypes = (getWeightUnit: () => string, getLengthUnit: () => string): MeasurementType[] => [
  { id: 'weight', name: 'Weight', unit: getWeightUnit(), category: 'body' },
  { id: 'body_fat', name: 'Body Fat %', unit: '%', category: 'body' },
  { id: 'muscle_mass', name: 'Muscle Mass', unit: getWeightUnit(), category: 'body' },
  { id: 'chest', name: 'Chest', unit: getLengthUnit(), category: 'body' },
  { id: 'bicep', name: 'Bicep', unit: getLengthUnit(), category: 'body' },
  { id: 'waist', name: 'Waist', unit: getLengthUnit(), category: 'body' },
  { id: 'thigh', name: 'Thigh', unit: getLengthUnit(), category: 'body' },
  { id: 'neck', name: 'Neck', unit: getLengthUnit(), category: 'body' },
  { id: 'forearm', name: 'Forearm', unit: getLengthUnit(), category: 'body' }
];

export const Measurements = () => {
  const { activeProfile } = useProfiles();
  const { convertWeight, convertLength, convertWeightToStorage, convertLengthToStorage, getWeightUnit, getLengthUnit } = useUnitConversion();
  const { measurements, loading, addMeasurement, getLatestMeasurement, getMeasurementHistory } = useMeasurements();

  const MEASUREMENT_TYPES = getMeasurementTypes(getWeightUnit, getLengthUnit);
  
  const [selectedType, setSelectedType] = useState<MeasurementType>(MEASUREMENT_TYPES[0]);
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddMeasurement = async () => {
    if (!value || parseFloat(value) <= 0) {
      toast({
        title: "Invalid Value",
        description: "Please enter a valid positive number.",
        variant: "destructive"
      });
      return;
    }

    // Convert user input to storage format (always store in lbs/inches)
    let storageValue = parseFloat(value);
    let storageUnit = selectedType.unit;
    
    if (selectedType.id === 'weight' || selectedType.id === 'muscle_mass') {
      storageValue = convertWeightToStorage(parseFloat(value));
      storageUnit = 'lbs'; // Always store weight in lbs
    } else if (['chest', 'bicep', 'waist', 'thigh', 'neck', 'forearm'].includes(selectedType.id)) {
      storageValue = convertLengthToStorage(parseFloat(value));
      storageUnit = 'in'; // Always store lengths in inches
    }

    const measurement: Omit<MeasurementEntry, 'id'> = {
      type: selectedType.id,
      value: storageValue,
      unit: storageUnit,
      date: new Date(),
      notes: notes.trim() || undefined
    };

    const result = await addMeasurement(measurement);
    
    if (result) {
      setValue('');
      setNotes('');
      
      toast({
        title: "Measurement Added!",
        description: `${selectedType.name}: ${value} ${selectedType.unit}`
      });
    }
  };

  // These functions are now provided by the useMeasurements hook

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
                  
                  // Convert stored value to display value
                  let displayValue = latest?.value || 0;
                  let displayUnit = type.unit;
                  
                  if (latest) {
                    if (type.id === 'weight' || type.id === 'muscle_mass') {
                      const converted = convertWeight(latest.value);
                      displayValue = converted.value;
                      displayUnit = converted.unit;
                    } else if (['chest', 'bicep', 'waist', 'thigh', 'neck', 'forearm'].includes(type.id)) {
                      const converted = convertLength(latest.value);
                      displayValue = converted.value;
                      displayUnit = converted.unit;
                    }
                  }
                  
                  return (
                    <div key={type.id} className="text-center p-3 border rounded-lg">
                      <div className="font-medium text-sm">{type.name}</div>
                      {latest ? (
                        <>
                          <div className="text-xl font-bold">
                            {displayValue} {displayUnit}
                          </div>
                          {progress && (
                            <div className={`text-xs flex items-center justify-center gap-1 ${
                              progress.isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                              <TrendingUp className="h-3 w-3" />
                              {/* Convert progress diff to display units */}
                              {(() => {
                                let progressDiff = progress.diff;
                                if (type.id === 'weight' || type.id === 'muscle_mass') {
                                  progressDiff = convertWeight(Math.abs(progress.diff)).value * (progress.isPositive ? 1 : -1);
                                } else if (['chest', 'bicep', 'waist', 'thigh', 'neck', 'forearm'].includes(type.id)) {
                                  progressDiff = convertLength(Math.abs(progress.diff)).value * (progress.isPositive ? 1 : -1);
                                }
                                return `${progress.isPositive ? '+' : ''}${progressDiff.toFixed(1)} ${displayUnit}`;
                              })()}
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
          {loading ? (
            <Card>
              <CardContent className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading measurements...</p>
              </CardContent>
            </Card>
          ) : measurements.length === 0 ? (
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
                        {history.slice(0, 5).map((measurement, index) => {
                          // Convert stored value to display value
                          let displayValue = measurement.value;
                          let displayUnit = type.unit;
                          
                          if (type.id === 'weight' || type.id === 'muscle_mass') {
                            const converted = convertWeight(measurement.value);
                            displayValue = converted.value;
                            displayUnit = converted.unit;
                          } else if (['chest', 'bicep', 'waist', 'thigh', 'neck', 'forearm'].includes(type.id)) {
                            const converted = convertLength(measurement.value);
                            displayValue = converted.value;
                            displayUnit = converted.unit;
                          }
                          
                          return (
                          <div key={measurement.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge variant={index === 0 ? "default" : "secondary"}>
                                {displayValue} {displayUnit}
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
                          );
                        })}
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