"use client";

import { LandingStore } from "@design-eg/ui";

export default function LandingStoreExample() {
  return (
    <LandingStore
      brand="Oakmere"
      defaultCartCount={2}
      header={{ sticky: false, onSearch: (query) => console.info("search", query) }}
      newsletter={{ onSubscribe: (email) => console.info("subscribe", email) }}
      onAddToCart={(product) => console.info("add", product.id)}
      onWishlistChange={(product, saved) => console.info("wishlist", product.id, saved)}
    />
  );
}
