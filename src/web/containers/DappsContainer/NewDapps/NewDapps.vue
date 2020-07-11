<template>
  <div>
    <mew6-white-sheet>
      <InterfaceWrap title="Explore New Dapps">
        <div class="d-flex align-center justify-space-between mb-6">
          <Breadcrumbs :items="breadcrumbs" />
          <div class="emerald--text">
            Filter out
            <span class="font-weight-bold text_default--text">21</span> DApps
          </div>
        </div>
        <div>
          <mew6-flexible-btn
            v-for="(b, key) in buttons"
            :key="key"
            nopadding
            color="black"
            class="mb-3 dapps-button"
            noclick
          >
            <div class="pa-12">
              <h3 class="mb-2 font-weight-medium white--text">{{ b.title }}</h3>
              <div class="description white--text">{{ b.description }}</div>
              <div class="mt-5 d-flex align-center">
                <mew-button
                  title="Enter the DApp"
                  button-size="large"
                  class="mr-1"
                ></mew-button>
                <mew-button
                  btn-style="transparent"
                  title="Learn more"
                  button-size="medium"
                ></mew-button>
              </div>
            </div>
          </mew6-flexible-btn>
        </div>
      </InterfaceWrap>
    </mew6-white-sheet>
  </div>
</template>

<script>
import InterfaceWrap from '@/web/components/InterfaceWraps/InterfaceWrap1';
import Breadcrumbs from '@/web/components/Breadcrumbs';

export default {
  components: { InterfaceWrap, Breadcrumbs },
  data() {
    return {
      buttons: [
        {
          title: 'Maker',
          description:
            'Dai is an asset-backed, hard currency for the 21st century. The first decentralized stablecoin on the Ethereum blockchain.'
        },
        {
          title: 'ENS Manager',
          description: 'Migrate or register ENS domain'
        },
        {
          title: 'Subdomains',
          description: 'Buy your subdomain'
        }
      ],
      breadcrumbs: [
        {
          text: 'Dapps center',
          disabled: false,
          to: { name: 'DappsCenter', query: {} }
        },
        {
          text: 'Explore New Dapps',
          disabled: true
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.description {
  max-width: 500px;
  min-height: 45px;
}
</style>
