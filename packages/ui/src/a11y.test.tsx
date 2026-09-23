/**
 * Accessibility smoke suite.
 *
 * Renders a representative slice of the library and runs axe-core over it. The
 * point is not exhaustive coverage but a tripwire: if a component loses its
 * accessible name, its label association or its role structure, this fails.
 *
 * Every fixture is rendered in the markup context the component actually needs
 * to be valid — a row inside a table, a trigger inside its root — because axe
 * legitimately flags an orphaned `<tr>` or a bare `role="tab"`.
 *
 * axe runs over document.body so Radix portals (dialog, select) are included.
 */
import type * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { runAxe } from "../test/setup";

import { Alert, AlertDescription, AlertTitle } from "./components/alert";
import { Badge } from "./components/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./components/breadcrumb";
import { Button } from "./components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/card";
import { Checkbox } from "./components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/dialog";
import { Input } from "./components/input";
import { Label } from "./components/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./components/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/select";
import { Switch } from "./components/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/tabs";

/** Each fixture is a self-contained, *valid* usage of the component. */
const fixtures: Array<[name: string, ui: React.ReactElement]> = [
  [
    "button",
    <>
      <Button>Save changes</Button>
      <Button variant="outline" disabled>
        Disabled
      </Button>
      <Button size="icon" aria-label="Close panel">
        <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" />
      </Button>
    </>,
  ],
  [
    "input with label",
    <div>
      <Label htmlFor="a11y-email">Email address</Label>
      <Input id="a11y-email" type="email" placeholder="you@example.com" />
      <Label htmlFor="a11y-invalid">Postcode</Label>
      <Input id="a11y-invalid" aria-invalid aria-describedby="a11y-invalid-msg" />
      <p id="a11y-invalid-msg">Enter a valid postcode.</p>
    </div>,
  ],
  [
    "checkbox",
    <div>
      <Checkbox id="a11y-terms" />
      <Label htmlFor="a11y-terms">Accept the terms</Label>
    </div>,
  ],
  [
    "switch",
    <div>
      <Switch id="a11y-notify" />
      <Label htmlFor="a11y-notify">Email notifications</Label>
    </div>,
  ],
  [
    "select (closed)",
    <div>
      <Label htmlFor="a11y-fruit">Favourite fruit</Label>
      <Select>
        <SelectTrigger id="a11y-fruit">
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="pear">Pear</SelectItem>
        </SelectContent>
      </Select>
    </div>,
  ],
  [
    "tabs",
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview panel</TabsContent>
      <TabsContent value="activity">Activity panel</TabsContent>
    </Tabs>,
  ],
  [
    "table",
    <Table>
      <TableCaption>Recent invoices</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">Invoice</TableHead>
          <TableHead scope="col">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>INV-001</TableCell>
          <TableCell>Paid</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  ],
  [
    "alert",
    <Alert>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>Your trial ends in three days.</AlertDescription>
    </Alert>,
  ],
  [
    "badge",
    <>
      <Badge>New</Badge>
      <Badge variant="destructive">Failed</Badge>
    </>,
  ],
  [
    "card",
    <Card>
      <CardHeader>
        <CardTitle>Monthly usage</CardTitle>
        <CardDescription>Across every project in the workspace.</CardDescription>
      </CardHeader>
      <CardContent>1,204 requests</CardContent>
      <CardFooter>
        <Button>View report</Button>
      </CardFooter>
    </Card>,
  ],
  [
    "pagination",
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#previous" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#page-1" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#page-2">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#next" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>,
  ],
  [
    "breadcrumb",
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Billing</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>,
  ],
];

describe("accessibility", () => {
  it.each(fixtures)("%s has no axe violations", async (_name, ui) => {
    const { container } = render(ui);
    expect(container).toBeTruthy();
    await expect(await runAxe()).toHaveNoViolations();
  });

  it("dialog (open) has no axe violations", async () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              This removes the project and everything in it. It cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    // Guard the guard: if the portal never mounted, axe would trivially pass.
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await expect(await runAxe()).toHaveNoViolations();
  });
});
