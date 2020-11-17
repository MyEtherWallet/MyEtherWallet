<template>
  <mew-overlay
    :show-overlay="open"
    right-btn-text="Close"
    left-btn-text="Back"
    @closeOverlay="$emit('close')"
  >
    <template #mewOverlayBody>
      <div v-if="!editMode && !addMode">
        <h2 class="text-center mb-10">Settings</h2>
        <v-sheet color="transparent" max-width="700px">
          <mew-expand-panel :panel-items="panelItems">
            <template #panelBody1>
              <gas-price />
            </template>
            <template #panelBody2>
              <import-config />
            </template>
            <template #panelBody3>
              <export-config />
            </template>
            <template #panelBody4>
              <contact-address @add="addMode = true" @edit="editMode = true" />
            </template>
            <template #panelBody5>
              <notifications />
            </template>
          </mew-expand-panel>
        </v-sheet>
      </div>

      <div v-if="addMode" class="full-width">
        <h2 class="text-center mb-10">Add a contact address</h2>
        <v-sheet
          color="transparent"
          max-width="700px"
          width="100%"
          class="mx-auto"
        >
          <mew6-white-sheet class="pa-4 pa-sm-12">
            <address-select :items="addresses" />
            <mew-input
              label="Name of the address"
              placeholder="eg) Jack's wallet"
            />
            <div class="text-center mt-4">
              <mew-button
                title="Update"
                button-size="xlarge"
                @click.native="addMode = false"
              />
            </div>
            <div class="text-center mt-6 error--text">Remove this address</div>
          </mew6-white-sheet>
        </v-sheet>
      </div>

      <div v-if="editMode" class="full-width">
        <h2 class="text-center mb-10">Edit</h2>

        <v-sheet
          color="transparent"
          max-width="700px"
          width="100%"
          class="mx-auto"
        >
          <mew6-white-sheet class="pa-4 pa-sm-12">
            <div class="d-flex align-center">
              <blockie
                class="mr-3"
                address="0xAEcFF9cd2367CdBb726e904cd6397eDFCae6068D"
                height="45px"
                width="45px"
              />
              <div class="text-overflow--ellipsis">
                <h5 class="font-weight-bold">Address</h5>
                <v-sheet class="d-flex align-center">
                  <div class="monospace mr-3 text-overflow--ellipsis">
                    0xAEcFF9cd2367CdBb726e904cd6397eDFCae6068D
                  </div>
                  <copy-button
                    text="0xAEcFF9cd2367CdBb726e904cd6397eDFCae6068D"
                  />
                </v-sheet>
              </div>
            </div>
            <mew-input
              class="mt-12"
              label="Name of the address"
              placeholder="eg) Jack's wallet"
            />
            <div class="text-center mt-4">
              <mew-button
                title="Update"
                button-size="xlarge"
                @click.native="editMode = false"
              />
            </div>
            <div class="text-center mt-6 error--text">Remove this address</div>
          </mew6-white-sheet>
        </v-sheet>
      </div>
    </template>
  </mew-overlay>
</template>

<script>
import importConfig from './components/import-config/ImportConfig';
import exportConfig from './components/export-config/ExportConfig';
import notifications from './components/notifications/Notifications';
import gasPrice from './components/gas-price/GasPrice';
import contactAddress from './components/contact-address/ContactAddress';
import copyButton from '@/components/buttons/copy-button/CopyButton';

export default {
  components: {
    importConfig,
    exportConfig,
    notifications,
    gasPrice,
    contactAddress,
    copyButton
  },
  props: {
    open: { default: false, type: Boolean }
  },
  data() {
    return {
      editMode: false,
      addMode: false,
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
      ],
      panelItems: [
        {
          name: 'Gas price',
          subtext: '1 Gwei (Economic)'
        },
        {
          name: 'Import configurations'
        },
        {
          name: 'Export configurations'
        },
        {
          name: 'Contact Address'
        },
        {
          name: 'Notifications'
        }
      ]
    };
  }
};
</script>
