<template>
  <div>
    <app-modal
      :show="showCrossChainModal"
      :title="title"
      :close="locReset"
      :btn-action="btnAction"
      :btn-text="buttonTitle"
      :btn-enabled="!timerFinished"
      :is-persistent="true"
      :accept-only="true"
      width="560"
      @close="locReset"
    >
      <template #dialogBody>
        <div>
          <div class="d-flex display-section mx-auto flex-column pt-8">
            <!-- Please send -->
            <div class="py-3 text-center tableHeader border-radius--5px">
              <div class="mew-heading-4">Please Send</div>
              <div
                class="mew-heading-4 d-flex align-center justify-center pt-2 text-center"
              >
                <img :src="fromImg" width="30" class="mr-2" />
                <div class="mew-heading-2 no-decoration">
                  {{ fromVal }}
                </div>
                <div class="mew-body pl-1">{{ fromType }}</div>
              </div>
            </div>
            <!-- QR Section -->
            <div class="py-3 text-center grey-border border-radius--5px my-1">
              <div class="mew-header-block inputLabel--text mb-0">
                TO ADDRESS
              </div>
              <div
                :class="[
                  'py-2 text-center mew-body word-break--break-all',
                  timerFinished ? 'disabled--text' : ''
                ]"
              >
                {{ timerFinished ? 'Address expired' : payinAddress }}
              </div>
              <div
                v-if="!timerFinished"
                class="text-center primary--text cursor--pointer"
                @click="copy"
              >
                Copy Address
              </div>
              <div v-if="!timerFinished">
                <qr-code
                  v-if="!hideQr"
                  :data="payinAddress"
                  :height="160"
                  :width="160"
                />
              </div>
              <div v-else class="d-flex align-center justify-center">
                <v-img
                  :src="qrDisabled"
                  width="160"
                  height="160"
                  max-width="160"
                  max-height="160"
                />
              </div>
              <div v-if="!timerFinished" class="mew-body textSecondary--text">
                {{ sendWarning }}
              </div>
              <div
                :class="[
                  timerFinished ? 'error--text' : 'textSecondary--text',
                  'mew-body'
                ]"
              >
                {{ time }}
              </div>
            </div>
            <!-- you'll get -->
            <div class="py-3 text-center tableHeader border-radius--5px">
              <div class="mew-heading-4">You'll get</div>
              <div
                class="mew-heading-4 d-flex align-center justify-center pt-2 text-center"
              >
                <img :src="toImg" width="30" class="mr-2" />
                <div class="mew-heading-2 no-decoration">
                  {{ toVal }}
                </div>
                <div class="mew-body pl-1">{{ toType }}</div>
              </div>
            </div>
          </div>
          <div class="py-4">
            <mew-expand-panel :panel-items="panelItems">
              <template #panelBody1>
                <div class="px-6 pb-6">
                  <div class="d-flex align-center justify-space-between">
                    <div>Refund Address:</div>
                    <div class="word-break--break-all">{{ refundAddress }}</div>
                  </div>
                  <div class="d-flex align-center justify-space-between pt-2">
                    <div>Rate:</div>
                    <div>
                      1 {{ fromCurrency }} = {{ rate }}
                      {{ toCurrency }}
                    </div>
                  </div>
                </div>
              </template>
            </mew-expand-panel>
          </div>
          <div>
            By sending {{ fromCurrency }} to the above address, I agree to the
            <a href="https://changelly.com/aml-kyc" target="_blank">
              Changelly AML/KYC
            </a>
            and <router-link :to="termRoute">Terms of Service</router-link>
          </div>
        </div>
      </template>
    </app-modal>
  </div>
</template>

<script>
import clipboardCopy from 'clipboard-copy';
import moment from 'moment';
import AppModal from '@/core/components/AppModal';
import { Toast, INFO } from '@/modules/toast/handler/handlerToast';
import qrDisabled from '@/assets/images/icons/qr-disabled.png';
import { isEmpty, debounce } from 'lodash';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { ROUTES_HOME } from '@/core/configs/configRoutes.js';

