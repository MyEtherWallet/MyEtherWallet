import { watch } from 'vue'
import { perpsWs } from '../sdk/ws'
import { usePerpsActive } from './usePerpsActive'

let _wired = false

export function ensurePerpsWsLifecycle() {
  if (_wired) return
  _wired = true
  const active = usePerpsActive()
  watch(
    active,
    (now) => {
      if (now) perpsWs.connect()
      else perpsWs.disconnect()
    },
    { immediate: true },
  )
}
