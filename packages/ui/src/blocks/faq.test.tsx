import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Faq, type FaqItem } from "./faq";

const ITEMS: FaqItem[] = [
  { question: "Can I use it in production?", answer: "Yes, it ships as a versioned package." },
  { question: "Does it support RTL?", answer: "Every block is written with logical properties." },
  { question: "How do I theme it?", answer: "Point the token layer at a different brand seed." },
];

describe("Faq", () => {
  it("renders one trigger per question", () => {
    render(<Faq items={ITEMS} title="Questions" />);

    expect(screen.getAllByRole("button")).toHaveLength(ITEMS.length);
    for (const item of ITEMS) {
      expect(screen.getByRole("button", { name: item.question as string })).toBeInTheDocument();
    }
  });

  it("labels the section with its heading", () => {
    render(<Faq items={ITEMS} title="Questions" description="Everything worth asking." />);

    expect(screen.getByRole("region", { name: "Questions" })).toBeInTheDocument();
    expect(screen.getByText("Everything worth asking.")).toBeInTheDocument();
  });

  it("keeps every answer collapsed until a question is clicked", () => {
    render(<Faq items={ITEMS} />);

    for (const item of ITEMS) {
      expect(screen.queryByText(item.answer as string)).not.toBeInTheDocument();
    }
  });

  it("expands an answer on click", async () => {
    render(<Faq items={ITEMS} />);

    const trigger = screen.getByRole("button", { name: "Does it support RTL?" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Every block is written with logical properties.")).toBeVisible();
  });

  it("closes the open answer when another question is opened", async () => {
    render(<Faq items={ITEMS} />);

    await userEvent.click(screen.getByRole("button", { name: "Does it support RTL?" }));
    await userEvent.click(screen.getByRole("button", { name: "How do I theme it?" }));

    expect(screen.getByRole("button", { name: "Does it support RTL?" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByRole("button", { name: "How do I theme it?" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("opens several answers at once when the type is multiple", async () => {
    render(<Faq items={ITEMS} type="multiple" layout="split" title="Questions" />);

    await userEvent.click(screen.getByRole("button", { name: "Does it support RTL?" }));
    await userEvent.click(screen.getByRole("button", { name: "How do I theme it?" }));

    expect(screen.getByText("Every block is written with logical properties.")).toBeInTheDocument();
    expect(
      screen.getByText("Point the token layer at a different brand seed."),
    ).toBeInTheDocument();
  });
});
