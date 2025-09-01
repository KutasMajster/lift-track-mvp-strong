
import { useState } from 'react';
import { useProfiles } from '@/hooks/useProfiles';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, User, Edit, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ProfileEditDialog } from '@/components/ProfileEditDialog';

interface ProfileSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileSelector = ({ isOpen, onClose }: ProfileSelectorProps) => {
  const { 
    profiles, 
    activeProfile, 
    updateProfile,
    defaultAvatars 
  } = useProfiles();
  
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState<any>(null);

  const handleEditClick = (profile: any) => {
    setProfileToEdit(profile);
    setShowEditDialog(true);
  };

  const handleProfileSave = (profileId: string, updates: any) => {
    updateProfile(profileId, updates);
    setShowEditDialog(false);
    setProfileToEdit(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" aria-describedby="profile-selector-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile
          </DialogTitle>
        </DialogHeader>
        <div id="profile-selector-description" className="sr-only">
          View and edit your user profile information
        </div>

        <div className="space-y-4">
          {/* Current Profile */}
          {activeProfile && (
            <Card className="ring-2 ring-primary">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-between mb-2">
                  <Avatar className="h-12 w-12 text-2xl mx-auto">
                    <AvatarFallback>{activeProfile.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(activeProfile)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="font-medium text-sm truncate">{activeProfile.name}</p>
                <div className="flex items-center justify-center mt-1">
                  <Check className="h-3 w-3 text-primary" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Profile Message */}
          {!activeProfile && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No active profile found</p>
              <p className="text-xs text-muted-foreground mt-2">
                Please refresh the app or contact support if this issue persists
              </p>
            </div>
          )}
        </div>
      </DialogContent>

      {profileToEdit && (
        <ProfileEditDialog
          isOpen={showEditDialog}
          onClose={() => {
            setShowEditDialog(false);
            setProfileToEdit(null);
          }}
          profile={profileToEdit}
          onSave={handleProfileSave}
          defaultAvatars={defaultAvatars}
        />
      )}
    </Dialog>
  );
};
