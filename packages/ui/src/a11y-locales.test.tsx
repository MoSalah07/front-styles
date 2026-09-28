/**
 * The accessibility suite again, once per shipped language.
 *
 * `a11y.test.tsx` renders everything in English and LTR. This one runs the
 * components whose accessible names now come from the catalogue under each
 * locale, with `<html lang>` and `<html dir>` set the way a real page would
 * have them — which is the only way a missing translation or a broken RTL
 * mirror shows up as a violation rather than as a passing English test.
 */
import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { runAxe } from "../test/setup";

import { I18nProvider } from "./lib/i18n";
import { BUILT_IN_LOCALES, getMessages } from "./lib/messages";
import { directionOf } from "./hooks/use-locale";

import { Button } from "./components/button";
import { CopyButton } from "./components/copy-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./components/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "./components/pagination";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./components/breadcrumb";
import { DataTable } from "./blocks/data-table";
import { LoginSplit } from "./templates/login-split";

/** Puts the document in the state the route would have put it in. */
function useDocument(locale: string) {
  document.documentElement.lang = locale;
  document.documentElement.dir = directionOf(locale);
}

afterEach(() => {
  cleanup();
  document.documentElement.lang = "en";
  document.documentElement.dir = "ltr";
});

const ROWS = [
  { id: "1", name: "Nour Hassan", role: "Owner" },
  { id: "2", name: "Ali Mahmoud", role: "Editor" },
];

const COLUMNS = [
  { id: "name", header: "Name", cell: (row: (typeof ROWS)[number]) => row.name },
  { id: "role", header: "Role", cell: (row: (typeof ROWS)[number]) => row.role },
];

describe.each(BUILT_IN_LOCALES)("accessibility in %s", (locale) => {
  it("renders the navigation primitives with no axe violations", async () => {
    useDocument(locale);
    render(
      <I18nProvider locale={locale}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">design-eg</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Button</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </I18nProvider>,
    );

    await expect(await runAxe()).toHaveNoViolations();
  });

  it("names the pagination controls from the catalogue", async () => {
    useDocument(locale);
    const messages = getMessages(locale);
    render(
      <I18nProvider locale={locale}>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </I18nProvider>,
    );

    expect(
      screen.getByRole("link", { name: messages["pagination.goToPrevious"] as string }),
    ).toBeInTheDocument();
  });

  it("renders a data table with no axe violations", async () => {
    useDocument(locale);
    render(
      <I18nProvider locale={locale}>
        <DataTable data={ROWS} columns={COLUMNS} selectable />
      </I18nProvider>,
    );

    await expect(await runAxe()).toHaveNoViolations();
  });

  it("renders an open dialog with no axe violations", async () => {
    useDocument(locale);
    render(
      <I18nProvider locale={locale}>
        <Dialog defaultOpen>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>design-eg</DialogTitle>
              <DialogDescription>A dialog rendered in {locale}.</DialogDescription>
            </DialogHeader>
            <Button>OK</Button>
          </DialogContent>
        </Dialog>
      </I18nProvider>,
    );

    // Guard the guard: axe passes trivially if the portal never mounted.
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await expect(await runAxe()).toHaveNoViolations();
  });

  it("renders the sign-in template with no axe violations", async () => {
    useDocument(locale);
    render(
      <I18nProvider locale={locale}>
        <LoginSplit />
      </I18nProvider>,
    );

    await expect(await runAxe()).toHaveNoViolations();
  });

  it("gives the icon-only copy button an accessible name", async () => {
    useDocument(locale);
    const messages = getMessages(locale);
    render(
      <I18nProvider locale={locale}>
        <CopyButton value="npm i @design-eg/ui" />
      </I18nProvider>,
    );

    expect(
      screen.getByRole("button", { name: messages["copyButton.copy"] as string }),
    ).toBeInTheDocument();
  });
});
