"use client";

/** Generic table with client-side search, sorting, row selection, column visibility and pagination, written with plain React state rather than a table library. */
import * as React from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "../components/button";
import { Checkbox } from "../components/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/dropdown-menu";
import { Input } from "../components/input";
import { Pagination, PaginationContent, PaginationItem } from "../components/pagination";
import { Skeleton } from "../components/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/table";
import { EmptyState } from "./empty-state";
import { cn } from "../lib/cn";
import { useT } from "../lib/i18n";

/** Anything the table knows how to compare or match a search term against. */
export type DataTableValue = string | number | boolean | Date | null | undefined;

export type DataTableAlign = "start" | "center" | "end";

export type DataTableSortDirection = "asc" | "desc";

export interface DataTableSort {
  /** `id` of the column being sorted. */
  id: string;
  direction: DataTableSortDirection;
}

export interface DataTableColumn<T> {
  /** Stable key. Doubles as the property read from the row when no `accessor` is given. */
  id: string;
  /** Header content. A plain string also becomes the label in the column-visibility menu. */
  header: React.ReactNode;
  /** Renders the body cell for a row. */
  cell: (row: T, index: number) => React.ReactNode;
  /** Offer a sort control in the header. */
  sortable?: boolean;
  /** Logical alignment of the header and its cells. */
  align?: DataTableAlign;
  /** Scalar pulled from the row for sorting and searching. Defaults to `row[id]`. */
  accessor?: (row: T) => DataTableValue;
  /** Keep the column out of the visibility menu, so it can never be hidden. */
  alwaysVisible?: boolean;
  /** Label used in the visibility menu when `header` is not a string. */
  label?: string;
  /** Extra classes for the body cells. */
  className?: string;
  /** Extra classes for the header cell. */
  headerClassName?: string;
}

const alignClasses: Record<DataTableAlign, string> = {
  start: "text-start",
  center: "text-center",
  end: "text-end",
};

const alignFlex: Record<DataTableAlign, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
};

function readValue<T>(column: DataTableColumn<T>, row: T): DataTableValue {
  if (column.accessor) return column.accessor(row);
  return (row as Record<string, unknown>)[column.id] as DataTableValue;
}

