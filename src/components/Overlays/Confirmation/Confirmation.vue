<template>
  <BaseOverlay :open="open" :close="close" :back="true" close-text="Cancel">
    <OverlayTitle title="Confirmation" />
    <mew6-white-sheet class="overlay-content pa-7">
      <DataBlock class="mb-3">
        <v-row class="align-center ma-0">
          <v-col class="text-center pa-0">
            <div class="pa-5">
              <Blockie
                width="40px"
                height="40px"
                class="mx-auto mb-3"
                style="width: 40px;"
              />
              <div class="mew-caption textSecondary--text">FROM ADDRESS</div>
              <div>0xWERVFYASDFWE</div>
            </div>
          </v-col>
          <v-col cols="1" class="pa-0 text-center">
            <div
              class="d-flex align-center justify-center"
              style="
                width: 35px;
                height: 35px;
                border-radius: 100%;
                border: 10px soild white;
                background-color: white;
              "
            >
              <v-icon color="textSecondary">
                mdi-arrow-right
              </v-icon>
            </div>
          </v-col>
          <v-col class="text-center pa-0">
            <div class="pa-5">
              <Blockie
                width="40px"
                height="40px"
                class="mx-auto mb-3"
                style="width: 40px;"
              />
              <div class="mew-caption textSecondary--text">TO ADDRESS</div>
              <div>0xWERVFYASDFWE</div>
            </div>
          </v-col>
        </v-row>
      </DataBlock>
      <DataBlock class="mb-3">
        <div class="d-flex align-center justify-space-between px-8 py-6">
          <div>Domain name:</div>
          <div class="font-weight-medium">mewwallet.crypto</div>
        </div>
      </DataBlock>
      <DataBlock class="mb-3">
        <div class="px-8 py-6">
          <div class="d-flex align-start justify-space-between">
            <div class="mew-heading-3">Balance Remainning</div>
            <div class="text-right">
              <div class="mew-heading-3">$ 23,234.23</div>
              <div class="textSecondary--text">31.2342 ETH</div>
            </div>
          </div>
          <v-progress-linear
            v-if="false"
            color="basic"
            height="12"
            value="10"
            class="mt-2"
            rounded
          ></v-progress-linear>
          <mew-progress-bar :balance-obj="barData" />
          <div class="mt-3">
            <table style="width: 100%;" class="text-right">
              <tbody>
                <tr>
                  <td class="d-flex align-center">
                    <div class="pr-4">
                      <v-badge color="basic" dot offset-y="0" />
                    </div>
                    <div class="mew-caption textSecondary--text">
                      DOMAIN PRICE
                    </div>
                  </td>
                  <td>
                    -0.123423424 ETH
                  </td>
                  <td>
                    -$40.00
                  </td>
                </tr>
                <tr>
                  <td class="d-flex align-center">
                    <div class="pr-4">
                      <v-badge color="orange" dot offset-y="0" />
                    </div>
                    <div class="mew-caption textSecondary--text">
                      GAS FEE
                    </div>
                  </td>
                  <td>
                    -0.123423424 ETH
                  </td>
                  <td>
                    -$40.00
                  </td>
                </tr>
                <tr>
                  <td class="d-flex align-center">
                    <div class="pr-4">
                      <v-badge color="transparent" dot offset-y="0" />
                    </div>
                    <div class="mew-caption">
                      TOTAL PAY
                    </div>
                  </td>
                  <td class="font-weight-bold">
                    -0.123423424 ETH
                  </td>
                  <td class="font-weight-bold">
                    -$40.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </DataBlock>
      <mew-expand-panel
        :is-toggle="true"
        :panel-items="[{ name: 'Details', tooltip: '', subtext: '' }]"
      >
        <template v-slot:panelBody0>
          contents
        </template>
      </mew-expand-panel>

      <div class="text-center">
        <mew-button
          button-size="xlarge"
          title="Confirm & Pay"
          :has-full-width="false"
        ></mew-button>
      </div>
      <warning-sheet
        description="Make sure all your transaction details are CORRECT. Canceling or replacing transactions can not be guaranteed to work. You still be charged gas fee even transaction failing. Learn more"
        :link-obj="link"
      />
    </mew6-white-sheet>
  </BaseOverlay>
</template>

<script>
import BaseOverlay from '../BaseOverlay';
import OverlayTitle from '@/components/OverlayTitle';
import DataBlock from '@/web/components/Common/DataBlock';

export default {
  components: {
    BaseOverlay,
    OverlayTitle,
    DataBlock
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
      barData: { send: '5', fee: '1', total: '10' },
      link: {
        title: 'here...',
        url: 'https://www.myetherwallet.com/'
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.overlay-content {
  width: 100%;
  max-width: 600px;
}

.v-progress-linear--rounded {
  border-radius: 8px;
}
</style>
