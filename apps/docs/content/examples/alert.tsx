import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@design-eg/ui";

export default function AlertExample() {
  return (
    <div className="grid gap-3">
      <Alert>
        <Info />
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>
          You can add components to your app using the CLI at any time.
        </AlertDescription>
      </Alert>
      <Alert variant="success">
        <CircleCheck />
        <AlertTitle>Deployment succeeded</AlertTitle>
        <AlertDescription>Build 482 is live on production.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlert />
        <AlertTitle>Approaching your quota</AlertTitle>
        <AlertDescription>You have used 92% of this month&apos;s bandwidth.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <CircleAlert />
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>
          <p>Your card was declined. Update the payment method to keep the workspace active.</p>
        </AlertDescription>
      </Alert>
      <Alert variant="info">
        <AlertTitle>No icon, no icon column</AlertTitle>
        <AlertDescription>The grid collapses when there is nothing to align.</AlertDescription>
      </Alert>
    </div>
  );
}
