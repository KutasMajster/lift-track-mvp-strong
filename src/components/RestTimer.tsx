import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Timer, Play, Pause, RotateCcw, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface RestTimerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTime?: number;
}

export const RestTimer = ({ isOpen, onClose, defaultTime = 90 }: RestTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(defaultTime);
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(defaultTime);

  useEffect(() => {
    if (isOpen && !isRunning) {
      setTimeLeft(defaultTime);
      setInitialTime(defaultTime);
    }
  }, [isOpen, defaultTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            toast({
              title: "Rest Time Complete!",
              description: "Time to start your next set!"
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  const handleSetTime = (seconds: number) => {
    setTimeLeft(seconds);
    setInitialTime(seconds);
    setIsRunning(false);
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Rest Timer
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-muted-foreground/20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  className="text-primary transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          {/* Quick Time Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[30, 60, 90, 120].map(seconds => (
              <Button
                key={seconds}
                variant={initialTime === seconds ? "default" : "outline"}
                size="sm"
                onClick={() => handleSetTime(seconds)}
                disabled={isRunning}
              >
                {seconds}s
              </Button>
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex gap-2">
            {!isRunning ? (
              <Button onClick={handleStart} className="flex-1" disabled={timeLeft === 0}>
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
            ) : (
              <Button onClick={handlePause} className="flex-1" variant="outline">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
            <Button onClick={handleReset} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={onClose} variant="ghost" className="w-full">
            <X className="h-4 w-4 mr-2" />
            Close Timer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};