import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface RefreshNotificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const RefreshNotificationDialog = ({
  isOpen,
  onClose,
  onRefresh
}: RefreshNotificationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Refresh Required
          </DialogTitle>
          <DialogDescription>
            Your changes have been saved! To see the updates, please refresh the app.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Later
          </Button>
          <Button onClick={onRefresh} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};