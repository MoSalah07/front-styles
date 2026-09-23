import { FolderPlus, Plus } from "lucide-react";
import { Button, EmptyState } from "@design-eg/ui";

export default function EmptyStateExample() {
  return (
    <EmptyState
      icon={<FolderPlus />}
      title="No projects yet"
      description="Create your first project to start deploying. You can invite the rest of the team later."
      action={
        <>
          <Button>
            <Plus /> New project
          </Button>
          <Button variant="outline">Import from GitHub</Button>
        </>
      }
    />
  );
}
