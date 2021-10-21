<template>
  <div>
    <app-modal
      :show="showCrossChainModal"
      :title="title"
      :close="reset"
      :btn-action="btnAction"
      :btn-text="buttonTitle"
      :is-persistent="true"
      :accept-only="true"
      width="560"
      @close="reset"
    >
      <template #dialogBody>
        <div>
          <div class="d-flex display-section mx-auto flex-column pt-8">
            <!-- Please send -->
            <div class="py-3 text-center tableHeader border-radius--5px">
              <div class="mew-heading-4">Please Send</div>
              <div
                class="
                  mew-heading-4
                  d-flex
                  align-center
                  justify-center
                  pt-2
                  text-center
                "
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
                  'py-2 text-center mew-body',
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
                <qr-code :data="payinAddress" :height="160" :width="160" />
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
                class="
                  mew-heading-4
                  d-flex
                  align-center
                  justify-center
                  pt-2
                  text-center
                "
              >
                <img :src="toImg" width="30" class="mr-2" />
                <div class="mew-heading-2 no-decoration">
                  {{ toVal }}
                </div>
                <div class="mew-body pl-1">{{ toType }}</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </app-modal>
  </div>
</template>

<script>
import AppModal from '@/core/components/AppModal';
import clipboardCopy from 'clipboard-copy';
import { Toast, INFO } from '@/modules/toast/handler/handlerToast';
import moment from 'moment';
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
    return { startingTime: moment(60 * 0.25 * 1000), counter: () => {} };
  },
  computed: {
    time() {
      return this.startingTime.format('mm:ss');
    },
    buttonTitle() {
      return `I sent the ${this.txObj?.fromType}`;
    },
    sendWarning() {
      return `You can send ${this.txObj?.fromType} to this address only once.`;
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
      return this.txObj.fromVal;
    },
    toType() {
      return this.txObj.toType;
    },
    toVal() {
      return this.txObj.toVal;
    },
    toImg() {
      return this.txObj.toImg;
    },
    btnAction() {
      if (this.timerFinished) {
        return this.reset;
      }
      return this.sentBtc;
    },
    timerFinished() {
      return this.time === '00:00';
    }
  },
  watch: {
    showCrossChainModal(newVal) {
      if (newVal) {
        this.startingTime = moment(60 * 0.25 * 1000);
        this.counter = setInterval(() => {
          if (this.timerFinished) {
            clearInterval(this.counter);
          } else {
            this.startingTime = moment(
              this.startingTime.subtract(1, 'seconds')
            );
          }
        }, 1000);
      } else {
        clearInterval(this.counter);
      }
    }
  },
  methods: {
    copy() {
      clipboardCopy(this.txObj.actualTrade.response.payinAddress);
      Toast(
        `Copied ${this.txObj.actualTrade.response.payinAddress} successfully!`,
        {},
        INFO
      );
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
