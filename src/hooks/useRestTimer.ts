import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

export const useRestTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Play notification sound
            try {
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMaETOD1e3IeSYLKXi96+OSQA4NYqbn7KVPE');
              audio.play().catch(() => {});
            } catch (e) {}
            
            toast({
              title: "Rest Timer Complete!",
              description: "Time to get back to your workout!",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const startTimer = (duration: number = 90) => {
    setTimeLeft(duration);
    setIsRunning(true);
    setIsVisible(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resumeTimer = () => {
    if (timeLeft > 0) {
      setIsRunning(true);
    }
  };

  const resetTimer = (duration: number = 90) => {
    setTimeLeft(duration);
    setIsRunning(false);
  };

  const stopTimer = () => {
    setTimeLeft(0);
    setIsRunning(false);
    setIsVisible(false);
  };

  const showTimer = () => {
    setIsVisible(true);
  };

  const hideTimer = () => {
    setIsVisible(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isActive = timeLeft > 0 || isRunning;

  return {
    timeLeft,
    isRunning,
    isVisible,
    isActive,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    stopTimer,
    showTimer,
    hideTimer,
    formatTime
  };
};