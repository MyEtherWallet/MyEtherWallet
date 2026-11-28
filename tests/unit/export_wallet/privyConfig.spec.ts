import { describe, expect, it } from 'vitest'
import { exportPagePrivyConfig } from '../../../export_wallet/privyConfig'

describe('the export page’s Privy settings', () => {
  const config = exportPagePrivyConfig({
    theme: 'light',
    loginHeading: 'Log in',
  })

  it('offers the two ways a MEW account logs in', () => {
    expect(config.loginMethods).toEqual(['email', 'google'])
  })

  it('never creates a wallet, on any chain, and migrates none', () => {
    expect(config.embeddedWallets?.ethereum?.createOnLogin).toBe('off')
    expect(config.embeddedWallets?.solana?.createOnLogin).toBe('off')
    expect(config.embeddedWallets?.disableAutomaticMigration).toBe(true)
  })

  it('keeps the login out of cookies, which travel with every request to the site', () => {
    expect(config.sessions?.cookieWriteBehavior).toBe('never')
  })

  it('heads Privy’s login window as a login, not a sign-up', () => {
    expect(config.appearance?.landingHeader).toBe('Log in')
  })
})
