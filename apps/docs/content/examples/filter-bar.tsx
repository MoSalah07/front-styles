"use client";

import * as React from "react";
import {
  Button,
  FilterBar,
  FilterBarActions,
  FilterBarChip,
  FilterBarChips,
  FilterBarSearch,
  FilterBarSelect,
} from "@design-eg/ui";

export default function FilterBarExample() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("active");
  const [role, setRole] = React.useState("");

  return (
    <div className="space-y-3">
      <FilterBar>
        <FilterBarSearch
          label="Search members"
          placeholder="Search members…"
          value={query}
          onValueChange={setQuery}
        />
        <FilterBarSelect
          label="Status"
          value={status}
          onValueChange={setStatus}
          placeholder="Any status"
          options={[
            { value: "active", label: "Active" },
            { value: "invited", label: "Invited" },
            { value: "suspended", label: "Suspended" },
          ]}
        />
        <FilterBarSelect
          label="Role"
          value={role}
          onValueChange={setRole}
          placeholder="Any role"
          options={[
            { value: "owner", label: "Owner" },
            { value: "admin", label: "Admin" },
            { value: "member", label: "Member" },
          ]}
        />
        <FilterBarActions>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("");
              setStatus("");
              setRole("");
            }}
          >
            Reset
          </Button>
        </FilterBarActions>
      </FilterBar>

      <FilterBarChips>
        {status ? (
          <FilterBarChip label="Status" value={status} onRemove={() => setStatus("")} />
        ) : null}
        {role ? <FilterBarChip label="Role" value={role} onRemove={() => setRole("")} /> : null}
        {query ? (
          <FilterBarChip label="Search" value={query} onRemove={() => setQuery("")} />
        ) : null}
      </FilterBarChips>
    </div>
  );
}
