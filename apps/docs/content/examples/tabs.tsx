import { Button, Input, Label, Tabs, TabsContent, TabsList, TabsTrigger } from "@design-eg/ui";

export default function TabsExample() {
  return (
    <Tabs defaultValue="account" className="max-w-md">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="sessions" disabled>
          Sessions
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="space-y-3">
        <div className="grid gap-2">
          <Label htmlFor="tabs-name">Name</Label>
          <Input id="tabs-name" defaultValue="Nour Hassan" />
        </div>
        <Button size="sm">Save account</Button>
      </TabsContent>
      <TabsContent value="password" className="space-y-3">
        <div className="grid gap-2">
          <Label htmlFor="tabs-current">Current password</Label>
          <Input id="tabs-current" type="password" defaultValue="••••••••" />
        </div>
        <Button size="sm">Change password</Button>
      </TabsContent>
    </Tabs>
  );
}
