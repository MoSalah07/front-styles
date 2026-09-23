import { Avatar, AvatarFallback, AvatarImage } from "@design-eg/ui";

const TEAM = ["NH", "AM", "SK", "+4"];

export default function AvatarExample() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="Nour Hassan" />
        <AvatarFallback>NH</AvatarFallback>
      </Avatar>

      <Avatar className="size-14">
        <AvatarImage src="/does-not-exist.png" alt="Ahmed Mostafa" />
        <AvatarFallback>AM</AvatarFallback>
      </Avatar>

      <div className="flex -space-x-2 rtl:space-x-reverse">
        {TEAM.map((initials) => (
          <Avatar key={initials} className="ring-2 ring-background">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  );
}
