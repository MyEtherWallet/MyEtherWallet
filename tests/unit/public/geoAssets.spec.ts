import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const read = (p: string): string => readFileSync(resolve(root, p), 'utf-8')

describe('public/robots.txt', () => {
  const txt = read('public/robots.txt')

  it('allows all crawlers', () => {
    expect(txt).toMatch(/User-agent:\s*\*/)
    expect(txt).toMatch(/Allow:\s*\//)
  })

  it('explicitly allows the key AI citation bots', () => {
    for (const bot of [
      'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'anthropic-ai', 'ClaudeBot',
      'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Bingbot', 'CCBot',
    ]) {
      expect(txt).toContain(`User-agent: ${bot}`)
    }
  })
})

describe('public/llms.txt', () => {
  const txt = read('public/llms.txt')

  it('has exactly one H1 and it is the first non-empty line', () => {
    const firstNonEmpty = txt.split('\n').map(l => l.trim()).find(l => l !== '')
    expect(firstNonEmpty).toMatch(/^# \S/)
    expect((txt.match(/^# /gm) ?? []).length).toBe(1)
  })

  it('has a blockquote description', () => {
    expect(txt).toMatch(/^> .+/m)
  })

  it('has at least 3 section headings', () => {
    expect((txt.match(/^## /gm) ?? []).length).toBeGreaterThanOrEqual(3)
  })

  it('has at least 5 markdown links to real URLs', () => {
    expect((txt.match(/\[[^\]]+\]\(https?:\/\/[^)]+\)/g) ?? []).length).toBeGreaterThanOrEqual(5)
  })
})

describe('public/.well-known/ai.txt', () => {
  it('exists and mentions the site', () => {
    const txt = read('public/.well-known/ai.txt')
    expect(txt.trim().length).toBeGreaterThan(0)
    expect(txt).toMatch(/myetherwallet\.com/i)
  })
})

describe('public/ai/*.json', () => {
  it('summary.json parses and has required keys', () => {
    const j = JSON.parse(read('public/ai/summary.json'))
    expect(j.name).toBeTruthy()
    expect(j.description).toBeTruthy()
    expect(j.url).toBeTruthy()
    expect(Array.isArray(j.categories)).toBe(true)
  })

  it('faq.json parses and has a non-empty Q&A array', () => {
    const j = JSON.parse(read('public/ai/faq.json'))
    expect(Array.isArray(j.faqs)).toBe(true)
    expect(j.faqs.length).toBeGreaterThanOrEqual(3)
    for (const f of j.faqs) {
      expect(f.question).toBeTruthy()
      expect(f.answer).toBeTruthy()
    }
  })

  it('service.json parses and has features', () => {
    const j = JSON.parse(read('public/ai/service.json'))
    expect(j.name).toBeTruthy()
    expect(Array.isArray(j.features)).toBe(true)
    expect(j.features.length).toBeGreaterThan(0)
  })
})

describe('index.html structured data', () => {
  const html = read('index.html')
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map(m => JSON.parse(m[1]))
  const types = blocks.map(b => b['@type'])

  it('has Organization, WebSite and FAQPage JSON-LD that all parse', () => {
    expect(types).toContain('Organization')
    expect(types).toContain('WebSite')
    expect(types).toContain('FAQPage')
  })

  it('FAQPage has a mainEntity Q&A list', () => {
    const faq = blocks.find(b => b['@type'] === 'FAQPage')
    expect(Array.isArray(faq.mainEntity)).toBe(true)
    expect(faq.mainEntity.length).toBeGreaterThanOrEqual(3)
    for (const q of faq.mainEntity) {
      expect(q['@type']).toBe('Question')
      expect(q.name).toBeTruthy()
      expect(q.acceptedAnswer?.text).toBeTruthy()
    }
  })

  it('WebSite points at the app domain', () => {
    const site = blocks.find(b => b['@type'] === 'WebSite')
    expect(site.url).toBe('https://app.myetherwallet.com/')
  })

  it('Organization keeps a non-empty sameAs array', () => {
    const org = blocks.find(b => b['@type'] === 'Organization')
    expect(Array.isArray(org.sameAs)).toBe(true)
    expect(org.sameAs.length).toBeGreaterThan(0)
  })

  it('declares a self-canonical and og:url to the app domain', () => {
    expect(html).toMatch(/<link rel="canonical" href="https:\/\/app\.myetherwallet\.com\/"\s*\/?>/)
    expect(html).toMatch(/property="og:url" content="https:\/\/app\.myetherwallet\.com\/"/)
  })
})
