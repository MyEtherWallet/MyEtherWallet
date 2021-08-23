<!--
=====================================================================================
 Access Wallet - Keepkey
=====================================================================================
-->
<template>
  <!-- <div>
    <span>Deviation</span>
    <mew-select />
  </div> -->
  <div>
    <div class="d-flex flex-column">
      <span class="mew-heading-2 mb-2"> Enter your PIN. </span>
      <span class="mew-heading-4 mb-5">
        The PIN layout is displayed on your Hardware wallet.
      </span>
    </div>
    <mew-input v-model="pin" type="password" class="mb-5" />
    <v-container
      class="mb-8 pa-0 d-flex flex-column align-center justify-center"
    >
      <v-row class="keypad" no-gutters>
        <v-col v-for="(number, idx) in numbers" :key="idx" cols="4">
          <div
            :class="[
              'rounded pin mr-2 mb-2 d-flex cursor-pointer align-center justify-center',
              pinEnabled ? 'superPrimary' : 'tableHeader'
            ]"
            @click="pin += number"
          >
            <div
              :class="['pin-inner-circle', pinEnabled ? 'primary' : 'disabled']"
            ></div>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <mew-button @click.native="unlock" title="Unlock wallet" btn-size="xlarge" has-full-width />
  </div>
</template>

<script>
import { EventBus } from '@/core/plugins/eventBus';

export default {
  name: 'AccessWalletKeepkey',
  props: {
    paths: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      callback: () => [],
      pinEnabled: false,
      pin: '',
      numbers: ['7', '8', '9', '4', '5', '6', '1', '2', '3']
    };
  },
  watch: {
    pin(newValue) {
      if (newValue === null) {
        this.pin = '';
      }
    }
  },
  created() {
    EventBus.$on('enablePin', (deviceInfo, callback) => {
      this.callback = callback;
      // this.deviceInfo = deviceInfo;
      this.pinEnabled = true;
    });
  },
  mounted() {
    this.$emit('setPath', this.paths[0]);
  },
  methods: {
    unlock() {
      this.callback(this.pin);
    }
  }
};
</script>

<style lang="scss" scoped>
.keypad {
  width: 266px;
  .pin {
    height: 80px;
    width: 80px;
    .pin-inner-circle {
      border-radius: 50%;
      height: 20px;
      width: 20px;
    }
  }
}
</style>
