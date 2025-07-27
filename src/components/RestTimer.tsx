import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Timer, Play, Pause, RotateCcw, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface RestTimerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTime?: number;
  isActive: boolean;
  timeLeft: number;
  isRunning: boolean;
  onReopen: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSetTime: (seconds: number) => void;
}

export const RestTimer = ({ isOpen, onClose, defaultTime = 90, isActive, timeLeft, isRunning, onReopen, onPause, onResume, onReset, onSetTime }: RestTimerProps) => {

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = defaultTime > 0 ? ((defaultTime - timeLeft) / defaultTime) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Rest Timer
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Circular Progress */}
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <Progress 
                value={progress} 
                className="w-full h-full rounded-full [&>div]:rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isRunning ? 'Running' : 'Paused'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Time Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetTime(30)}
              className="text-xs"
            >
              30s
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetTime(60)}
              className="text-xs"
            >
              60s
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetTime(90)}
              className="text-xs"
            >
              90s
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetTime(120)}
              className="text-xs"
            >
              120s
            </Button>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-2 justify-center">
            {isRunning ? (
              <Button
                variant="outline"
                onClick={onPause}
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            ) : (
              <Button
                onClick={onResume}
                disabled={timeLeft === 0}
              >
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={onReset}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Close Button */}
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full"
          >
            <X className="h-4 w-4 mr-2" />
            Close Timer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};