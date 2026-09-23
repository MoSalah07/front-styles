import { CalendarDays } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@design-eg/ui";

export default function HoverCardExample() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@design-eg</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex gap-4">
          <Avatar>
            <AvatarFallback>DE</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@design-eg</h4>
            <p className="text-sm text-muted-foreground">
              A cinematic, RTL-first React design system. Tokens, primitives, blocks, templates.
            </p>
            <p className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" /> Joined March 2026
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
