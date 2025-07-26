import { useProfiles } from './useProfiles';

export const useUnitConversion = () => {
  const { activeProfile } = useProfiles();

  const convertWeight = (weightInLbs: number): { value: number; unit: string } => {
    if (!activeProfile) return { value: weightInLbs, unit: 'lbs' };
    
    if (activeProfile.settings.weightUnit === 'kg') {
      return {
        value: Math.round((weightInLbs * 0.453592) * 10) / 10, // Convert lbs to kg, round to 1 decimal
        unit: 'kg'
      };
    }
    
    return { value: weightInLbs, unit: 'lbs' };
  };

  const convertLength = (lengthInInches: number): { value: number; unit: string } => {
    if (!activeProfile) return { value: lengthInInches, unit: 'in' };
    
    if (activeProfile.settings.measurementUnit === 'metric') {
      return {
        value: Math.round((lengthInInches * 2.54) * 10) / 10, // Convert inches to cm, round to 1 decimal
        unit: 'cm'
      };
    }
    
    return { value: lengthInInches, unit: 'in' };
  };

  const convertWeightToStorage = (weight: number): number => {
    // Always store weights in lbs for consistency
    if (!activeProfile) return weight;
    
    if (activeProfile.settings.weightUnit === 'kg') {
      return Math.round((weight / 0.453592) * 10) / 10; // Convert kg to lbs for storage
    }
    
    return weight;
  };

  const convertLengthToStorage = (length: number): number => {
    // Always store lengths in inches for consistency
    if (!activeProfile) return length;
    
    if (activeProfile.settings.measurementUnit === 'metric') {
      return Math.round((length / 2.54) * 10) / 10; // Convert cm to inches for storage
    }
    
    return length;
  };

  const getWeightUnit = (): string => {
    return activeProfile?.settings.weightUnit || 'lbs';
  };

  const getLengthUnit = (): string => {
    return activeProfile?.settings.measurementUnit === 'metric' ? 'cm' : 'in';
  };

  return {
    convertWeight,
    convertLength,
    convertWeightToStorage,
    convertLengthToStorage,
    getWeightUnit,
    getLengthUnit
  };
};