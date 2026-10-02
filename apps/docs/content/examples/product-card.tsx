"use client";

import type { ReactNode } from "react";
import { Coffee, Lamp, Sprout } from "lucide-react";
import { ProductCard } from "@design-eg/ui";

function Art({ children }: { children: ReactNode }) {
  return (
    <span className="flex size-24 items-center justify-center rounded-full bg-primary/10 text-primary [&_svg]:size-10">
      {children}
    </span>
  );
}

export default function ProductCardExample() {
  return (
    <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-3">
      <ProductCard
        title="Stoneware mug"
        eyebrow="Kitchen"
        price={28}
        rating={4.8}
        reviewCount={214}
        badge="New"
        badgeVariant="secondary"
        image={{
          fallback: (
            <Art>
              <Coffee />
            </Art>
          ),
        }}
        onAddToCart={() => console.info("add", "stoneware-mug")}
      />
      <ProductCard
        title="Walnut desk lamp"
        eyebrow="Lighting"
        price={149}
        compareAtPrice={179}
        rating={4.5}
        reviewCount={57}
        badge="-17%"
        defaultWishlisted
        image={{
          fallback: (
            <Art>
              <Lamp />
            </Art>
          ),
        }}
        onAddToCart={() => console.info("add", "walnut-desk-lamp")}
        onWishlistChange={(saved) => console.info("wishlist", saved)}
      />
      <ProductCard
        title="Terracotta planter"
        eyebrow="Home"
        price={24}
        currency="EUR"
        rating={4}
        reviewCount={1}
        image={{
          fallback: (
            <Art>
              <Sprout />
            </Art>
          ),
        }}
        onAddToCart={() => console.info("add", "terracotta-planter")}
      />
    </div>
  );
}
