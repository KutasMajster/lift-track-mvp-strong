import { useState } from 'react';
import { useProfiles } from '@/hooks/useProfiles';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, User, Edit, Trash2, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { ProfileEditDialog } from '@/components/ProfileEditDialog';

interface ProfileSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileSelector = ({ isOpen, onClose }: ProfileSelectorProps) => {
  const { 
    profiles, 
    activeProfile, 
    createProfile, 
    switchProfile, 
    deleteProfile,
    updateProfile,
    defaultAvatars 
  } = useProfiles();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatars[0]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState<any>(null);

  const handleCreateProfile = () => {
    if (!newProfileName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your profile.",
        variant: "destructive"
      });
      return;
    }

    createProfile(newProfileName.trim(), selectedAvatar);
    setNewProfileName('');
    setSelectedAvatar(defaultAvatars[0]);
    setShowCreateForm(false);
    
    toast({
      title: "Profile Created!",
      description: `Welcome, ${newProfileName}!`
    });
    
    onClose();
  };

  const handleSwitchProfile = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      switchProfile(profileId);
      toast({
        title: "Profile Switched",
        description: `Switched to ${profile.name}'s profile`
      });
      onClose();
    }
  };

  const handleDeleteClick = (profileId: string) => {
    if (profiles.length <= 1) {
      toast({
        title: "Cannot Delete",
        description: "You need at least one profile.",
        variant: "destructive"
      });
      return;
    }
    setProfileToDelete(profileId);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (profileToDelete) {
      const profile = profiles.find(p => p.id === profileToDelete);
      deleteProfile(profileToDelete);
      toast({
        title: "Profile Deleted",
        description: `${profile?.name}'s profile has been deleted.`
      });
      setShowDeleteDialog(false);
      setProfileToDelete(null);
    }
  };

  const handleEditClick = (profile: any) => {
    setProfileToEdit(profile);
    setShowEditDialog(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" aria-describedby="profile-selector-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Select Profile
          </DialogTitle>
        </DialogHeader>
        <div id="profile-selector-description" className="sr-only">
          Choose or create a user profile to personalize your workout experience
        </div>

        <div className="space-y-4">
          {/* Existing Profiles */}
          <div className="grid grid-cols-2 gap-3">
            {profiles.map(profile => (
              <Card 
                key={profile.id}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  activeProfile?.id === profile.id 
                    ? 'ring-2 ring-primary' 
                    : 'hover:bg-accent'
                }`}
                onClick={() => handleSwitchProfile(profile.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-between mb-2">
                    <Avatar className="h-12 w-12 text-2xl mx-auto">
                      <AvatarFallback>{profile.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(profile);
                        }}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      {profiles.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(profile.id);
                          }}
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="font-medium text-sm truncate">{profile.name}</p>
                  {activeProfile?.id === profile.id && (
                    <div className="flex items-center justify-center mt-1">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Add New Profile Button */}
            <Card 
              className="cursor-pointer transition-all hover:scale-105 hover:bg-accent border-dashed"
              onClick={() => setShowCreateForm(true)}
            >
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Add Profile</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Create New Profile Form */}
          {showCreateForm && (
            <Card className="border-primary">
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Profile Name</Label>
                  <Input
                    id="profile-name"
                    placeholder="Enter name..."
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Choose Avatar</Label>
                  <div className="grid grid-cols-8 gap-2">
                    {defaultAvatars.map(avatar => (
                      <Button
                        key={avatar}
                        variant={selectedAvatar === avatar ? "default" : "outline"}
                        size="sm"
                        className="h-8 w-8 p-0 text-lg"
                        onClick={() => setSelectedAvatar(avatar)}
                      >
                        {avatar}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleCreateProfile}
                    className="flex-1"
                  >
                    Create
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setProfileToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Profile"
        description="Are you sure you want to delete this profile? This action cannot be undone and all associated data will be lost."
      />

      {profileToEdit && (
        <ProfileEditDialog
          isOpen={showEditDialog}
          onClose={() => {
            setShowEditDialog(false);
            setProfileToEdit(null);
          }}
          profile={profileToEdit}
          onSave={updateProfile}
          defaultAvatars={defaultAvatars}
        />
      )}
    </Dialog>
  );
};
