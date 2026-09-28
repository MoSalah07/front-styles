import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { I18nProvider, getMessages, useFormatters, useI18n, useT } from "./i18n";
import { BUILT_IN_LOCALES, MESSAGES, type MessageKey } from "./messages";
import { en } from "./messages/en";

function Close() {
  const t = useT();
  return <span data-testid="out">{t("dialog.close")}</span>;
}

function Rows({ count, total }: { count: number; total: number }) {
  const t = useT();
  return <span data-testid="out">{t("dataTable.selectedCount", { count, total })}</span>;
}

describe("catalogues", () => {
  it("cover exactly the English key set", () => {
    const keys = Object.keys(en).sort();
    for (const locale of BUILT_IN_LOCALES) {
      expect(Object.keys(MESSAGES[locale]).sort(), locale).toEqual(keys);
    }
  });

  it("leave no entry empty", () => {
    for (const locale of BUILT_IN_LOCALES) {
      for (const key of Object.keys(en) as MessageKey[]) {
        const value = MESSAGES[locale][key];
        const forms: string[] = typeof value === "string" ? [value] : Object.values(value);
        for (const form of forms) expect(form.trim(), `${locale}/${key}`).not.toBe("");
      }
    }
  });

  it("translate away from English rather than copying it", () => {
    // A handful of entries are the same word in more than one language, so this
    // asks that the bulk moved, not that every single string differs.
    for (const locale of BUILT_IN_LOCALES.filter((l) => l !== "en")) {
      const messages = MESSAGES[locale];
      const identical = (Object.keys(en) as MessageKey[]).filter(
        (key) => JSON.stringify(messages[key]) === JSON.stringify(en[key]),
      );
      expect(identical.length, `${locale}: ${identical.join(", ")}`).toBeLessThan(10);
    }
  });

  /**
   * French requires a space before `?`, `!`, `;` and `:`, and it has to be a
   * non-breaking one or the mark wraps to its own line. Editors and formatters
   * normalise those characters back to a plain space given half a chance, so
   * the catalogue writes them as escapes and this keeps them honest.
   */
  it("keeps the French non-breaking spaces before double punctuation", () => {
    const offenders: string[] = [];
    for (const key of Object.keys(en) as MessageKey[]) {
      const value = MESSAGES.fr[key];
      const forms: string[] = typeof value === "string" ? [value] : Object.values(value);
      for (const form of forms) {
        if (/[^\u202f\u00a0][?!;]/.test(form) || /[^\u202f\u00a0]:(?!\/)/.test(form)) {
          offenders.push(`${key}: ${form}`);
        }
      }
    }
    expect(offenders, offenders.join("\n")).toEqual([]);
  });

  it("falls back to English for a locale with no catalogue", () => {
    expect(getMessages("de")["dialog.close"]).toBe("Close");
  });

  it("matches a regional tag on its language subtag", () => {
    expect(getMessages("fr-CA")["dialog.close"]).toBe("Fermer");
    expect(getMessages("ar-EG")["dialog.close"]).toBe("إغلاق");
  });
});

describe("I18nProvider", () => {
  it("renders English with no provider at all", () => {
    render(<Close />);
    expect(screen.getByTestId("out")).toHaveTextContent("Close");
  });

  it("switches the catalogue", () => {
    render(
      <I18nProvider locale="fr">
        <Close />
      </I18nProvider>,
    );
    expect(screen.getByTestId("out")).toHaveTextContent("Fermer");
  });

  it("lets an app override a single string", () => {
    render(
      <I18nProvider locale="en" messages={{ "dialog.close": "Dismiss panel" }}>
        <Close />
      </I18nProvider>,
    );
    expect(screen.getByTestId("out")).toHaveTextContent("Dismiss panel");
  });

  it("exposes the direction of the locale", () => {
    function Dir() {
      return <span data-testid="out">{useI18n().dir}</span>;
    }
    render(
      <I18nProvider locale="ar">
        <Dir />
      </I18nProvider>,
    );
    expect(screen.getByTestId("out")).toHaveTextContent("rtl");
  });
});

describe("plurals", () => {
  it("picks the English singular and plural", () => {
    const { rerender } = render(<Rows count={1} total={9} />);
    expect(screen.getByTestId("out")).toHaveTextContent("1 of 9 row selected.");
    rerender(<Rows count={4} total={9} />);
    expect(screen.getByTestId("out")).toHaveTextContent("4 of 9 rows selected.");
  });

  /**
   * The case this whole layer exists for. Arabic uses all six CLDR categories
   * and a different noun form in each, so a two-form implementation produces
   * wrong grammar at 0, 2, 3–10 and 11–99 — which is most real row counts.
   */
  it("picks all six Arabic forms", () => {
    const forms: [number, string][] = [
      [0, "لم يُحدَّد أي صف"],
      [1, "حُدِّد صف واحد"],
      [2, "حُدِّد صفان"],
      [5, "صفوف"],
      [30, "صفًا"],
      [100, "صف من"],
    ];

    for (const [count, expected] of forms) {
      const { unmount } = render(
        <I18nProvider locale="ar">
          <Rows count={count} total={100} />
        </I18nProvider>,
      );
      expect(screen.getByTestId("out").textContent, `count=${count}`).toContain(expected);
      unmount();
    }
  });

  it("uses the French many form for round millions", () => {
    render(
      <I18nProvider locale="fr">
        <Rows count={1_000_000} total={2_000_000} />
      </I18nProvider>,
    );
    expect(screen.getByTestId("out").textContent).toContain("de lignes sélectionnées");
  });
});

describe("interpolation", () => {
  it("substitutes named variables", () => {
    function Page() {
      return <span data-testid="out">{useT()("dataTable.pageStatus", { page: 2, pages: 7 })}</span>;
    }
    render(<Page />);
    expect(screen.getByTestId("out")).toHaveTextContent("Page 2 of 7");
  });

  /**
   * Which digits Arabic gets is the locale's call, not ours, and the two tags
   * genuinely differ: CLDR gives bare `ar` Latin digits, and the regional tags
   * Arabic-Indic. Pinned here because it is the kind of thing that otherwise
   * gets "fixed" into a hardcoded numbering system.
   */
  it("takes its digits from the locale rather than forcing a numbering system", () => {
    function Page() {
      return <span data-testid="out">{useT()("dataTable.pageStatus", { page: 2, pages: 7 })}</span>;
    }

    const { unmount } = render(
      <I18nProvider locale="ar">
        <Page />
      </I18nProvider>,
    );
    expect(screen.getByTestId("out").textContent).toContain("2");
    unmount();

    render(
      <I18nProvider locale="ar-EG">
        <Page />
      </I18nProvider>,
    );
    expect(screen.getByTestId("out").textContent).toContain("٢");
  });

  it("leaves an unmatched placeholder visible rather than blanking it", () => {
    function Page() {
      return <span data-testid="out">{useT()("dataTable.pageStatus", { page: 2 })}</span>;
    }
    render(<Page />);
    expect(screen.getByTestId("out")).toHaveTextContent("Page 2 of {pages}");
  });
});

describe("useFormatters", () => {
  it("binds Intl to the active locale", () => {
    function Amount() {
      return <span data-testid="out">{useFormatters().number.format(1234.5)}</span>;
    }
    render(
      <I18nProvider locale="fr">
        <Amount />
      </I18nProvider>,
    );
    // French groups with a no-break space and uses a comma for the decimal.
    expect(screen.getByTestId("out").textContent).toContain(",5");
  });
});
