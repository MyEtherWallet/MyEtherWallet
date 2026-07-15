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