const MILLISECONDS = 1000;
const MINUTES = 20;
const SECONDS_IN_MINUTES = 60;
export default {
  name: 'CrossChainModal',
  components: { AppModal },
  props: {
    showCrossChainModal: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    txObj: {
      type: Object,
      default: () => {}
    },
    reset: {
      type: Function,
      default: () => {}
    },
    sentBtc: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      time: '20:00',
      startingTime: moment(SECONDS_IN_MINUTES * MINUTES * MILLISECONDS),
      counter: () => {},
      qrDisabled: qrDisabled,
      panelItems: [
        {
          name: 'View Details'
        }
      ],
      termRoute: ROUTES_HOME.TERMS_OF_SERVICE.NAME
    };
  },
  computed: {
    buttonTitle() {
      return `I sent the ${this.txObj?.fromType}`;
    },
    sendWarning() {
      return `You can send ${this.txObj?.fromType} to this address only once.`;
    },
    hideQr() {
      return this.payinAddress && this.payinAddress.length > 42;
    },
    payinAddress() {
      return this.txObj?.actualTrade?.response?.payinAddress;
    },
    fromImg() {
      return this.txObj.fromImg;
    },
    fromType() {
      return this.txObj.fromType;
    },
    fromVal() {
      return formatFloatingPointValue(this.txObj.fromVal).value;
    },
    toType() {
      return this.txObj.toType;
    },
    toVal() {
      return formatFloatingPointValue(this.txObj.toVal).value;
    },
    toImg() {
      return this.txObj.toImg;
    },
    btnAction() {
      if (this.timerFinished) {
        return this.locReset;
      }
      return this.userSent;
    },
    timerFinished() {
      return this.time === '00:00';
    },
    refundAddress() {
      if (!isEmpty(this.txObj)) {
        return this.txObj.refundAddress;
      }
      return '';
    },
    fromCurrency() {
      if (!isEmpty(this.txObj)) {
        return this.txObj.fromType;
      }
      return '';
    },
    toCurrency() {
      if (!isEmpty(this.txObj)) {
        return this.txObj.toType;
      }
      return '';
    },
    rate() {
      if (
        !isEmpty(this.txObj) &&
        this.txObj.hasOwnProperty('selectedProvider')
      ) {
        return formatFloatingPointValue(this.txObj.selectedProvider.rate).value;
      }
      return '';
    }
  },
  watch: {
    showCrossChainModal(newVal) {
      if (newVal) {
        if (moment().isBefore(this.txObj.actualTrade.response.payTill)) {
          // const diff = moment(this.txObj.actualTrade.response.payTill).diff(
          //   moment()
          // );
          // this.startingTime = moment(diff);
          this.time = this.startingTime.format('mm:ss');
          const throttledFunc = debounce(() => {
            const now = new Date();
            const deadline = moment(
              this.txObj.actualTrade.response.payTill
            ).diff(now);
            if (this.timerFinished) {
              clearInterval(this.counter);
              this.counter = null;
            } else {
              // this.startingTime = moment(
              //   this.startingTime.subtract(1, 'seconds')
              // );
              this.time = moment.utc(deadline).format('mm:ss');
            }
          }, 200);
          this.counter = setInterval(throttledFunc, 1000);
        } else {
          this.time = '00:00';
        }
      } else {
        clearInterval(this.counter);
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.counter);
  },
  methods: {
    copy() {
      clipboardCopy(this.txObj.actualTrade.response.payinAddress);
      Toast(
        `Copied ${this.txObj.actualTrade.response.payinAddress} successfully!`,
        {},
        INFO
      );
    },
    locReset() {
      this.sentBtc(false);
      this.reset();
    },
    userSent() {
      this.sentBtc(true);
    }
  }
};
</script>
<style lang="scss" scoped>
.display-section {
  width: 320px;
}

.grey-border {
  border: 1px solid var(--v-tableHeader-base);
}
</style>
