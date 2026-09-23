import { Bold, Italic, Underline } from "lucide-react";
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@design-eg/ui";

const TOOLS = [
  { label: "Bold", shortcut: "⌘B", icon: Bold },
  { label: "Italic", shortcut: "⌘I", icon: Italic },
  { label: "Underline", shortcut: "⌘U", icon: Underline },
];

export default function TooltipExample() {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {TOOLS.map(({ label, shortcut, icon: Icon }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" aria-label={label}>
                <Icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {label} <span className="text-muted-foreground">{shortcut}</span>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
