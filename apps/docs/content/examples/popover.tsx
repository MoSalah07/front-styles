import { Settings2 } from "lucide-react";
import {
  Button,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
} from "@design-eg/ui";

export default function PopoverExample() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Settings2 /> Dimensions
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-1">
          <h3 className="font-medium">Dimensions</h3>
          <p className="text-sm text-muted-foreground">Set the layout box for the layer.</p>
        </div>
        <Separator className="my-3" />
        <div className="grid gap-3">
          <div className="grid grid-cols-3 items-center gap-3">
            <Label htmlFor="pop-width">Width</Label>
            <Input id="pop-width" defaultValue="100%" className="col-span-2" />
          </div>
          <div className="grid grid-cols-3 items-center gap-3">
            <Label htmlFor="pop-height">Height</Label>
            <Input id="pop-height" defaultValue="24rem" className="col-span-2" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
