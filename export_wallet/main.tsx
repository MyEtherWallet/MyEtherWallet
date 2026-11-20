import '@assets/main.css'
import '@assets/fonts/DMSans/DMSans.css'
import { createRoot } from 'react-dom/client'
import { PrivyProvider } from '@privy-io/react-auth'
import configs from '@/configs'
import { ExportWalletPage } from './ExportWalletPage'
import { isFramed } from './framing'
import { exportPageMessages } from './messages'
import { exportPagePrivyConfig } from './privyConfig'

/**
 * Entry of the wallet export page (`wallet-export.html`): a page of its own,
 * outside the Vue app, because Privy exports a wallet only through its React
 * SDK. See ExportWalletPage.tsx for what it does and why.
 */
const host = document.getElementById('wallet-export')
// Never inside another site's frame (see framing.ts).
if (host && !isFramed()) {
  createRoot(host).render(
    <PrivyProvider
      appId={configs.PRIVY_APP_ID}
      clientId={configs.PRIVY_CLIENT_ID}
      config={exportPagePrivyConfig({
        theme:
          document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
        loginHeading: exportPageMessages().log_in,
      })}
    >
      <ExportWalletPage />
    </PrivyProvider>,
  )
}
