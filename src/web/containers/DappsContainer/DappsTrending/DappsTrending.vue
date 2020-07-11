<template>
  <div id="id-fd64f5f38819c16ce3dd44f51dd7d0ef">
    <mew6-white-sheet>
      <InterfaceWrap title="Trending">
        <div class="d-flex align-center justify-space-between">
          <Breadcrumbs :items="breadcrumbs" />
          <div class="emerald--text">
            Filter out
            <span class="font-weight-bold text_default--text">21</span> DApps
          </div>
        </div>
        <div class="d-flex mt-6">
          <div class="mr-10">
            <v-text-field
              placeholder="Search for Dapp name"
              filled
              outlined
              dense
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
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
            <mew6-flexible-btn
              v-for="(b, key) in buttons"
              :key="key"
              nopadding
              color="bg_wallet"
              class="mb-3"
              :new-tag="b.new"
              noclick
            >
              <div class="d-flex align-center px-8 py-7">
                <mew-icon class="mr-6" :icon-name="b.icon" img-height="65" />
                <div>
                  <div class="d-flex align-center">
                    <h5 class="font-weight-bold">{{ b.title }}</h5>
                    <img
                      v-if="b.up"
                      src="@/assets/images/icons/icon-thumbs-up.svg"
                      alt="up"
                      class="ml-2"
                    />
                  </div>
                  <div class="mt-1 text-overflow--ellipsis">
                    {{ b.subtitle }}
                  </div>
                  <div class="d-flex align-center mt-3">
                    <div
                      v-for="(t, tagkey) in b.tags"
                      :key="tagkey"
                      class="mr-2 emerald--text font-weight-medium"
                    >
                      #{{ t }}
                    </div>
                  </div>
                </div>
                <div class="d-flex align-center ml-auto">
                  <mew-button
                    class="mr-1"
                    button-size="medium"
                    btn-style="transparent"
                    title="Learn More"
                  ></mew-button>
                  <mew-button btn-style="outline" title="Enter"></mew-button>
                </div>
              </div>
            </mew6-flexible-btn>
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
  .v-breadcrumbs__item--disabled {
    color: var(--v-text_default-base);
  }
  .v-input--selection-controls {
    padding: 5px 0;
    margin: 0;
  }
}
</style>

<style lang="scss" scoped></style>
