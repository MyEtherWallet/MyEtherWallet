<template>
  <div class="interface-address">
    <div class="info-block address">
      <div class="block-image">
        <blockie
          :address="address"
          :size="8"
          :scale="16"
          width="64px"
          height="64px"
          class="blockie-image"
        />
        <input
          ref="copyAddress"
          :value="address"
          class="hidden-input"
          autocomplete="off"
        />
      </div>
      <div class="block-content">
        <div class="information-container">
          <h2>{{ $t('common.address') }}</h2>
          <p class="address">{{ address }}</p>
        </div>
        <div class="icon-container">
          <b-btn id="print" class="custom-tooltip" @click="print">
            <img src="~@/assets/images/icons/printer-white.svg" />
          </b-btn>
          <b-btn id="copy" class="custom-tooltip" @click="copy">
            <img src="~@/assets/images/icons/copy.svg" />
          </b-btn>
          <b-btn
            v-if="hasMultipleAddr"
            id="switch"
            class="custom-tooltip"
            @click="switchAddr"
          >
            <img src="~@/assets/images/icons/change.svg" />
          </b-btn>
          <b-popover
            :content="$t('popover.print')"
            target="print"
            placement="top"
            triggers="hover"
            title=""
          />
          <b-popover
            :content="$t('popover.copy')"
            target="copy"
            placement="top"
            triggers="hover"
            title=""
          />
          <b-popover
            :content="$t('popover.switchAddress')"
            target="switch"
            placement="top"
            triggers="hover"
            title=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Blockie from '@/components/Blockie';
import { mapGetters } from 'vuex';

export default {
  components: {
    blockie: Blockie
  },
  props: {
    address: {
      type: String,
      default: ''
    },
    triggerAlert: {
      type: Function,
      default: function() {}
    },
    print: {
      type: Function,
      default: function() {}
    },
    switchAddr: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      hasMultipleAddr: false
    };
  },
  computed: {
    ...mapGetters({
      wallet: 'wallet'
    })
  },
  mounted() {
    if (this.wallet !== null) {
      if (
        this.wallet.identifier !== 'priv_key' &&
        this.wallet.identifier !== 'keystore' &&
        this.wallet.identifier !== 'MEWconnect'
      ) {
        this.hasMultipleAddr = true;
      } else {
        this.hasMultipleAddr = false;
      }
    }
  },
  methods: {
    copy() {
      this.triggerAlert('Address Copied!');
      this.$refs.copyAddress.select();
      document.execCommand('copy');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceAddress.scss';
</style>
