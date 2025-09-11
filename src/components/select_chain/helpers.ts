import { ref } from 'vue'
import { type Chain } from '@/mew_api/types'

export const ALL_CHAINS = ref<Chain>({
  name: 'all',
  nameLong: 'All Chains',
  icon: '',
  type: 'EVM',
  blockExplorerTX: '',
  blockExplorerAddr: '',
  isTestNetwork: false,
  currencyName: '',
  currencyNameLong: '',
})
