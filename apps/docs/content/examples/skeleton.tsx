import { Card, CardContent, CardHeader, Skeleton } from "@design-eg/ui";

export default function SkeletonExample() {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-24 w-full rounded-media" />
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-avatar" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
