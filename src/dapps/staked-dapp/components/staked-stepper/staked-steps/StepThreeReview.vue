<template>
  <!--
  <div class="review-step d-flex">
    <h4 class="main-title">{{ $t('dappsStaked.review-enable') }}</h4>
    <div class="review-container">
      <div class="d-flex">
        <span class="title">{{ $t('dappsStaked.amount-stake') }}</span>
        <i18n
          class="align-right"
          tag="span"
          path="dappsStaked.validator-created"
        >
          <span slot="number" class="number">{{ details.amount / 32 }}</span>
          <span slot="validator">{{ validatorPl }}</span>
        </i18n>
      </div>
      <div class="d-flex mt-4">
        <span>{{ $t('dappsStaked.amount') }}:</span>
        <span class="eth-value"
          >{{ details.amount }} {{ $t('common.currency.eth') }}
          <span class="convert-value ml-1"
            >({{ '$' + usdPrice(details.amount) }})</span
          ></span
        >
      </div>
      <div class="d-flex mt-4">
        <span>{{ $t('dappsStaked.one-time-fee') }}:</span>
        <span class="eth-value"
          >{{ oneTimeFee }} {{ $t('common.currency.eth') }}
          <span class="convert-value">({{ '$' + usdPrice(oneTimeFee) }})</span>
        </span>
      </div>
      <div class="d-flex mt-4">
        <span>{{ $t('dappsStaked.total') }}:</span>
        <span class="eth-value"
          >{{ getTotal }} {{ $t('common.currency.eth') }}
          <span class="convert-value">({{ '$' + usdPrice(getTotal) }})</span>
        </span>
      </div>
    </div>
    <div class="address-container mt-3 d-flex">
      <span class="title">{{ $t('dappsStaked.withdraw-title') }}</span>
      <span class="address mt-2">{{ details.address }}</span>
    </div>
    <div class="checkboxes-container d-flex">
      <label class="switch mt-4 d-flex">
        <input type="checkbox" @click="agreeBeaconChain" />
        <span>{{ $t('dappsStaked.agree-beacon-chain') }}</span>
      </label>
      <label class="switch mt-4 d-flex">
        <input type="checkbox" @click="agreeFundsLost" />
        <span>{{ $t('dappsStaked.funds-be-lost') }}</span>
      </label>
      <label class="switch mt-4 d-flex">
        <input type="checkbox" @click="agree" />
        <i18n tag="span" path="dappsStaked.read-and-agree">
          <a
            slot="staked"
            target="_blank"
            href="https://staked.us/terms/"
            class="link"
            >Staked.us</a
          >
          <span slot="terms-of-service">{{
            $t('dappsStaked.terms-of-service-title')
          }}</span>
        </i18n>
      </label>
    </div>
    <v-row class="mx-0 top-pad">
      <v-col class="pl-4" cols="6">
        <mew-button
          :loading="false"
          :has-full-width="true"
          btn-size="xlarge"
          title="back"
          @click.native="back"
        />
      </v-col>
      <v-col class="pl-4" cols="6">
        <mew-button
          :disabled="emitWhenAllIsValid"
          :loading="false"
          :has-full-width="true"
          btn-size="xlarge"
          :title="$t('dappsStaked.enable-staking')"
          @click.native="doNext"
        />
      </v-col>
    </v-row>

    {{ details }}
  </div>
  -->
  <div
    class="dapps--staked--stepper--steps--review mx-auto pb-15"
    style="max-width: 550px"
  >
    <div class="mew-heading-2 py-12 text-center">Review and stake</div>

    <v-row>
      <v-col>
        <div class="overlayBg pa-5 d-flex align-center">
          <div class="mr-4">
            <img
              src="@/assets/images/icons/icon-colorful-eth.svg"
              height="40"
              alt="Eth2"
            />
          </div>
          <div>
            <div>Staking</div>
            <div>32 ETH</div>
            <div>$123,965.45</div>
          </div>
        </div>
      </v-col>
      <v-col>
        <div class="overlayBg pa-5 d-flex align-center">
          <div class="mr-4">
            <img
              src="@/assets/images/icons/icon-colorful-eth.svg"
              height="40"
              alt="Eth2"
            />
          </div>
          <div>
            <div>Your withdrawal address</div>
            <div>Ethereum 2.0</div>
            <div>0x8634534344236234634</div>
          </div>
        </div>
      </v-col>
    </v-row>

    <div class="mt-7">
      <div class="d-flex align-center justify-space-between">
        <div>Network fee</div>
        <div>0.013234 ETH / $93.12</div>
      </div>
      <div class="d-flex align-center justify-space-between">
        <div>Service fee</div>
        <div>0.013234 ETH / $93.12</div>
      </div>
      <div class="d-flex align-center justify-space-between">
        <div>Total</div>
        <div>0.013234 ETH / $93.12</div>
      </div>
    </div>

    <message-block class="mt-12">
      <mew-checkbox
        label="I understand that Staking is currently a one-way-street and won't be able to get my fund back until an unknown date in the future when transfers are enabled in Eth2."
      ></mew-checkbox>
      <mew-checkbox
        label="I understand that staking involves slashing risks and my funds can be lost."
      ></mew-checkbox>
      <mew-checkbox
        label="I have read and agreed to Staked.us terms of service. This Staking feature is provided by Staked.us, and MEW is not liable for it's services."
      ></mew-checkbox>
    </message-block>

    <phrase-block class="mt-10 text-center">
      <div>
        We will prepare validators for you. After that you can confirm and stale
        your ETH.
      </div>
      <mew-button
        btn-size="xlarge"
        class="mt-3"
        title="Prepare for staking"
      ></mew-button>
    </phrase-block>

    <phrase-block class="mt-10 text-center">
      <div>Preparing validators</div>
      <div>
        This usually takes ~20 seconds, in rare cases it can take up to 10 min.
      </div>
      <v-progress-linear
        class="mt-4"
        indeterminate
        color="primary"
      ></v-progress-linear>
    </phrase-block>

    <phrase-block class="mt-10 text-center mew-heading-4">
      <v-icon color="primary" class="mr-2">mdi-check-circle</v-icon>
      Ready to stake
    </phrase-block>

    <div
      class="
        mt-10
        d-flex
        flex-column-reverse flex-md-row
        align-center
        justify-center
      "
    >
      <mew-button
        btn-size="xlarge"
        class="d-block ma-2"
        title="Back"
        btn-style="outline"
      />
      <mew-button
        btn-size="xlarge"
        class="d-block ma-2"
        title="Stake 32 ETH"
        @click.native="isOpenVerify = true"
      >
      </mew-button>
    </div>

    <!--
    ======================================================
    Download keystore file popup window
    ======================================================
    -->
    <popup v-model="isOpenVerify" title="Verify transaction">
      <v-row>
        <v-col>
          <div class="overlayBg pa-5 d-flex align-center">
            <div class="mr-4">
              <img
                src="@/assets/images/icons/icon-colorful-eth.svg"
                height="40"
                alt="Eth2"
              />
            </div>
            <div>
              <div>Staking</div>
              <div>32 ETH</div>
              <div>$123,965.45</div>
            </div>
          </div>
        </v-col>
        <v-col>
          <div class="overlayBg pa-5 d-flex align-center">
            <div class="mr-4">
              <img
                src="@/assets/images/icons/icon-colorful-eth.svg"
                height="40"
                alt="Eth2"
              />
            </div>
            <div>
              <div>Your withdrawal address</div>
              <div>Ethereum 2.0</div>
              <div>0x8634534344236234634</div>
            </div>
          </div>
        </v-col>
      </v-row>

      <div class="mt-7">
        <div class="d-flex align-center justify-space-between">
          <div>Network fee</div>
          <div>0.013234 ETH / $93.12</div>
        </div>
        <div class="d-flex align-center justify-space-between">
          <div>Service fee</div>
          <div>0.013234 ETH / $93.12</div>
        </div>
        <div class="d-flex align-center justify-space-between">
          <div>Total</div>
          <div>0.013234 ETH / $93.12</div>
        </div>
      </div>

      <mew-warning-sheet
        class="mt-4 mb-5"
        description="Make sure all the information is correct. Canceling or reversing a transaction cannot be guaranteed. You will still be charged gas fee even if transaction fails."
      />

      <mew-expand-panel :panel-items="txDetails"></mew-expand-panel>

      <div
        class="
          mt-10
          d-flex
          flex-column-reverse flex-md-row
          align-center
          justify-center
        "
      >
        <mew-button
          btn-size="xlarge"
          class="d-block ma-2"
          title="Back"
          btn-style="outline"
        />
        <mew-button
          btn-size="xlarge"
          class="d-block ma-2"
          title="Confirm and send"
          @click.native="isOpenVerify = true"
        >
        </mew-button>
      </div>
    </popup>
  </div>
