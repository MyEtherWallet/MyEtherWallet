import { describe, it, expect } from 'vitest'
import { strapiMediaUrl } from '@/utils/strapiMedia'
import type { StrapiImage } from '@/types/marketing'

const HOST = 'https://strapi.mewapi.io'

// Trimmed from a real /api/MEW-marketing?populate=image response.
const netflix = (over: Partial<StrapiImage> = {}): StrapiImage => ({
  id: 634,
  documentId: 'rv22gl4eo5c4thalajfgwqk8',
  name: 'Netflix.png',
  alternativeText: null,
  width: 512,
  height: 512,
  mime: 'image/png',
  url: '/uploads/Netflix_ea1c0acd1a.png',
  formats: {
    thumbnail: {
      name: 'thumbnail_Netflix.png',
      ext: '.png',
      mime: 'image/png',
      width: 156,
      height: 156,
      url: '/uploads/thumbnail_Netflix_ea1c0acd1a.png',
    },
    small: {
      name: 'small_Netflix.png',
      ext: '.png',
      mime: 'image/png',
      width: 500,
      height: 500,
      url: '/uploads/small_Netflix_ea1c0acd1a.png',
    },
  },
  ...over,
})

describe('strapiMediaUrl', () => {
  // The load-bearing case: uploads live at the host root, NOT under /api, so
  // joining onto the API base would 404 every image.
  it('resolves a host-relative upload against the Strapi host, not /api', () => {
    const url = strapiMediaUrl(netflix())
    expect(url).toBe(`${HOST}/uploads/thumbnail_Netflix_ea1c0acd1a.png`)
    expect(url).not.toContain('/api/')
  })

  it('prefers the thumbnail format over small and the original', () => {
    expect(strapiMediaUrl(netflix())).toContain('thumbnail_')
  })

  it('falls back to small when there is no thumbnail', () => {
    const image = netflix()
    const url = strapiMediaUrl({
      ...image,
      formats: { small: image.formats!.small },
    })
    expect(url).toBe(`${HOST}/uploads/small_Netflix_ea1c0acd1a.png`)
  })

  // Strapi omits `formats` for assets it does not resize (small images, SVG).
  it('falls back to the original when formats are absent', () => {
    expect(strapiMediaUrl(netflix({ formats: null }))).toBe(
      `${HOST}/uploads/Netflix_ea1c0acd1a.png`,
    )
    expect(strapiMediaUrl(netflix({ formats: undefined }))).toBe(
      `${HOST}/uploads/Netflix_ea1c0acd1a.png`,
    )
  })

  // Remote upload providers (S3, Cloudinary) already return absolute URLs;
  // prefixing the host would corrupt them.
  it('passes an absolute URL through untouched', () => {
    const remote = 'https://cdn.example.com/uploads/HD.png'
    expect(
      strapiMediaUrl(netflix({ url: remote, formats: null })),
    ).toBe(remote)
  })

  it('returns null when there is no image', () => {
    expect(strapiMediaUrl(null)).toBeNull()
    expect(strapiMediaUrl(undefined)).toBeNull()
  })
})
