import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DataTable, type DataTableColumn } from "./data-table";

interface Person {
  id: string;
  name: string;
  role: string;
  score: number;
}

const people: Person[] = [
  { id: "1", name: "Mona", role: "Engineer", score: 42 },
  { id: "2", name: "Ahmed", role: "Designer", score: 91 },
  { id: "3", name: "Zeina", role: "Engineer", score: 17 },
];

const columns: DataTableColumn<Person>[] = [
  { id: "name", header: "Name", cell: (row) => row.name, sortable: true },
  { id: "role", header: "Role", cell: (row) => row.role },
  { id: "score", header: "Score", cell: (row) => row.score, sortable: true, align: "end" },
];

/** Reads the name column of every body row, in the order they are rendered. */
function renderedNames(): string[] {
  return screen
    .getAllByRole("row")
    .slice(1)
    .map((row) => row.querySelector('[data-column="name"]')?.textContent ?? "");
}

describe("DataTable", () => {
  it("renders a row per record", () => {
    render(<DataTable data={people} columns={columns} />);

    expect(screen.getByRole("columnheader", { name: /name/i })).toBeInTheDocument();
    expect(renderedNames()).toEqual(["Mona", "Ahmed", "Zeina"]);
    expect(screen.getByText("Designer")).toBeInTheDocument();
  });

  it("sorts when a sortable header is clicked", async () => {
    const user = userEvent.setup();
    render(<DataTable data={people} columns={columns} />);

    await user.click(screen.getByRole("button", { name: /name/i }));
    expect(renderedNames()).toEqual(["Ahmed", "Mona", "Zeina"]);

    await user.click(screen.getByRole("button", { name: /name/i }));
    expect(renderedNames()).toEqual(["Zeina", "Mona", "Ahmed"]);

    // A third click clears the sort and the original order comes back.
    await user.click(screen.getByRole("button", { name: /name/i }));
    expect(renderedNames()).toEqual(["Mona", "Ahmed", "Zeina"]);
  });

  it("sorts numeric columns numerically", async () => {
    const user = userEvent.setup();
    render(<DataTable data={people} columns={columns} />);

    await user.click(screen.getByRole("button", { name: /score/i }));
    expect(renderedNames()).toEqual(["Zeina", "Mona", "Ahmed"]);
  });

  it("filters the rows on search", async () => {
    const user = userEvent.setup();
    render(<DataTable data={people} columns={columns} />);

    await user.type(screen.getByLabelText("Search rows"), "engineer");

    expect(renderedNames()).toEqual(["Mona", "Zeina"]);
    expect(screen.queryByText("Ahmed")).not.toBeInTheDocument();
  });

  it("shows the empty state when nothing matches", async () => {
    const user = userEvent.setup();
    render(<DataTable data={people} columns={columns} />);

    await user.type(screen.getByLabelText("Search rows"), "nobody");

    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  it("selects every row on the page from the header checkbox", async () => {
    const user = userEvent.setup();
    const onSelectedIdsChange = vi.fn();
    render(
      <DataTable
        data={people}
        columns={columns}
        selectable
        onSelectedIdsChange={onSelectedIdsChange}
      />,
    );

    const selectAll = screen.getByRole("checkbox", { name: "Select all rows" });
    expect(selectAll).toHaveAttribute("data-state", "unchecked");

    await user.click(selectAll);

    expect(onSelectedIdsChange).toHaveBeenCalledWith(["1", "2", "3"]);
    expect(screen.getByRole("checkbox", { name: "Select row 1" })).toHaveAttribute(
      "data-state",
      "checked",
    );
    expect(selectAll).toHaveAttribute("data-state", "checked");

    // Unticking one row leaves the header checkbox partially selected.
    await user.click(screen.getByRole("checkbox", { name: "Select row 2" }));
    expect(selectAll).toHaveAttribute("data-state", "indeterminate");
  });

  it("renders skeleton rows while loading", () => {
    const { container } = render(<DataTable data={[]} columns={columns} loading loadingRows={3} />);

    expect(container.querySelectorAll('[data-slot="data-table-loading-row"]')).toHaveLength(3);
  });

  it("pages through the rows", async () => {
    const user = userEvent.setup();
    render(<DataTable data={people} columns={columns} pageSize={2} searchable={false} />);

    expect(renderedNames()).toEqual(["Mona", "Ahmed"]);

    const pager = screen.getByRole("navigation");
    await user.click(within(pager).getByRole("button", { name: "Next page" }));

    expect(renderedNames()).toEqual(["Zeina"]);
  });
});
