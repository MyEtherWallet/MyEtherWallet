<template>
  <v-container class="d-flex">
    <div class="flex-grow-1">
      <mew6-white-sheet>
        <interface-wrap :title="$t('sendTx.send-tx')">
          <div>
            <div class="d-flex justify-end">
              <mew-button
                :title="$t('sendTx.entire-bal')"
                btn-style="transparent"
              />
            </div>
            <div class="d-flex">
              <mew-select
                :items="coins"
                :label="$t('sendTx.amount')"
                class="mr-3"
              />
              <div class="position--relative flex-grow-1">
                <mew-input
                  :label="$t('sendTx.type')"
                  placeholder=" "
                  right-label="$23,232.93"
                  value="10.23472384"
                />
              </div>
            </div>

            <address-select
              :copy-tooltip="$t('common.copy')"
              :save-tooltip="$t('common.save')"
              :enable-save-address="true"
              :label="$t('sendTx.send-addr')"
              :items="addresses"
              :placeholder="$t('sendTx.enter-addr')"
              :success-toast="$t('sendTx.success.title')"
              :is-valid-address="true"
              @emitSelectedValue="getSelectedValue"
            />
          </div>

          <mew-expand-panel is-toggle has-dividers :panel-items="expandPanel">
            <template v-slot:panelBody1>
              <div>
                <mew-input label="Gas Price" placeholder=" " value="40" />
                <mew-input label="Gas Limit" placeholder=" " value="21000" />
              </div>

              <div class="d-flex justify-space-between px-5">
                <div class="mew-body font-weight-medium d-flex align-center">
                  {{ $t('sendTx.tx-fee') }}
                  <info-tooltip class="ml-1" text="Tx fees" />
                </div>
                <div>$0.177</div>
              </div>
              <divider dot class="mt-5" />
              <mew-input
                :label="$t('sendTx.add-data')"
                placeholder=" "
                value
                class="mt-10 mb-n5"
              />
            </template>
          </mew-expand-panel>

          <div class="text-center mt-12">
            <mew-button
              :title="$t('sendTx.send')"
              :has-full-width="false"
              button-size="xlarge"
            />
          </div>
          <div class="text-center mt-4">
            <mew-button
              :title="$t('sendTx.clear-all')"
              :has-full-width="false"
              button-size="small"
              btn-style="transparent"
            />
          </div>
        </interface-wrap>
      </mew6-white-sheet>
    </div>
    <div class="pa-4"></div>
  </v-container>
</template>

<script>
import interfaceWrap from '@/components/interface-wrap/InterfaceWrap';
import eth from '@/assets/images/currencies/icon-eth-blue.svg';
import divider from '@/components/dividerx/DividerX';

export default {
  components: {
    divider,
    interfaceWrap
  },
  data() {
    return {
      expandPanel: [
        {
          name: 'Advanced',
          subtext: 'Gas & Data'
        }
      ],
      addressValue: '',
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
      coins: [
        {
          name: 'ETH',
          subtext: 'Ethereum',
          value: 'Ethereum',
          img: eth
        }
      ]
    };
  },
  methods: {
    getSelectedValue(value) {
      this.addressValue = value;
    }
  }
};
</script>
