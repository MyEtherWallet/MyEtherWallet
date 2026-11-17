import { privy } from './client'

/**
 * Privy's secure context: a hidden iframe that holds the embedded wallet's key
 * material. The app mounts it after login and relays messages both ways; the
 * SDK itself waits for the iframe to report ready before using it.
 */
let frame: HTMLIFrameElement | undefined
let onWindowMessage: ((event: MessageEvent) => void) | undefined

/** Mount the iframe and wire it to the SDK. Safe to call more than once. */
export const mountWalletIframe = (): void => {
  if (frame) return
  const url = privy.embeddedWallet.getURL()
  const origin = new URL(url).origin
  const iframe = document.createElement('iframe')
  iframe.src = url
  iframe.style.display = 'none'
  document.body.appendChild(iframe)

  // The SDK wants `postMessage` plus `reload`; a bare contentWindow has no
  // `reload`, and a cross-origin frame cannot be reloaded through its
  // `location`, so reloading means pointing the iframe at the URL again.
  // The SDK names '*' as the target; address the messages to the Privy
  // origin instead, so they can never reach another page in that frame.
  privy.setMessagePoster({
    postMessage: (message, _targetOrigin, transfer) =>
      iframe.contentWindow?.postMessage(
        message,
        origin,
        transfer ? [transfer] : undefined,
      ),
    reload: () => {
      iframe.src = url
    },
  })

  onWindowMessage = event => {
    // Only the wallet iframe may talk to the SDK.
    if (event.source !== iframe.contentWindow || event.origin !== origin) return
    let data: unknown = event.data
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data)
      } catch {
        return
      }
    }
    privy.embeddedWallet.onMessage(
      data as Parameters<typeof privy.embeddedWallet.onMessage>[0],
    )
  }
  window.addEventListener('message', onWindowMessage)
  frame = iframe
}

/** Remove the iframe and stop relaying. Called when the Privy wallet disconnects. */
export const teardownWalletIframe = (): void => {
  if (onWindowMessage) window.removeEventListener('message', onWindowMessage)
  frame?.remove()
  onWindowMessage = undefined
  frame = undefined
}
