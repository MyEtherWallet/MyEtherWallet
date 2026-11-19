import type { PrivyClientConfig } from '@privy-io/react-auth'

/**
 * How the export page sets up Privy's React SDK. Everything the page must
 * not do is said here, not left to the SDK's defaults or to the dashboard.
 */
export const exportPagePrivyConfig = ({
  theme,
  loginHeading,
}: {
  theme: 'light' | 'dark'
  /** Privy's own heading says "Log in or sign up"; nobody signs up here. */
  loginHeading: string
}): PrivyClientConfig => ({
  // The two ways a MEW account logs in.
  loginMethods: ['email', 'google'],
  embeddedWallets: {
    // The wallet already exists. This page creates none, on any chain, and
    // changes none: the SDK would otherwise migrate older wallets by itself.
    ethereum: { createOnLogin: 'off' },
    solana: { createOnLogin: 'off' },
    disableAutomaticMigration: true,
  },
  // The SDK mirrors its tokens into cookies for apps whose server reads them.
  // Ours does not, and a cookie goes out with every request to the site. The
  // Vue app's own Privy client turns this off for the same reason.
  sessions: { cookieWriteBehavior: 'never' },
  appearance: { theme, landingHeader: loginHeading },
})
