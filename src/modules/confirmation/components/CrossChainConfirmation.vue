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
                <app-qr-code
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
            and
            <router-link :to="termRoute" target="_blank"
              >Terms of Service</router-link
            >
          </div>
        </div>
      </template>
    </app-modal>
  </div>
</template>

<script setup>
import clipboardCopy from 'clipboard-copy';
import moment from 'moment';
import { isEmpty, debounce } from 'lodash';
import { computed, watch, onBeforeUnmount, ref } from 'vue';

import { Toast, SUCCESS } from '@/modules/toast/handler/handlerToast';
import qrDisabled from '@/assets/images/icons/qr-disabled.png';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { ROUTES_HOME } from '@/core/configs/configRoutes.js';

const MILLISECONDS = 1000;
const MINUTES = 20;
const SECONDS_IN_MINUTES = 60;

// props
const props = defineProps({
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
});

// data
const startingTime = moment(SECONDS_IN_MINUTES * MINUTES * MILLISECONDS);
const panelItems = [
  {
    name: 'View Details'
  }
];
const termRoute = { name: ROUTES_HOME.TERMS_OF_SERVICE.NAME };
const time = ref('20:00');
const counter = ref(() => {});

// computed
const buttonTitle = computed(() => `I sent the ${props.txObj?.fromType}`);
const sendWarning = computed(
  () => `You can send ${props.txObj?.fromType} to this address only once.`
);
const hideQr = computed(
  () => props.payinAddress && props.payinAddress.length > 42
);
const payinAddress = computed(
  () => props.txObj?.actualTrade?.response?.payinAddress
);
const fromImg = computed(() => props.txObj.fromImg);
const fromType = computed(() => props.txObj.fromType);
const fromVal = computed(
  () => formatFloatingPointValue(props.txObj.fromVal).value
);
const toType = computed(() => props.txObj.toType);
const toVal = computed(() => formatFloatingPointValue(props.txObj.toVal).value);
const toImg = computed(() => props.txObj.toImg);
const btnAction = computed(() => {
  if (timerFinished.value) {
    return locReset.value;
  }
  return userSent.value;
});
const timerFinished = computed(() => time.value === '00:00');
const refundAddress = computed(() => {
  if (!isEmpty(props.txObj)) {
    return props.txObj.refundAddress;
  }
  return '';
});
const fromCurrency = computed(() => {
  if (!isEmpty(props.txObj)) {
    return props.txObj.fromType;
  }
  return '';
});
const toCurrency = computed(() => {
  if (!isEmpty(props.txObj)) {
    return props.txObj.toType;
  }
  return '';
});
const payTill = computed(() => props.txObj?.actualTrade?.response?.payTill);
const rate = computed(() => {
  if (!isEmpty(props.txObj) && props.txObj.hasOwnProperty('selectedProvider')) {
    return formatFloatingPointValue(props.txObj.selectedProvider.rate).value;
  }
  return '';
});

// watch
watch(
  () => props.showCrossChainModal,
  newVal => {
    if (newVal) {
      if (moment().isBefore(payTill.value)) {
        time.value = startingTime.format('mm:ss');
        const throttledFunc = debounce(() => {
          const now = new Date();
          const deadline = moment(payTill.value).diff(now);
          if (timerFinished.value) {
            clearInterval(counter.value);
            counter.value = null;
          } else {
            time.value = moment.utc(deadline).format('mm:ss');
          }
        }, 200);
        counter.value = setInterval(throttledFunc, 1000);
      } else {
        time.value = '00:00';
      }
    } else {
      clearInterval(counter.value);
    }
  }
);
// beforeDestroy
onBeforeUnmount(() => {
  clearInterval(counter.value);
});

// methods
const copy = () => {
  clipboardCopy(payinAddress.value);
  Toast(`Copied ${payinAddress.value} successfully!`, {}, SUCCESS);
};

const locReset = () => {
  props.sentBtc(false);
  props.reset();
};

const userSent = () => {
  props.sentBtc(true);
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
