<template>
  <mew6-white-sheet
    class="mew-component--features-dapps px-6 pb-6 pt-5 pt-dm-4 pa-md-10"
    max-width="700px"
  >
    <v-row dense>
      <v-col v-for="(d, k) in dapps" :key="k" cols="12" lg="4" sm="6">
        <div
          :class="[d.isAccessible ? 'align-center' : 'align-start', 'd-flex']"
        >
          <img
            :src="d.icon"
            :alt="d.label"
            height="85"
            class="mr-2"
            :class="{ 'icon-disabled': !d.isAccessible }"
          />
          <div>
            <div
              v-if="!d.isAccessible"
              class="badge mew-label disabledPrimary--text d-block text--center mt-3 pb-5 pl-2"
            >
              Coming soon
            </div>
            <v-spacer v-if="!d.isAccessible" />
            <div
              :class="[d.isAccessible ? 'textDark--text ' : 'textMedium--text']"
            >
              {{ d.label }}
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <div class="message d-flex align-center justify-center px-3 py-5 mt-7">
      <div class="message--text textMedium--text text-center">
        {{ $t('home.features.dapps.text') }}
        <a
          href="https://v5.myetherwallet.com"
          target="_blank"
          class="greenPrimary--text"
          >{{ $t('home.features.dapps.link-text') }}</a
        >
      </div>
    </div>
  </mew6-white-sheet>
</template>

<script>
export default {
  name: 'HomeFeaturesDapps',
  components: {},
  data: vm => ({
    dapps: [
      {
        label: vm.$t('home.features.dapps.eth-blocks'),
        icon: require('@/assets/images/icons/icon-eth-blocks-logo.png'),
        isAccessible: true,
        isNew: true
      },
      {
        label: vm.$t('home.features.dapps.stake-eth2'),
        icon: require('@/assets/images/icons/icon-dapp-eth20.png'),
        isAccessible: true
      },
      {
        label: vm.$t('home.features.dapps.ens-manager'),
        icon: require('@/assets/images/icons/icon-dapp-ens-manager.png'),
        isAccessible: true
      },
      {
        label: vm.$t('home.features.dapps.makerdao'),
        icon: require('@/assets/images/icons/icon-dapp-makerdao.png')
      },
      {
        label: vm.$t('home.features.dapps.safesend'),
        icon: require('@/assets/images/icons/icon-dapp-lock.png')
      },
      {
        label: vm.$t('home.features.dapps.aave'),
        icon: require('@/assets/images/icons/icon-dapp-aave.png'),
        isAccessible: true
      },
      {
        label: vm.$t('home.features.dapps.golem-migrator'),
        icon: require('@/assets/images/icons/icon-dapp-golem.png')
      },
      {
        label: vm.$t('home.features.dapps.lend-migrator'),
        icon: require('@/assets/images/icons/icon-dapp-lend.png')
      },
      {
        label: vm.$t('home.features.dapps.unstopabble'),
        icon: require('@/assets/images/icons/icon-dapp-unstoppable.png')
      },
      {
        label: vm.$t('home.features.dapps.ambrpay'),
        icon: require('@/assets/images/icons/icon-dapp-ambrpay.png')
      }
    ]
  })
};
</script>

<style lang="scss" scoped>
$greyBackground: var(--v-greyLight-base);

.icon-disabled {
  filter: grayscale(100%);
  opacity: 0.5;
}
.badge {
  background-color: $greyBackground;
  padding: 3px;
  border-radius: 4px;
  height: 20px;
  width: 86px;
}
.message {
  background-color: $greyBackground;
  border-radius: 4px;
  .message--text {
    max-width: 357px;
  }
}
</style>
