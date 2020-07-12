<template>
  <BaseOverlay :open="open" :close="close" close-text="Cancel">
    <OverlayTabs>
      <v-tabs v-model="activeTab" color="transparent">
        <v-tab-item>
          <OverlayTitle title="Confirmation" />
          <mew6-white-sheet>
            <div class="overlay-content pa-8">
              <address-select
                copy-tooltip="Copy"
                save-tooltip="Save"
                :enable-save-address="true"
                label="To Address"
                :items="addresses"
                placeholder="Please enter an address"
                success-toast="Success"
                :is-valid-address="true"
                @emitSelectedValue="getSelectedValue"
              />
              <v-textarea
                outlined
                no-resize
                name="hex"
                label="Message in Hex"
                value="0xf6827a968275bd62c8ca5fc08cf498b8711491c175bd62c8ca5fc08cf498b8711491c1"
              ></v-textarea>
              <div class="d-flex justify-center">
                <mew-button
                  title="Confirm and sign"
                  :has-full-width="false"
                  button-size="xlarge"
                  @click.native="activeTab = 1"
                />
              </div>
            </div>
          </mew6-white-sheet>
        </v-tab-item>
        <v-tab-item>
          <OverlayTitle title="Signed message" />
          <div class="overlay-content">
            <v-textarea
              solo
              flat
              background-color="white"
              no-resize
              name="hex"
              value="0xf6827a968275bd62c8ca5fc08cf498b8711491c175bd62c8ca5fc08cf498b8711491c1"
            ></v-textarea>
            <div class="d-flex justify-center mt-4">
              <mew-button
                title="Copy & Close"
                :has-full-width="false"
                button-size="xlarge"
                @click.native="activeTab = 0"
              />
            </div>
          </div>
        </v-tab-item>
      </v-tabs>
    </OverlayTabs>
  </BaseOverlay>
</template>

<script>
import BaseOverlay from '@/components/Overlays/BaseOverlay';
import OverlayTitle from '@/components/OverlayTitle';
import OverlayTabs from '@/components/OverlayTabs';

export default {
  components: {
    BaseOverlay,
    OverlayTitle,
    OverlayTabs
  },
  props: {
    open: { default: false, type: Boolean },
    close: {
      default: function () {
        return {};
      },
      type: Function
    }
  },
  data() {
    return {
      activeTab: 0,
      addresses: [
        {
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          currency: 'ETH',
          nickname: 'My Address',
          resolverAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        },
        {
          address: '0x43689531907482BEE7e650D18411E284A7337A66',
          currency: 'ETH',
          nickname: 'nickname',
          resolverAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        }
      ]
    };
  },
  methods: {
    getSelectedValue(value) {
      //console.log('selected value:', value);
      this.addressValue = value;
    }
  }
};
</script>

<style lang="scss" scoped>
.overlay-content {
  width: 600px;
}
</style>