function toSearchText(value: DataTableValue): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function compareValues(a: DataTableValue, b: DataTableValue): number {
  const aEmpty = a === null || a === undefined || a === "";
  const bEmpty = b === null || b === undefined || b === "";
  if (aEmpty && bEmpty) return 0;
  // Blanks sort last whichever way round the column is pointing.
  if (aEmpty) return 1;
  if (bEmpty) return -1;

  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "boolean" && typeof b === "boolean") return Number(a) - Number(b);
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();

  return toSearchText(a).localeCompare(toSearchText(b), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

export interface DataTableProps<T> extends Omit<React.ComponentProps<"div">, "children"> {
  /** Rows to render. Filtering, sorting and paging all happen on this array. */
  data: readonly T[];
  /** Column definitions, in display order. */
  columns: ReadonlyArray<DataTableColumn<T>>;
  /** Stable identity for a row. Defaults to `row.id`, then to the array index. */
  getRowId?: (row: T, index: number) => string;
  /** Caption announced to screen readers and rendered under the table. */
  caption?: React.ReactNode;

  /** Show the search field. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Accessible name of the search field. */
  searchLabel?: string;

  /** Show a checkbox column with a select-all checkbox in the header. */
  selectable?: boolean;
  /** Controlled selection, as row ids. */
  selectedIds?: readonly string[];
  /** Notified whenever the selection changes. */
  onSelectedIdsChange?: (ids: string[]) => void;

  /** Show the column-visibility menu. */
  columnToggle?: boolean;
  /** Columns hidden on first render. */
  defaultHiddenColumns?: readonly string[];

  /** Show the pager. Set `false` to render every row. */
  paginated?: boolean;
  pageSize?: number;

  /** Initial sort. */
  defaultSort?: DataTableSort;

  /** Replace the body with skeleton rows. */
  loading?: boolean;
  loadingRows?: number;

  /** Content shown when there is nothing to display. */
  empty?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;

  /** Extra controls rendered in the toolbar, before the column menu. */
  toolbar?: React.ReactNode;
  /** Called when a body row is activated. */
  onRowClick?: (row: T) => void;
}

function DataTable<T>({
  className,
  data,
  columns,
  getRowId,
  caption,
  searchable = true,
  searchPlaceholder: searchPlaceholderProp,
  searchLabel: searchLabelProp,
  selectable = false,
  selectedIds,
  onSelectedIdsChange,
  columnToggle = true,
  defaultHiddenColumns,
  paginated = true,
  pageSize = 10,
  defaultSort,
  loading = false,
  loadingRows = 5,
  empty,
  emptyTitle: emptyTitleProp,
  emptyDescription: emptyDescriptionProp,
  toolbar,
  onRowClick,
  ...props
}: DataTableProps<T>) {
  const t = useT();
  const searchPlaceholder = searchPlaceholderProp ?? t("dataTable.searchPlaceholder");
  const searchLabel = searchLabelProp ?? t("dataTable.searchLabel");
  const emptyTitle = emptyTitleProp ?? t("dataTable.emptyTitle");
  const emptyDescription = emptyDescriptionProp ?? t("dataTable.emptyDescription");
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<DataTableSort | null>(defaultSort ?? null);
  const [page, setPage] = React.useState(0);
  const [hidden, setHidden] = React.useState<readonly string[]>(defaultHiddenColumns ?? []);
  const [uncontrolledSelection, setUncontrolledSelection] = React.useState<readonly string[]>([]);

  const selection = selectedIds ?? uncontrolledSelection;

  const rowId = React.useCallback(
    (row: T, index: number): string => {
      if (getRowId) return getRowId(row, index);
      const candidate = (row as Record<string, unknown>).id;
      return candidate === undefined || candidate === null ? String(index) : String(candidate);
    },
    [getRowId],
  );

  const setSelection = React.useCallback(
    (ids: string[]) => {
      if (selectedIds === undefined) setUncontrolledSelection(ids);
      onSelectedIdsChange?.(ids);
    },
    [onSelectedIdsChange, selectedIds],
  );

  const visibleColumns = React.useMemo(
    () => columns.filter((column) => !hidden.includes(column.id)),
    [columns, hidden],
  );

  const filtered = React.useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [...data];
    return data.filter((row) =>
      visibleColumns.some((column) =>
        toSearchText(readValue(column, row)).toLowerCase().includes(term),
      ),
    );
  }, [data, query, visibleColumns]);

  const sorted = React.useMemo(() => {
    if (!sort) return filtered;
    const column = columns.find((candidate) => candidate.id === sort.id);
    if (!column) return filtered;
    const factor = sort.direction === "asc" ? 1 : -1;
    // Sorting a copy keeps the caller's array intact.
    return [...filtered].sort(
      (a, b) => compareValues(readValue(column, a), readValue(column, b)) * factor,
    );
  }, [columns, filtered, sort]);

  const pageCount = paginated ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const safePage = Math.min(page, pageCount - 1);
  const rows = React.useMemo(
    () => (paginated ? sorted.slice(safePage * pageSize, safePage * pageSize + pageSize) : sorted),
    [paginated, safePage, pageSize, sorted],
  );

  // A filter that empties the last page must not strand the viewer on it.
  React.useEffect(() => {
    setPage((current) => Math.min(current, Math.max(0, pageCount - 1)));
  }, [pageCount]);

  const pageIds = rows.map((row, index) => rowId(row, index));
  const selectedOnPage = pageIds.filter((id) => selection.includes(id));
  const allSelected = pageIds.length > 0 && selectedOnPage.length === pageIds.length;
  const someSelected = selectedOnPage.length > 0 && !allSelected;

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelection([...new Set([...selection, ...pageIds])]);
    } else {
      setSelection(selection.filter((id) => !pageIds.includes(id)));
    }
  };

  const toggleRow = (id: string, checked: boolean) => {
    setSelection(checked ? [...selection, id] : selection.filter((current) => current !== id));
  };

  const toggleSort = (column: DataTableColumn<T>) => {
    setPage(0);
    setSort((current) => {
      if (!current || current.id !== column.id) return { id: column.id, direction: "asc" };
      if (current.direction === "asc") return { id: column.id, direction: "desc" };
      return null;
    });
  };

  const columnCount = visibleColumns.length + (selectable ? 1 : 0);
  const showToolbar = searchable || columnToggle || Boolean(toolbar);
  const toggleableColumns = columns.filter((column) => !column.alwaysVisible);

  return (
    <div data-slot="data-table" className={cn("flex w-full flex-col gap-3", className)} {...props}>
      {showToolbar ? (
        <div data-slot="data-table-toolbar" className="flex flex-wrap items-center gap-2">
          {searchable ? (
            <div className="relative w-full min-w-48 sm:w-64">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                data-slot="data-table-search"
                type="search"
                aria-label={searchLabel}
                placeholder={searchPlaceholder}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(0);
                }}
                className="ps-9"
              />
            </div>
          ) : null}

          <div className="ms-auto flex flex-wrap items-center gap-2">
            {toolbar}
            {columnToggle && toggleableColumns.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" data-slot="data-table-columns-trigger">
                    <SlidersHorizontal aria-hidden="true" />
                    {t("dataTable.columns")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-44">
                  <DropdownMenuLabel>{t("dataTable.toggleColumns")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {toggleableColumns.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={!hidden.includes(column.id)}
                      onCheckedChange={(checked) =>
                        setHidden((current) =>
                          checked
                            ? current.filter((id) => id !== column.id)
                            : [...current, column.id],
                        )
                      }
                    >
                      {column.label ??
                        (typeof column.header === "string" ? column.header : column.id)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-card border border-border">
        <Table>
          {caption ? <TableCaption>{caption}</TableCaption> : null}
          <TableHeader>
            <TableRow>
              {selectable ? (
                <TableHead className="w-10">
                  <Checkbox
                    data-slot="data-table-select-all"
                    aria-label={t("dataTable.selectAll")}
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={(checked) => toggleAll(checked === true)}
                  />
                </TableHead>
              ) : null}

              {visibleColumns.map((column) => {
                const align = column.align ?? "start";
                const activeSort = sort && sort.id === column.id ? sort : null;
                const SortIcon = !activeSort
                  ? ArrowUpDown
                  : activeSort.direction === "asc"
                    ? ArrowUp
                    : ArrowDown;

                return (
                  <TableHead
                    key={column.id}
                    data-column={column.id}
                    aria-sort={
                      activeSort
                        ? activeSort.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : undefined
                    }
                    className={cn(alignClasses[align], column.headerClassName)}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        data-slot="data-table-sort"
                        onClick={() => toggleSort(column)}
                        className={cn(
                          "inline-flex w-full items-center gap-1.5 rounded-sm text-sm font-medium",
                          "transition-colors duration-(--duration-fast) ease-standard",
                          "hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring outline-none",
                          alignFlex[align],
                        )}
                      >
                        {column.header}
                        <SortIcon aria-hidden="true" className="size-3.5 shrink-0 opacity-60" />
                      </button>
                    ) : (
                      column.header
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: loadingRows }).map((_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`} data-slot="data-table-loading-row">
                  {selectable ? (
                    <TableCell>
                      <Skeleton className="size-4 rounded-xs" />
                    </TableCell>
                  ) : null}
                  {visibleColumns.map((column) => (
                    <TableCell key={column.id}>
                      <Skeleton className="h-4 w-full max-w-40" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow data-slot="data-table-empty-row" className="hover:bg-transparent">
                <TableCell colSpan={Math.max(1, columnCount)} className="p-0">
                  {empty ?? (
                    <EmptyState
                      icon={<Inbox />}
                      title={emptyTitle}
                      description={emptyDescription}
                    />
                  )}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => {
                const id = rowId(row, index);
                const isSelected = selection.includes(id);
                return (
                  <TableRow
                    key={id}
                    data-slot="data-table-row"
                    data-state={isSelected ? "selected" : undefined}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(onRowClick && "cursor-pointer")}
                  >
                    {selectable ? (
                      <TableCell className="w-10">
                        <Checkbox
                          aria-label={`Select row ${index + 1}`}
                          checked={isSelected}
                          onCheckedChange={(checked) => toggleRow(id, checked === true)}
                          onClick={(event) => event.stopPropagation()}
                        />
                      </TableCell>
                    ) : null}
                    {visibleColumns.map((column) => (
                      <TableCell
                        key={column.id}
                        data-column={column.id}
                        className={cn(alignClasses[column.align ?? "start"], column.className)}
                      >
                        {column.cell(row, index)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {paginated && !loading ? (
        <div
          data-slot="data-table-footer"
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <p data-slot="data-table-status" className="text-xs text-muted-foreground">
            {/* The count drives the plural form, which in Arabic is one of six. */}
            {selectable
              ? t("dataTable.selectedCount", { count: selection.length, total: sorted.length })
              : t("dataTable.rowCount", { count: sorted.length })}
          </p>

          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label={t("dataTable.previousPage")}
                  disabled={safePage === 0}
                  onClick={() => setPage((current) => Math.max(0, current - 1))}
                >
                  <ChevronLeft aria-hidden="true" className="rtl:-scale-x-100" />
                  {t("pagination.previous")}
                </Button>
              </PaginationItem>
              <PaginationItem>
                <span
                  data-slot="data-table-page"
                  aria-live="polite"
                  className="px-2 text-xs tabular-nums text-muted-foreground"
                >
                  {t("dataTable.pageStatus", { page: safePage + 1, pages: pageCount })}
                </span>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label={t("dataTable.nextPage")}
                  disabled={safePage >= pageCount - 1}
                  onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
                >
                  {t("pagination.next")}
                  <ChevronRight aria-hidden="true" className="rtl:-scale-x-100" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}
    </div>
  );
}

export { DataTable };
