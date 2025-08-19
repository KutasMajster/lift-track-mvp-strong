import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfiles } from '@/hooks/useProfiles';
import { toast } from '@/hooks/use-toast';

export interface MeasurementEntry {
  id: string;
  type: string;
  value: number;
  unit: string;
  date: Date;
  notes?: string;
}

export const useMeasurements = () => {
  const { user } = useAuth();
  const { activeProfile } = useProfiles();
  const [measurements, setMeasurements] = useState<MeasurementEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch measurements from Supabase
  const fetchMeasurements = async () => {
    if (!user || !activeProfile) return;

    try {
      const { data, error } = await supabase
        .from('measurement_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('profile_id', activeProfile.id)
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedMeasurements: MeasurementEntry[] = data?.map(item => ({
        id: item.id,
        type: item.type,
        value: item.value,
        unit: item.unit,
        date: new Date(item.date),
        notes: item.notes || undefined
      })) || [];

      setMeasurements(formattedMeasurements);
    } catch (error) {
      console.error('Error fetching measurements:', error);
      toast({
        title: "Error Loading Measurements",
        description: "Could not load your measurements. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load measurements when user or profile changes
  useEffect(() => {
    if (user && activeProfile) {
      fetchMeasurements();
    } else {
      setMeasurements([]);
      setLoading(false);
    }
  }, [user?.id, activeProfile?.id]);

  // Add new measurement
  const addMeasurement = async (measurement: Omit<MeasurementEntry, 'id'>) => {
    if (!user || !activeProfile) return;

    try {
      const { data, error } = await supabase
        .from('measurement_entries')
        .insert({
          user_id: user.id,
          profile_id: activeProfile.id,
          type: measurement.type,
          value: measurement.value,
          unit: measurement.unit,
          date: measurement.date.toISOString(),
          notes: measurement.notes
        })
        .select()
        .single();

      if (error) throw error;

      const newMeasurement: MeasurementEntry = {
        id: data.id,
        type: data.type,
        value: data.value,
        unit: data.unit,
        date: new Date(data.date),
        notes: data.notes || undefined
      };

      setMeasurements(prev => [newMeasurement, ...prev]);
      return newMeasurement;
    } catch (error) {
      console.error('Error adding measurement:', error);
      toast({
        title: "Error Adding Measurement",
        description: "Could not save your measurement. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  // Delete measurement
  const deleteMeasurement = async (measurementId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('measurement_entries')
        .delete()
        .eq('id', measurementId)
        .eq('user_id', user.id);

      if (error) throw error;

      setMeasurements(prev => prev.filter(m => m.id !== measurementId));
    } catch (error) {
      console.error('Error deleting measurement:', error);
      toast({
        title: "Error Deleting Measurement",
        description: "Could not delete the measurement. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Get latest measurement of a specific type
  const getLatestMeasurement = (type: string) => {
    return measurements
      .filter(m => m.type === type)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  };

  // Get measurement history for a specific type
  const getMeasurementHistory = (type: string) => {
    return measurements
      .filter(m => m.type === type)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return {
    measurements,
    loading,
    addMeasurement,
    deleteMeasurement,
    getLatestMeasurement,
    getMeasurementHistory,
    refetch: fetchMeasurements
  };
};