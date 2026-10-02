import * as React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { runAxe } from "../../test/setup";
import { I18nProvider } from "../lib/i18n";
import { ar } from "../lib/messages/ar";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "./carousel";

const SLIDE = 100;

function rect(left: number, width: number): DOMRect {
  return {
    left,
    right: left + width,
    width,
    top: 0,
    bottom: 100,
    height: 100,
    x: left,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect;
}

/**
 * jsdom has no layout, so this lays the track out by hand: slides of a fixed
 * width in a viewport `visible` slides wide, a `scrollLeft` that goes negative
 * in RTL the way browsers report it, and a `scrollBy` that moves the slides
 * and fires the scroll event the component listens for.
 */
function layOut(track: HTMLElement, { visible = 1, rtl = false } = {}) {
  const slides = Array.from(track.children) as HTMLElement[];
  const viewport = visible * SLIDE;
  const max = slides.length * SLIDE - viewport;
  let travelled = 0;

  Object.defineProperty(track, "clientWidth", { configurable: true, get: () => viewport });
  Object.defineProperty(track, "scrollWidth", {
    configurable: true,
    get: () => slides.length * SLIDE,
  });
  Object.defineProperty(track, "scrollLeft", {
    configurable: true,
    get: () => (rtl ? -travelled : travelled),
    set: (value: number) => {
      travelled = Math.min(Math.max(Math.abs(value), 0), max);
    },
  });
  track.getBoundingClientRect = () => rect(0, viewport);
  slides.forEach((slide, index) => {
    slide.getBoundingClientRect = () =>
      rtl
        ? rect(viewport - (index + 1) * SLIDE + travelled, SLIDE)
        : rect(index * SLIDE - travelled, SLIDE);
  });

  const scrollBy = vi.fn((options: ScrollToOptions) => {
    const left = options.left ?? 0;
    travelled = Math.min(Math.max(travelled + (rtl ? -left : left), 0), max);
    fireEvent.scroll(track);
  });
  track.scrollBy = scrollBy as unknown as typeof track.scrollBy;

  // The initial measurement ran against jsdom's empty layout; re-measure.
  fireEvent.scroll(track);
  return scrollBy;
}

function Fixture({
  slides = 4,
  setApi,
  slidesToScroll,
}: {
  slides?: number;
  setApi?: (api: CarouselApi) => void;
  slidesToScroll?: number | "auto";
}) {
  return (
    <Carousel label="Featured" setApi={setApi} slidesToScroll={slidesToScroll}>
      <CarouselContent data-testid="track">
        {Array.from({ length: slides }, (_, index) => (
          <CarouselItem key={index}>Slide {index + 1}</CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  );
}

afterEach(() => {
  document.documentElement.removeAttribute("dir");
});

describe("Carousel", () => {
  it("renders a named carousel region with labelled slides", () => {
    render(<Fixture />);

    const region = screen.getByRole("region", { name: "Featured" });
    expect(region).toHaveAttribute("aria-roledescription", "carousel");

    const slides = screen.getAllByRole("group", { name: /of 4$/ });
    expect(slides).toHaveLength(4);
    expect(slides[0]).toHaveAccessibleName("1 of 4");
    expect(slides[3]).toHaveAccessibleName("4 of 4");
    expect(slides[0]).toHaveAttribute("aria-roledescription", "slide");
  });

  it("counts slides passed through a fragment", () => {
    render(
      <Carousel label="Mixed">
        <CarouselContent>
          <>
            <CarouselItem>One</CarouselItem>
            <CarouselItem>Two</CarouselItem>
          </>
          <CarouselItem>Three</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    expect(screen.getByRole("group", { name: "3 of 3" })).toHaveTextContent("Three");
  });

  it("names the controls and disables previous at the start", () => {
    render(<Fixture />);

    expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled();
    // Nothing has been measured under jsdom's empty layout yet.
    expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled();
  });

  it("moves forward and back, and disables each control at its end", async () => {
    const user = userEvent.setup();
    render(<Fixture slides={3} />);
    const scrollBy = layOut(screen.getByTestId("track"));

    const previous = screen.getByRole("button", { name: "Previous slide" });
    const next = screen.getByRole("button", { name: "Next slide" });
    await waitFor(() => expect(next).toBeEnabled());
    expect(previous).toBeDisabled();

    await user.click(next);
    expect(scrollBy).toHaveBeenLastCalledWith({ left: SLIDE, behavior: "smooth" });
    await waitFor(() => expect(previous).toBeEnabled());
    expect(screen.getByRole("button", { name: "Go to slide 2" })).toHaveAttribute(
      "aria-current",
      "true",
    );

    await user.click(next);
    await waitFor(() => expect(next).toBeDisabled());

    await user.click(previous);
    expect(scrollBy).toHaveBeenLastCalledWith({ left: -SLIDE, behavior: "smooth" });
    await waitFor(() => expect(next).toBeEnabled());
  });

  it("jumps to a slide from its dot", async () => {
    const user = userEvent.setup();
    render(<Fixture slides={5} />);
    const scrollBy = layOut(screen.getByTestId("track"));

    await user.click(screen.getByRole("button", { name: "Go to slide 4" }));

    expect(scrollBy).toHaveBeenLastCalledWith({ left: 3 * SLIDE, behavior: "smooth" });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Go to slide 4" })).toHaveAttribute(
        "aria-current",
        "true",
      ),
    );
  });

  it("pages by the visible count when slidesToScroll is auto", async () => {
    const user = userEvent.setup();
    render(<Fixture slides={8} slidesToScroll="auto" />);
    const scrollBy = layOut(screen.getByTestId("track"), { visible: 3 });

    const next = screen.getByRole("button", { name: "Next slide" });
    await waitFor(() => expect(next).toBeEnabled());
    await user.click(next);

    expect(scrollBy).toHaveBeenLastCalledWith({ left: 3 * SLIDE, behavior: "smooth" });
  });

  it("steps with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<Fixture />);
    const scrollBy = layOut(screen.getByTestId("track"));
    const next = screen.getByRole("button", { name: "Next slide" });
    await waitFor(() => expect(next).toBeEnabled());

    next.focus();
    await user.keyboard("{ArrowRight}");
    expect(scrollBy).toHaveBeenLastCalledWith({ left: SLIDE, behavior: "smooth" });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Previous slide" })).toBeEnabled(),
    );

    await user.keyboard("{ArrowLeft}");
    expect(scrollBy).toHaveBeenLastCalledWith({ left: -SLIDE, behavior: "smooth" });
  });

  it("mirrors the arrow keys and scroll direction in RTL", async () => {
    const user = userEvent.setup();
    document.documentElement.setAttribute("dir", "rtl");
    render(<Fixture />);
    const scrollBy = layOut(screen.getByTestId("track"), { rtl: true });
    const next = screen.getByRole("button", { name: "Next slide" });
    await waitFor(() => expect(next).toBeEnabled());

    // In RTL, forward is towards the left, so ArrowLeft advances and scrollBy
    // moves towards negative x.
    next.focus();
    await user.keyboard("{ArrowLeft}");
    expect(scrollBy).toHaveBeenLastCalledWith({ left: -SLIDE, behavior: "smooth" });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Go to slide 2" })).toHaveAttribute(
        "aria-current",
        "true",
      ),
    );

    await user.click(screen.getByRole("button", { name: "Previous slide" }));
    expect(scrollBy).toHaveBeenLastCalledWith({ left: SLIDE, behavior: "smooth" });
  });

  it("jumps instead of animating under reduced motion", async () => {
    const user = userEvent.setup();
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      ...original(query),
      matches: query.includes("reduce"),
    })) as typeof window.matchMedia;

    try {
      render(<Fixture />);
      const scrollBy = layOut(screen.getByTestId("track"));
      const next = screen.getByRole("button", { name: "Next slide" });
      await waitFor(() => expect(next).toBeEnabled());
      await user.click(next);
      expect(scrollBy).toHaveBeenLastCalledWith({ left: SLIDE, behavior: "auto" });
    } finally {
      window.matchMedia = original;
    }
  });

  it("hands the API to setApi and keeps it current", async () => {
    let api: CarouselApi | undefined;
    render(<Fixture setApi={(next) => (api = next)} />);
    layOut(screen.getByTestId("track"));

    await waitFor(() => expect(api?.canScrollNext).toBe(true));
    expect(api?.count).toBe(4);
    expect(api?.selectedIndex).toBe(0);

    React.act(() => api?.scrollTo(2));
    await waitFor(() => expect(api?.selectedIndex).toBe(2));
    expect(api?.canScrollPrev).toBe(true);
  });

  it("has no axe violations", async () => {
    render(<Fixture />);
    expect(await runAxe()).toHaveNoViolations();
  });

  it("renders its own strings in Arabic", () => {
    render(
      <I18nProvider locale="ar">
        <Carousel>
          <CarouselContent>
            <CarouselItem>١</CarouselItem>
            <CarouselItem>٢</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </I18nProvider>,
    );

    expect(screen.getByRole("region", { name: ar["carousel.label"] as string })).toHaveAttribute(
      "aria-roledescription",
      ar["carousel.roleDescription"] as string,
    );
    expect(screen.getByRole("group", { name: "1 من 2" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: ar["carousel.previous"] as string }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: ar["carousel.next"] as string })).toBeInTheDocument();
  });
});
