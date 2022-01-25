<template>
  <div class="mew-component--mobule-buy-eth pt-10 custom-scroll-bar">
    <!-- ============================================================== -->
    <!-- Address select -->
    <!-- ============================================================== -->
    <mew-address-select label="To Address" />

    <!-- ============================================================== -->
    <!-- Fiat currency select -->
    <!-- ============================================================== -->
    <div class="d-flex align-center justify-space-between mt-3 mb-3">
      <div class="font-weight-medium">Select amount</div>
      <v-select
        style="margin-top: -1px; max-width: 100px"
        hide-details
        :items="fiatCurrencyItems"
        dense
        solo
        flat
        append-icon="mdi-chevron-down"
      ></v-select>
    </div>

    <!-- ============================================================== -->
    <!-- Fiat currency pre-selection buttons -->
    <!-- ============================================================== -->
    <v-row dense>
      <v-col v-for="(button, bkey) in buttons" :key="bkey" cols="6">
        <mew-button
          style="height: 96px !important"
          has-full-width
          :btn-style="buttonSelected == button.id ? '' : 'outline'"
          :class="buttonSelected == button.id ? '' : 'not-selected'"
          @click.native="buttonClicked(button.id)"
        >
          <div class="py-5">
            <!-- Button top text -->
            <div class="mb-1">
              <div
                v-if="button.usd"
                class="letter-spacing--none mew-heading-1"
                :class="
                  buttonSelected == button.id
                    ? 'whiteAlways--text'
                    : 'textDark--text'
                "
              >
                ${{ button.usd }}
              </div>
              <div
                v-if="button.title"
                class="letter-spacing--none mew-heading-1"
                :class="
                  buttonSelected == button.id
                    ? 'whiteAlways--text'
                    : 'textDark--text'
                "
              >
                {{ button.title }}
              </div>
            </div>

            <!-- Button bottom text -->
            <div>
              <div
                v-if="button.eth"
                class="letter-spacing--none mew-label"
                :class="
                  buttonSelected == button.id
                    ? 'whiteAlways--text'
                    : 'textMedium--text'
                "
              >
                {{ button.eth }} ETH
              </div>
              <div
                v-if="button.subTitle"
                class="letter-spacing--none mew-label"
                :class="
                  buttonSelected == button.id
                    ? 'whiteAlways--text'
                    : 'textMedium--text'
                "
              >
                {{ button.subTitle }}
              </div>
            </div>
          </div>
        </mew-button>
      </v-col>
    </v-row>

    <!-- ============================================================== -->
    <!-- Summary -->
    <!-- ============================================================== -->
    <div class="mt-6">
      <div class="d-flex align-center justify-space-between">
        <div class="font-weight-medium">Summary</div>
        <div class="mew-label textMedium--text d-flex align-center">
          <v-icon color="textMedium" small class="mr-1">
            mdi-clock-time-three-outline
          </v-icon>
          Valid for 9s
        </div>
      </div>
      <div class="d-flex align-center justify-space-between mt-4">
        <div>ETH price</div>
        <div class="text-right">$4,352.54</div>
      </div>
      <div class="d-flex align-center justify-space-between mt-4">
        <div>You get</div>
        <div class="text-right">0.234827 ETH</div>
      </div>

      <!-- ============================================================== -->
      <!-- (Expending block) Show fees -->
      <!-- ============================================================== -->
      <expending-block class="mt-4" btn-right btn-bottom>
        <template #headerShow>
          <div class="greenPrimary--text">Show fees</div>
        </template>
        <template #headerHide>
          <div class="greenPrimary--text">Hide fees</div>
        </template>
        <template #content>
          <div>
            <div class="d-flex align-center justify-space-between mb-4">
              <div class="textLight--text">Processing fee</div>
              <div class="textLight--text text-right">0.234827 ETH</div>
            </div>
            <div class="d-flex align-center justify-space-between mb-4">
              <div class="textLight--text">Network fee</div>
              <div class="textLight--text text-right">0.234827 ETH</div>
            </div>
          </div>
        </template>
      </expending-block>

      <div class="d-flex align-center justify-space-between mt-4">
        <div class="font-weight-medium">Total</div>
        <div class="text-right">$1,000 ETH</div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- Buy button -->
    <!-- ============================================================== -->
    <div>
      <div class="d-flex justify-center mt-9 mb-7">
        <mew-checkbox label="Send ETH to current wallet adree" />
      </div>
      <mew-button title="Buy now" btn-size="xlarge" has-full-width />
    </div>
  </div>
</template>

<script>
import ExpendingBlock from '@/core/components/AppExpendingBlock';
export default {
  name: 'ModuleBuyEth',
  components: { ExpendingBlock },
  data() {
    return {
      fiatCurrencyItems: ['USD'],
      buttonSelected: '1',
      buttons: [
        { id: '1', usd: '100', eth: '0.16' },
        { id: '2', usd: '100', eth: '0.16' },
        { id: '3', usd: '100', eth: '0.16' },
        { id: '4', usd: '100', eth: '0.16' },
        { id: '5', usd: '100', eth: '0.16' },
        { id: '6', title: 'Custom', subTitle: 'Up to $20,000' }
      ]
    };
  },
  methods: {
    buttonClicked(btnId) {
      this.buttonSelected = btnId;
    }
  }
};
</script>

<style lang="scss" scoped>
// Force set button border color(greyMedium) for not selected buttons
.not-selected {
  border: 1px solid var(--v-greyMedium-base);
}
</style>
