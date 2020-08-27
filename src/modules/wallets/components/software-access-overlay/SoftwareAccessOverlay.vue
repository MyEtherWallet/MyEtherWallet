<template>
  <mew-overlay :show-overlay="open" title="Software" right-btn-text="Cancel">
    <template v-slot:mewOverlayBody>
      <div>
        <v-sheet color="transparent" max-width="650px" class="mx-auto px-5">
          <v-row>
            <v-col v-for="(btn, key) in buttons" :key="key" cols="12" sm="12">
              <router-link :to="btn.to" class="display--block">
                <mew-super-button
                  :title="btn.label"
                  :subtitle="btn.description"
                  :right-icon="btn.icon"
                  icon-type="img"
                  color-theme="basic"
                />
              </router-link>
            </v-col>
          </v-row>
        </v-sheet>
        <div class="spacer-y-medium" />
      </div>
    </template>
  </mew-overlay>
</template>

<script>
export default {
  name: 'AccessWalletSoftware',
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      buttons: [
        {
          label: 'Keystore',
          description: 'Access via Keystore',
          icon: require('@/assets/images/icons/icon-keystore-file.svg'),
          to: { name: 'AccessWalletBrowserExtensionInstall' }
        },
        {
          label: 'Mnemonic Phrase',
          description: 'Access via Mnemonic PHrase',
          icon: require('@/assets/images/icons/icon-mnemonic.svg'),
          to: { name: 'AccessWalletBrowserExtensionInstall' }
        },
        {
          label: 'Private Key',
          description: 'Access via Private Key',
          icon: require('@/assets/images/icons/icon-private-key-grey.svg'),
          to: { name: 'AccessWalletBrowserExtensionInstall' }
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped></style>
