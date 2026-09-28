/**
 * X renders the same card: one composition, one prerendered image, two tags.
 *
 * `alt` now comes from `generateImageMetadata`, which is what carries the
 * localised text, so it is re-exported with the rest rather than separately.
 */
export { default, contentType, generateImageMetadata, size } from "./opengraph-image";
