import { Download, Plus } from "lucide-react";
import {
  Button,
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@design-eg/ui";

export default function PageHeaderExample() {
  return (
    <PageHeader
      breadcrumbs={[
        { label: "Acme", href: "#" },
        { label: "Billing", href: "#" },
        { label: "Invoices" },
      ]}
    >
      <PageHeaderTitle>Invoices</PageHeaderTitle>
      <PageHeaderDescription>
        Every invoice issued to this workspace, including failed charges.
      </PageHeaderDescription>
      <PageHeaderActions>
        <Button variant="outline">
          <Download /> Export CSV
        </Button>
        <Button>
          <Plus /> New invoice
        </Button>
      </PageHeaderActions>
    </PageHeader>
  );
}
