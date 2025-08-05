import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useProfiles } from "@/hooks/useProfiles";
import { User } from "lucide-react";

interface GlobalProfileButtonProps {
  onClick: () => void;
}

export const GlobalProfileButton = ({ onClick }: GlobalProfileButtonProps) => {
  const { activeProfile } = useProfiles();

  if (!activeProfile) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="flex items-center gap-2 fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm hover:bg-accent"
    >
      <Avatar className="h-6 w-6">
        <AvatarFallback className="text-xs">{activeProfile.avatar}</AvatarFallback>
      </Avatar>
      <span className="hidden sm:inline text-sm">{activeProfile.name}</span>
      <User className="h-3 w-3 sm:hidden" />
    </Button>
  );
};