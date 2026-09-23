import {
  Badge,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@design-eg/ui";

const INVOICES = [
  { id: "INV-001", customer: "Nile Studio", status: "paid", amount: 250 },
  { id: "INV-002", customer: "Delta Foods", status: "pending", amount: 150 },
  { id: "INV-003", customer: "Cairo Rail", status: "failed", amount: 480 },
  { id: "INV-004", customer: "Luxor Labs", status: "paid", amount: 90 },
] as const;

const VARIANT = {
  paid: "success",
  pending: "warning",
  failed: "destructive",
} as const;

export default function TableExample() {
  const total = INVOICES.reduce((sum, row) => sum + row.amount, 0);

  return (
    <Table>
      <TableCaption>Invoices issued in the last 30 days.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-end">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {INVOICES.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-mono text-xs">{row.id}</TableCell>
            <TableCell>{row.customer}</TableCell>
            <TableCell>
              <Badge variant={VARIANT[row.status]}>{row.status}</Badge>
            </TableCell>
            <TableCell className="text-end tabular-nums">${row.amount}.00</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-end tabular-nums">${total}.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
