import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserProfile } from '@/hooks/useProfiles';
import { toast } from '@/hooks/use-toast';

interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (profileId: string, updates: Partial<UserProfile>) => void;
  defaultAvatars: string[];
}

export const ProfileEditDialog = ({
  isOpen,
  onClose,
  profile,
  onSave,
  defaultAvatars
}: ProfileEditDialogProps) => {
  const [name, setName] = useState(profile.name);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Invalid Name",
        description: "Profile name cannot be empty.",
        variant: "destructive"
      });
      return;
    }

    onSave(profile.id, { name: name.trim(), avatar: selectedAvatar });
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully."
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="profile-name">Profile Name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter profile name"
            />
          </div>

          {/* Avatar Selection */}
          <div className="space-y-3">
            <Label>Choose Avatar</Label>
            <div className="grid grid-cols-8 gap-2">
              {defaultAvatars.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`p-2 rounded-lg border-2 transition-colors ${
                    selectedAvatar === avatar
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Avatar className="h-8 w-8 text-lg">
                    <AvatarFallback>{avatar}</AvatarFallback>
                  </Avatar>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};