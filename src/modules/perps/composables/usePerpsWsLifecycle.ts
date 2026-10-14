import { computed, watch, effectScope } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { perpsWs } from '../sdk/ws'

let _wired = false

export function ensurePerpsWsLifecycle() {
  if (_wired) return
  _wired = true
  // useRoute() and the Pinia store must be acquired from setup context, but
  // the refs they expose are app-singletons and stay reactive forever. We
  // build the active computed + watcher inside a detached effectScope so
  // they survive the first caller's component unmount — otherwise the
  // watcher dies when PerpsMarketList unmounts on route change, and the
  // `_wired` short-circuit blocks re-registration on re-entry, leaving the
  // socket stuck on (or off) regardless of the route.
  const route = useRoute()
  const menu = useWalletMenuStore()
  const { walletPanel, isOpenSideMenu } = storeToRefs(menu)
  effectScope(true).run(() => {
    const active = computed(
      () =>
        route.path.startsWith('/perps') ||
        (walletPanel.value === 'perps' && isOpenSideMenu.value),
    )
    watch(
      active,
      now => {
        if (now) perpsWs.connect()
        else perpsWs.disconnect()
      },
      { immediate: true },
    )
  })
}
