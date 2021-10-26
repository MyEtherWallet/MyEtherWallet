<template>
  <mew-overlay
    :show-overlay="show"
    :title="'Confirmation'"
    left-btn-text="back"
    :back="backFunc"
    :close="backFunc"
  >
    <template #mewOverlayBody>
      <v-sheet max-width="600px" class="pa-8">
        <div class="text-center mb-5">
          <h2 class="error--text">{{ timeLeftStr }}</h2>
          <div class="searchText--text font-weight-bold text-uppercase">
            Time Remaining
          </div>
        </div>
        <from-to-block
          :from="from"
          :to="to"
          :from-type="fromType"
          :to-type="toType"
          :from-img="fromImg"
          :to-img="toImg"
          :from-val="fromVal"
          :to-val="toVal"
          class="mb-8"
        />
        <div class="d-flex justify-center my-8">
          <mew-button
            btn-size="xlarge"
            title="Confirm and Swap"
            :disabled="!sendEnabled"
            @click.native="send"
          />
        </div>
        <mew-warning-sheet :description="warningDescription" />
      </v-sheet>
    </template>
  </mew-overlay>
</template>

<script>
import fromToBlock from './SwapFromToBlock';

export default {
  components: {
    fromToBlock
  },
  props: {
    to: {
      type: String,
      default: ''
    },
    from: {
      type: String,
      default: ''
    },
    fromType: {
      type: String,
      default: ''
    },
    fromImg: {
      type: String,
      default: ''
    },
    toType: {
      type: String,
      default: ''
    },
    toImg: {
      type: String,
      default: ''
    },
    fromVal: {
      type: String,
      default: '0'
    },
    toVal: {
      type: String,
      default: '0'
    },
    show: {
      type: Boolean,
      default: false
    },
    validUntil: {
      type: Number,
      default: 0
    },
    backFunc: {
      type: Function,
      default: () => {}
    },
    send: {
      type: Function,
      default: () => {}
    }
  },
  data: function () {
    return {
      timeLeftStr: '0:0',
      sendEnabled: true,
      timeLeftTimer: null,
      warningDescription:
        'Make sure all your transaction details are CORRECT. Canceling or replacing transactions can not be guaranteed to work. You still be charged gas fee even transaction failing. Learn more here…'
    };
  },
  computed: {},

  mounted() {
    this.timeLeftTimer = setInterval(() => {
      this.timeLeftStr = this.getTimeLeft().str;
      if (this.getTimeLeft().seconds < 0) this.sendEnabled = false;
      else this.sendEnabled = true;
    }, 1000);
  },
  beforeUnmount() {
    clearInterval(this.timeLeftTimer);
  },
  methods: {
    getTimeLeft() {
      const distance = this.validUntil - new Date().getTime();
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      return {
        str: distance > 0 ? minutes + ':' + seconds : '0:0',
        seconds: distance
      };
    }
  }
};
</script>

<style lang="scss">
.v-application .warning {
  border-radius: 10px;
}
</style>
