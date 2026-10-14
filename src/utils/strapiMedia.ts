import configs from '@/configs'
import type { StrapiImage } from '@/types/marketing'

/**
 * Absolute URL for a Strapi media entry.
 *
 * The `local` provider returns host-relative paths (`/uploads/foo.png`) which
 * resolve against the Strapi host, *not* against `/api`. Remote providers (S3,
 * Cloudinary) return absolute URLs already, so those are passed through
 * untouched — this keeps working if the upload provider is ever switched.
 *
 * Prefers the smallest generated size big enough for an icon. `formats` is
 * absent for assets Strapi did not resize, so the original is the fallback.
 */
export const strapiMediaUrl = (
  image: StrapiImage | null | undefined,
): string | null => {
  if (!image) return null
  const path =
    image.formats?.thumbnail?.url ?? image.formats?.small?.url ?? image.url
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path
  return `${configs.STRAPI_CMS_URL}${path.startsWith('/') ? '' : '/'}${path}`
}
