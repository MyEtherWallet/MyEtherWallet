<template>
  <mew6-white-sheet
    class="mew-component--features-dapps pa-6 pa-md-10"
    max-width="700px"
  >
    <div class="mew-heading-1 mb-3">Dapps center</div>
    <div>
      Using the most popular Ethereum Dapps by accessing my wallet with just one
      step.
    </div>
    <div class="mt-6">
      <v-row>
        <v-col v-for="(d, k) in dapps" :key="k" cols="12" lg="4" sm="6">
          <div class="d-flex align-center">
            <img :src="d.icon" :alt="d.label" height="80" class="mr-2" />
            <div>{{ d.label }}</div>
          </div>
        </v-col>
      </v-row>
      <mew-button
        title="Explore Dapps"
        btn-size="xlarge"
        class="mx-auto mt-10 d-block"
        @click.native="$router.push({ name: 'AccessWallet', params: {} })"
      />
    </div>
  </mew6-white-sheet>
</template>

<script>
export default {
  name: 'HomeFeaturesDapps',
  components: {},
  data: () => ({
    dapps: [
      {
        label: 'MakerDAO',
        icon: require('@/assets/images/icons/icon-dapp-makerdao.png')
      },
      {
        label: 'SafeSend transaction',
        icon: require('@/assets/images/icons/icon-dapp-lock.png')
      },
      {
        label: 'Stake on ETH 2.0',
        icon: require('@/assets/images/icons/icon-dapp-eth20.png')
      },
      {
        label: 'AAVE',
        icon: require('@/assets/images/icons/icon-dapp-aave.png')
      },
      {
        label: 'Golem Migrator',
        icon: require('@/assets/images/icons/icon-dapp-golem.png')
      },
      {
        label: 'LEND Migrator',
        icon: require('@/assets/images/icons/icon-dapp-lend.png')
      },
      {
        label: 'Unstopabble Domain',
        icon: require('@/assets/images/icons/icon-dapp-unstoppable.png')
      },
      {
        label: 'Ambrpay',
        icon: require('@/assets/images/icons/icon-dapp-ambrpay.png')
      },
      {
        label: 'ENS Manager',
        icon: require('@/assets/images/icons/icon-dapp-ens-manager.png')
      }
    ]
  })
};
</script>

<style lang="scss" scoped></style>