</template>

<script>
import Popup from '@/core/components/AppPopup.vue';
import PhraseBlock from '@/components/PhraseBlock';
import MessageBlock from '@/core/components/AppMessageBlock';
import BigNumber from 'bignumber.js';
import configNetworkTypes from '@/dapps/staked-dapp/handlers/configNetworkTypes';
import { mapState, mapGetters } from 'vuex';

export default {
  components: { Popup, MessageBlock, PhraseBlock },
  props: {
    details: {
      type: Object,
      default: () => {}
    },
    next: {
      type: Function,
      default: function () {}
    },
    back: {
      type: Function,
      default: function () {}
    }
  },
  data() {
    return {
      txDetails: [
        {
          name: 'Transaction details'
        }
      ],
      isOpenVerify: false,
      oneTimeFee: '',
      agreed: false,
      agreedBeaconChain: false,
      agreedFundsLost: false
    };
  },
  computed: {
    ...mapGetters('global', ['network']),
    ...mapState('wallet', ['web3']),
    getTotal() {
      return new BigNumber(this.oneTimeFee)
        .plus(this.details.amount)
        .toFixed(4);
    },
    validatorPl() {
      const isPlural = this.details.amount / 32 > 1 ? 2 : 1;
      return this.$tc('dappsStaked.validator', isPlural);
    },
    emitWhenAllIsValid() {
      if (this.agreed && this.agreedBeaconChain && this.agreedBeaconChain) {
        this.$emit('completed', true, {
          key: 'review',
          value: true
        });
        return false;
      }
      return true;
    }
  },
  mounted() {
    /*
    this.getFees();
    // "multiwatch" watcher
    this.$watch(
      () => {
        // returns the value to callback when this changes
        return this.agreed && this.agreedBeaconChain && this.agreedFundsLost;
      },
      function (val) {
        if (val) {
          this.$emit('completed', true, {
            key: 'review',
            value: true
          });
        } else {
          this.$emit('completed', false, {
            key: 'review',
            value: false
          });
        }
      },
      {
        immediate: true
      }
    );
    */
  },
  methods: {
    async getFees() {
      const batchContract =
        configNetworkTypes.network[this.network.type.name].batchContract;
      const abi = [
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'numValidators',
              type: 'uint256'
            }
          ],
          name: 'getFees',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        }
      ];
      const contract = new this.web3.eth.Contract(abi, batchContract);
      const fees = await contract.methods
        .getFees(this.details.amount / 32)
        .call();
      this.oneTimeFee = this.web3.utils.fromWei(
        new BigNumber(fees).toString(),
        'ether'
      );
    },
    usdPrice(amount) {
      if (this.details.ethPrice) {
        return new BigNumber(this.details.ethPrice).times(amount);
      }
      return 0;
    },
    agree() {
      this.agreed = !this.agreed;
    },
    agreeBeaconChain() {
      this.agreedBeaconChain = !this.agreedBeaconChain;
    },
    agreeFundsLost() {
      this.agreedFundsLost = !this.agreedFundsLost;
    },
    doNext() {
      console.log('do next'); // todo remove dev item
      this.next();
    }
  }
};
</script>

<style lang="scss" scoped>
//@import 'Review.scss';
</style>
