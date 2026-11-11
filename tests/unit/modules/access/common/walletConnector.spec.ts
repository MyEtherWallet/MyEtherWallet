import { describe, it, expect } from 'vitest'
import { findWalletConnector } from '@/modules/access/common/walletConnector'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  argentWallet,
  metaMaskWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'

const connector = (id: string, rainbowKitId?: string) => ({
  id,
  ...(rainbowKitId ? { rkDetails: { id: rainbowKitId } } : {}),
})

// RainbowKit registers the generic WalletConnect wallet twice. The first
// connector opens WalletConnect's own modal; useWalletList keeps that one.
const modalConnector = {
  id: 'walletConnect',
  rkDetails: { id: 'walletConnect', isWalletConnectModalConnector: true },
}

describe('findWalletConnector', () => {
  const argent = connector('walletConnect', 'argent')
  const trust = connector('walletConnect', 'trust')
  const generic = connector('walletConnect', 'walletConnect')
  const mew = connector('walletConnect', 'mew')
  const injected = connector('io.metamask')
  const connectors = [argent, trust, modalConnector, generic, mew, injected]

  it('picks the connector of the clicked wallet when several share its id', () => {
    expect(findWalletConnector(connectors, { ...trust })).toBe(trust)
    expect(findWalletConnector(connectors, { ...generic })).toBe(generic)
  })

  it('never picks the connector that opens the WalletConnect modal', () => {
    expect(findWalletConnector(connectors, { ...modalConnector })).toBe(generic)
    expect(
      findWalletConnector([modalConnector], { ...modalConnector }),
    ).toBeUndefined()
  })

  it('matches a static config to the connector with that RainbowKit id', () => {
    expect(findWalletConnector(connectors, { id: 'mew' })).toBe(mew)
  })

  it('matches a wallet without RainbowKit details by connector id', () => {
    expect(findWalletConnector(connectors, { id: 'io.metamask' })).toBe(
      injected,
    )
  })

  it('returns nothing when no connector matches the wallet', () => {
    expect(findWalletConnector(connectors, { id: 'ghost' })).toBeUndefined()
  })

  // Pins the upstream shape the lookup depends on: RainbowKit's WalletConnect
  // wallets share one connector id, are told apart by `rkDetails.id`, and the
  // generic wallet comes twice, modal connector first.
  describe('with real RainbowKit connectors', () => {
    type Details = { id?: string; isWalletConnectModalConnector?: boolean }
    const details = (connector: object) =>
      (connector as { rkDetails?: Details }).rkDetails ?? {}

    // Built without wagmi's createConfig, so no WalletConnect core is started.
    const real = connectorsForWallets(
      [
        {
          groupName: 'MEW',
          wallets: [
            argentWallet,
            trustWallet,
            rainbowWallet,
            metaMaskWallet,
            walletConnectWallet,
          ],
        },
      ],
      { projectId: 'test-project-id', appName: 'MEW' },
    ).map(create => create({} as Parameters<typeof create>[0]))

    it.each(['walletConnect', 'trust', 'rainbow', 'metaMask', 'argent'])(
      'finds the %s connector for a config spread from it',
      rainbowKitId => {
        const own = real.find(c => details(c).id === rainbowKitId)
        expect(own?.id).toBe('walletConnect')
        // useWalletList builds the clicked wallet's config exactly like this,
        // from the first connector carrying the wallet's name.
        const config = { ...own, id: 'walletConnect' }
        const found = details(findWalletConnector(real, config) ?? {})
        expect(found.id).toBe(rainbowKitId)
        expect(found.isWalletConnectModalConnector).not.toBe(true)
      },
    )

    it('is given the generic wallet twice, modal connector first', () => {
      const generic = real.filter(c => details(c).id === 'walletConnect')
      expect(
        generic.map(c => details(c).isWalletConnectModalConnector === true),
      ).toEqual([true, false])
    })
  })
})
