import { ref } from 'vue'
import i18n from '@/i18n'
import { type Chain } from '@/mew_api/types'

export const ALL_CHAINS = ref<Chain>({
  name: 'all',
  nameLong: i18n.global.t('common.all_chains'),
  icon: '',
  type: 'EVM',
  blockExplorerTX: '',
  blockExplorerAddr: '',
  isTestNetwork: false,
  currencyName: '',
  currencyNameLong: '',
  chainID: '0',
  price: 0,
  supportsBalances: false,
  coinId: '',
})
