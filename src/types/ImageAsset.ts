export type ImageAsset = {
  id?: number;                // DB-ID deiner marker_images-Tabelle (optional)
  publicId: string;           // Cloudinary public_id (z.B. "evocation/abc123")
  width?: number;
  height?: number;
  bytes?: number;
  format?: string;            // "jpg" | "webp" | ...
  secureUrl?: string;         // optional; nice-to-have
  caption?: string;           // Bildunterschrift
  alt?: string;               // Barrierefreiheit/SEO
  order: number;              // Reihenfolge im Marker (0 = Cover)
  createdAt?: string;
};
