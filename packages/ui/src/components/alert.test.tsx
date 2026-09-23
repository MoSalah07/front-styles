import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Alert, AlertDescription, AlertTitle } from "./alert";

describe("Alert", () => {
  it("renders with the alert role and its title and description", () => {
    render(
      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Your trial ends in three days.</AlertDescription>
      </Alert>,
    );
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(screen.getByText("Heads up")).toBeInTheDocument();
    expect(screen.getByText("Your trial ends in three days.")).toBeInTheDocument();
    expect(alert).toHaveTextContent("Heads up");
    expect(alert).toHaveTextContent("Your trial ends in three days.");
  });

  it("defaults to the default variant", () => {
    render(<Alert>Plain</Alert>);
    expect(screen.getByRole("alert")).toHaveAttribute("data-variant", "default");
  });

  it("applies each variant", () => {
    for (const variant of ["destructive", "success", "warning", "info"] as const) {
      const { unmount } = render(<Alert variant={variant}>Message</Alert>);
      expect(screen.getByRole("alert")).toHaveAttribute("data-variant", variant);
      unmount();
    }
  });

  it("widens the icon column when a leading icon is present", () => {
    render(
      <Alert>
        <svg data-testid="alert-icon" />
        <AlertTitle>With icon</AlertTitle>
      </Alert>,
    );
    const alert = screen.getByRole("alert");
    expect(screen.getByTestId("alert-icon")).toBeInTheDocument();
    expect(alert.className).toContain("has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr]");
    expect(screen.getByText("With icon")).toHaveClass("col-start-2");
  });

  it("merges a caller className", () => {
    render(<Alert className="mt-4">Merged</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("mt-4");
  });
});
