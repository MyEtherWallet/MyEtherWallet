<template>
  <div class="flex flex-col gap-4">
    <AppTabBar
      v-model="tab"
      :items="tabItems"
      :label="t('access_wallet.tabs.label')"
    />
    <AppInput
      v-if="tab !== 'advanced'"
      v-model="search"
      size="small"
      surface="alternative"
      :label="t('common.search')"
    >
      <template #leading>
        <AppIcon name="magnifying-glass" size="s" class="text-text-subtle" />
      </template>
    </AppInput>
    <div v-if="wallets.length" class="grid grid-cols-1 gap-3 xs:grid-cols-2">
      <WalletCard
        v-for="{ wallet, status } in wallets"
        :key="wallet.id"
        :wallet="wallet"
        :status="status"
        @select="connect"
      />
    </div>
    <p v-else class="py-8 text-center text-sm text-text-subtle">
      {{ t('access_wallet.not_found') }} {{ search }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import AppTabBar from '@/components/tabs/AppTabBar.vue'
import AppInput from '@/components/AppInput.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import WalletCard from './WalletCard.vue'
import { useWalletList } from '@/composables/useWalletList'
import { useConnectWallet } from '@/modules/access/composables/useConnectWallet'
import { WALLET_TABS, type WalletTab } from '@/modules/access/common/walletTabs'

const { t } = useI18n()
const { walletsForTab } = useWalletList()
const { connect } = useConnectWallet()

// The tab lives in the URL (?walletTab=) so coming back from a connect step
// (Ledger, keystore, …) restores it; closing the overlay drops it.
const route = useRoute()
const router = useRouter()
const isWalletTab = (value: unknown): value is WalletTab =>
  WALLET_TABS.includes(value as WalletTab)
const tab = computed<WalletTab>({
  get: () =>
    isWalletTab(route.query.walletTab) ? route.query.walletTab : 'popular',
  set: walletTab => {
    void router.replace({ query: { ...route.query, walletTab } })
  },
})
const search = ref('')
// Advanced has no search box, so a leftover query must not filter it.
watch(tab, () => {
  search.value = ''
})

const tabItems = computed(() =>
  WALLET_TABS.map(id => ({ id, label: t(`access_wallet.tabs.${id}`) })),
)
const wallets = computed(() => walletsForTab(tab.value, search.value))
</script>
