"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@design-eg/ui";

const SLIDES = [
  { title: "Tokens", body: "One JSON seed compiles into every brand and both colour modes." },
  { title: "Primitives", body: "Radix behaviour underneath, token styling on top." },
  { title: "Blocks", body: "Heroes, pricing, FAQs and footers that already agree." },
  { title: "Templates", body: "Whole pages you can ship on day one." },
  { title: "RTL-first", body: "Logical properties everywhere, so Arabic just works." },
  { title: "Dark mode", body: "Every surface re-points through the same semantic roles." },
];

export default function CarouselExample() {
  const [api, setApi] = React.useState<CarouselApi>();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-12">
      <Carousel label="Highlights" setApi={setApi}>
        <CarouselContent>
          {SLIDES.map((slide) => (
            <CarouselItem key={slide.title} className="sm:basis-1/2 lg:basis-1/3">
              <div className="flex h-40 flex-col justify-end gap-1 rounded-card border bg-card p-5 text-card-foreground shadow-1">
                <p className="font-display text-h4 uppercase">{slide.title}</p>
                <p className="text-sm text-muted-foreground">{slide.body}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-start-11" />
        <CarouselNext className="-end-11" />
        <CarouselDots />
      </Carousel>
      <p className="text-center text-xs text-muted-foreground tabular-nums">
        {api ? `${api.selectedIndex + 1} / ${api.count}` : null}
      </p>
    </div>
  );
}
