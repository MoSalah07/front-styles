import {
  Button,
  Input,
  Label,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@design-eg/ui";

const SIDES = ["start", "end", "top", "bottom"] as const;

export default function SheetExample() {
  return (
    <div className="flex flex-wrap gap-3">
      {SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline">Open from {side}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                The panel slides from the <code className="font-mono">{side}</code> edge. Logical
                sides mirror themselves in RTL.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-2">
              <Label htmlFor={`sheet-name-${side}`}>Display name</Label>
              <Input id={`sheet-name-${side}`} defaultValue="Nour" />
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button>Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}
