"use client";

import * as React from "react";
import { Badge, Button, DataTable, type DataTableColumn } from "@design-eg/ui";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member";
  status: "active" | "invited";
  seats: number;
}

const DATA: Member[] = [
  {
    id: "1",
    name: "Nour Hassan",
    email: "nour@acme.eg",
    role: "Owner",
    status: "active",
    seats: 5,
  },
  {
    id: "2",
    name: "Ahmed Mostafa",
    email: "ahmed@acme.eg",
    role: "Admin",
    status: "active",
    seats: 3,
  },
  {
    id: "3",
    name: "Sara Kamal",
    email: "sara@acme.eg",
    role: "Member",
    status: "invited",
    seats: 1,
  },
  {
    id: "4",
    name: "Omar Fathy",
    email: "omar@acme.eg",
    role: "Member",
    status: "active",
    seats: 2,
  },
  {
    id: "5",
    name: "Laila Adel",
    email: "laila@acme.eg",
    role: "Admin",
    status: "invited",
    seats: 4,
  },
  {
    id: "6",
    name: "Youssef Nabil",
    email: "youssef@acme.eg",
    role: "Member",
    status: "active",
    seats: 1,
  },
  {
    id: "7",
    name: "Mona Sherif",
    email: "mona@acme.eg",
    role: "Member",
    status: "active",
    seats: 2,
  },
];

const columns: DataTableColumn<Member>[] = [
  {
    id: "name",
    header: "Member",
    sortable: true,
    alwaysVisible: true,
    cell: (row) => (
      <div className="grid">
        <span className="font-medium">{row.name}</span>
        <span className="text-xs text-muted-foreground">{row.email}</span>
      </div>
    ),
  },
  { id: "role", header: "Role", sortable: true, cell: (row) => row.role },
  {
    id: "status",
    header: "Status",
    sortable: true,
    cell: (row) => (
      <Badge variant={row.status === "active" ? "success" : "soft"}>{row.status}</Badge>
    ),
  },
  {
    id: "seats",
    header: "Seats",
    sortable: true,
    align: "end",
    cell: (row) => <span className="tabular-nums">{row.seats}</span>,
  },
];

export default function DataTableExample() {
  const [selected, setSelected] = React.useState<string[]>([]);

  return (
    <div className="space-y-3">
      <DataTable
        data={DATA}
        columns={columns}
        caption="Workspace members"
        searchable
        searchPlaceholder="Search members…"
        selectable
        selectedIds={selected}
        onSelectedIdsChange={setSelected}
        columnToggle
        pageSize={4}
        defaultSort={{ id: "name", direction: "asc" }}
        toolbar={
          <Button size="sm" variant="outline" disabled={selected.length === 0}>
            Remove {selected.length || ""}
          </Button>
        }
      />
    </div>
  );
}
