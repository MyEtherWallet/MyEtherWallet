<template>
  <div>
    <mew-overlay
      :show-overlay="open"
      right-btn-text="Close"
      left-btn-text="Back"
    >
      <template v-slot:mewOverlayBody>
        <div class="overlay-tabs">
          <v-tabs v-model="activeTab" color="transparent">
            <v-tab-item>
              <h2 class="text-center pb-8">Confirmation</h2>
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
                      btn-size="xlarge"
                      @click.native="activeTab = 1"
                    />
                  </div>
                </div>
              </mew6-white-sheet>
            </v-tab-item>
            <v-tab-item>
              <h2 class="text-center pb-8">Signed message</h2>
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
                    btn-size="xlarge"
                    @click.native="activeTab = 0"
                  />
                </div>
              </div>
            </v-tab-item>
          </v-tabs>
        </div>
      </template>
    </mew-overlay>
  </div>
</template>

<script>
export default {
  data() {
    return {
      open: false,
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
      this.addressValue = value;
    },
    close: () => {}
  }
};
</script>

<style lang="scss" scoped>
.overlay-content {
  width: 600px;
}
.overlay-tabs .v-tabs-bar {
  display: none;
}
.overlay-tabs .v-tabs-items {
  background-color: transparent;
}
.theme--light.v-tabs-items,
.theme--dark.v-tabs-items {
  background-color: transparent !important;
}
</style>
