/**
 * Marketing content authored in Strapi (`/api/MEW-marketing`).
 *
 * Each published entry is one A/B variant. The API returns them in a `data`
 * array with pagination metadata; see `marketingVariantStore` for how a user is
 * bucketed onto one of them.
 */

/** One generated size of an uploaded asset. */
export interface StrapiImageFormat {
  name: string
  ext: string
  mime: string
  width: number
  height: number
  /** Host-relative for the `local` provider, absolute for remote providers. */
  url: string
}

/**
 * A Strapi media entry, present only when the request asks for it via
 * `?populate=image`. `formats` is absent for assets too small to be resized
 * and for formats Strapi does not process (e.g. SVG).
 */
export interface StrapiImage {
  id: number
  documentId: string
  name: string
  alternativeText: string | null
  width: number
  height: number
  mime: string
  /** Host-relative for the `local` provider, absolute for remote providers. */
  url: string
  formats?: {
    thumbnail?: StrapiImageFormat
    small?: StrapiImageFormat
    medium?: StrapiImageFormat
    large?: StrapiImageFormat
  } | null
}

export interface MarketingEntry {
  id: number
  documentId: string
  title: string
  description: string
  /** Label for the call to action. Null when marketing has not set one. */
  ctaText: string | null
  /** Ondo ticker the entry promotes, e.g. "nflxon". Null when untargeted. */
  tokenId: string | null
  isActive: boolean
  /** ISO timestamps bounding the run. Null means unbounded on that end. */
  startAt: string | null
  endAt: string | null
  /** Only populated when the request passes `?populate=image`. */
  image?: StrapiImage | null
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export interface MarketingResponse {
  data: MarketingEntry[]
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

/** Which arm of the test a user is bucketed into. */
export type MarketingVariant = 'A' | 'B'
