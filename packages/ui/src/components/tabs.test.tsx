import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

function Example() {
  return (
    <Tabs defaultValue="account">
      <TabsList aria-label="Settings sections">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account panel</TabsContent>
      <TabsContent value="billing">Billing panel</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("renders a tablist with one tab per trigger", () => {
    render(<Example />);
    expect(screen.getByRole("tablist", { name: "Settings sections" })).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(2);
    expect(screen.getByRole("tab", { name: "Account" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Billing" })).toBeInTheDocument();
  });

  it("marks the default tab selected and shows only its panel", () => {
    render(<Example />);
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Billing" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Account panel");
    expect(screen.queryByText("Billing panel")).not.toBeInTheDocument();
  });

  it("switches the panel when another trigger is clicked", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("tab", { name: "Billing" }));
    expect(screen.getByRole("tab", { name: "Billing" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Billing panel");
    expect(screen.queryByText("Account panel")).not.toBeInTheDocument();
  });

  it("lifts the active trigger onto the background", async () => {
    render(<Example />);
    const account = screen.getByRole("tab", { name: "Account" });
    expect(account).toHaveAttribute("data-state", "active");
    expect(account.className).toContain("data-[state=active]:bg-background");
    expect(account.className).toContain("data-[state=active]:shadow-1");
    expect(screen.getByRole("tablist")).toHaveClass("bg-muted");
  });
});
