<template>
  <div id="id-fd64f5f38819c16ce3dd44f51dd7d0ef">
    <mew6-white-sheet>
      <InterfaceWrap title="Trending">
        <div class="d-flex justify-space-between">
          <Breadcrumbs :items="breadcrumbs" />
          <div class="emerald--text">
            Filter out
            <span class="font-weight-bold text_default--text">21</span> DApps
          </div>
        </div>
        <div class="d-flex">
          <div class="mr-10">
            <mew-input is-search placeholder="Search for Dapp name" />

            <div class="pl-3">
              <div class="d-flex align-center justify-space-between">
                <h5 class="font-weight-bold">Categories</h5>
                <mew-button
                  btn-style="transparent"
                  title="Reset"
                  button-size="small"
                ></mew-button>
              </div>
              <div class="mt-3">
                <v-switch
                  v-for="(c, key) in categories"
                  :key="key"
                  v-model="c.status"
                  color="emerald"
                  :label="c.label"
                ></v-switch>
              </div>
            </div>
          </div>
          <div class="flex-grow-1">
            <mew-super-button
              v-for="(b, key) in buttons"
              :key="key"
              :title="b.title"
              :subtitle="b.subtitle"
              :right-icon="b.icon"
            />
          </div>
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
          title: 'MakerDAO',
          subtitle: 'Dai is an asset-backed, hard currency for the…',
          icon: 'makerdao',
          up: true,
          new: true,
          tags: ['Exchange', 'Other']
        },
        {
          title: 'ENS manager',
          subtitle: 'Dai is an asset-backed, hard currency for the…',
          icon: 'ensManager',
          up: false,
          tags: ['Property']
        },
        {
          title: 'Name my domain',
          subtitle: 'Dai is an asset-backed, hard currency for the…',
          icon: 'lock',
          up: false,
          tags: ['Security']
        },
        {
          title: 'SafeSend transaction',
          subtitle: 'Dai is an asset-backed, hard currency for the…',
          icon: 'lock',
          up: true,
          tags: ['Exchange']
        },
        {
          title: 'Schedule a transaction',
          subtitle: 'Dai is an asset-backed, hard currency for the…',
          icon: 'calendar',
          up: false,
          tags: ['Exchange', 'Other']
        }
      ],
      categories: [
        { label: 'All', status: false },
        { label: 'Games', status: false },
        { label: 'Gambling', status: true },
        { label: 'Social', status: false },
        { label: 'Finance', status: true },
        { label: 'High risk', status: false },
        { label: 'Exchanges', status: true },
        { label: 'Development', status: false },
        { label: 'Media', status: false },
        { label: 'Wallet', status: false },
        { label: 'Security', status: true },
        { label: 'Property', status: true },
        { label: 'Marketplaces', status: false },
        { label: 'Governance', status: false },
        { label: 'Storage', status: false },
        { label: 'Identity', status: false },
        { label: 'Energy', status: false },
        { label: 'Insurance', status: false },
        { label: 'Health', status: false },
        { label: 'Other', status: false }
      ],
      breadcrumbs: [
        {
          text: 'Dapps center',
          disabled: false,
          to: { name: 'DappsCenter', query: {} }
        },
        {
          text: 'Trending',
          disabled: true
        }
      ]
    };
  }
};
</script>

<style lang="scss">
#id-fd64f5f38819c16ce3dd44f51dd7d0ef {
  .v-messages {
    display: none;
  }
  .v-input--is-label-active {
    label {
      color: var(--v-text_default-base);
      font-weight: 500;
    }
  }
  .v-input--selection-controls__input {
    margin-right: 20px;
  }
  .v-text-field--outlined fieldset {
    border: 0;
  }
  .v-text-field .v-input__slot {
    background-color: var(--v-bg_wallet-base);
  }
  .v-text-field.v-text-field--enclosed .v-text-field__details {
    margin-bottom: 0;
  }
  .v-input--selection-controls {
    padding: 5px 0;
    margin: 0;
  }
}
</style>

<style lang="scss" scoped></style>
