import { describe, it, expect } from 'vitest'
import { resolveEffectivePrice } from '@/modules/perps/utils/market'

describe('resolveEffectivePrice', () => {
  describe('market orders', () => {
    it('returns currentPrice regardless of limitPrice or side', () => {
      expect(
        resolveEffectivePrice({
          orderType: 'market',
          orderSide: 'buy',
          limitPrice: '999',
          currentPrice: 200,
        }),
      ).toBe(200)
      expect(
        resolveEffectivePrice({
          orderType: 'market',
          orderSide: 'sell',
          limitPrice: '1',
          currentPrice: 200,
        }),
      ).toBe(200)
    })
  })

  describe('limit orders — invalid limit price', () => {
    it('falls back to currentPrice when limitPrice is empty', () => {
      expect(
        resolveEffectivePrice({
          orderType: 'limit',
          orderSide: 'buy',
          limitPrice: '',
          currentPrice: 200,
        }),
      ).toBe(200)
    })

    it('falls back to currentPrice when limitPrice is non-numeric', () => {
      expect(
        resolveEffectivePrice({
          orderType: 'limit',
          orderSide: 'sell',
          limitPrice: 'abc',
          currentPrice: 200,
        }),
      ).toBe(200)
    })

    it('falls back to currentPrice when limitPrice is zero or negative', () => {
      expect(
        resolveEffectivePrice({
          orderType: 'limit',
          orderSide: 'buy',
          limitPrice: '0',
          currentPrice: 200,
        }),
      ).toBe(200)
      expect(
        resolveEffectivePrice({
          orderType: 'limit',
          orderSide: 'buy',
          limitPrice: '-50',
          currentPrice: 200,
        }),
      ).toBe(200)
    })
  })

  describe('limit orders — LONG (buy)', () => {
    it('uses currentPrice when limit ≥ mark (would fill immediately at mark)', () => {
      expect(
        resolveEffectivePrice({
          orderType: 'limit',
          orderSide: 'buy',
          limitPrice: '5000',
          currentPrice: 200,
        }),
      ).toBe(200)
    })

    it('uses currentPrice when limit equals mark', () => {
      expect(
        resolveEffectivePrice({
          orderType: 'limit',
          orderSide: 'buy',
          limitPrice: '200',
          currentPrice: 200,
        }),
      ).toBe(200)
    })

    it('uses limitPrice when limit < mark (rests and fills at limit)', () => {
      expect(
        resolveEffectivePrice({
          orderType: 'limit',
          orderSide: 'buy',
          limitPrice: '180',
          currentPrice: 200,
        }),
      ).toBe(180)
    })
  })

  describe('limit orders — SHORT (sell)', () => {
    it('uses currentPrice when limit ≤ mark (would fill immediately at mark)', () => {
      expect(
        resolveEffectivePrice({
          orderType: 'limit',
          orderSide: 'sell',
          limitPrice: '50',
          currentPrice: 200,
        }),
      ).toBe(200)
    })

    it('uses currentPrice when limit equals mark', () => {
      expect(
        resolveEffectivePrice({
          orderType: 'limit',
          orderSide: 'sell',
          limitPrice: '200',
          currentPrice: 200,
        }),
      ).toBe(200)
    })

    it('uses limitPrice when limit > mark (rests and fills at limit)', () => {
      expect(
        resolveEffectivePrice({
          orderType: 'limit',
          orderSide: 'sell',
          limitPrice: '250',
          currentPrice: 200,
        }),
      ).toBe(250)
    })
  })

  describe('limit orders — currentPrice not loaded', () => {
    it('returns limitPrice when mark is 0 (LONG)', () => {
      expect(
        resolveEffectivePrice({
          orderType: 'limit',
          orderSide: 'buy',
          limitPrice: '180',
          currentPrice: 0,
        }),
      ).toBe(180)
    })

    it('returns limitPrice when mark is 0 (SHORT)', () => {
      expect(
        resolveEffectivePrice({
          orderType: 'limit',
          orderSide: 'sell',
          limitPrice: '250',
          currentPrice: 0,
        }),
      ).toBe(250)
    })
  })

  describe('worked example from MEW-1698', () => {
    // $500 margin × 20× leverage = $10,000 position size.
    // NVDA mark = $200; user enters limit $5,000 on a Short.
    // Limit > mark → rests at limit → size against $5,000 → 2 NVDA.
    it('NVDA Short at $5,000 limit with $200 mark sizes against the limit', () => {
      const effective = resolveEffectivePrice({
        orderType: 'limit',
        orderSide: 'sell',
        limitPrice: '5000',
        currentPrice: 200,
      })
      const positionSizeUsd = 10_000
      expect(positionSizeUsd / effective).toBe(2)
    })

    // Same setup on a Long with limit $5,000 above mark — fills now at mark,
    // so size against $200 → 50 NVDA.
    it('NVDA Long at $5,000 limit with $200 mark sizes against the mark', () => {
      const effective = resolveEffectivePrice({
        orderType: 'limit',
        orderSide: 'buy',
        limitPrice: '5000',
        currentPrice: 200,
      })
      const positionSizeUsd = 10_000
      expect(positionSizeUsd / effective).toBe(50)
    })
  })
})
