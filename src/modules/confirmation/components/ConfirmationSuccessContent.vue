<template>
  <div>
    <!--
    ====================================================================================
      Lottie or icon
    =====================================================================================
    -->
    <div v-if="!isSwap" v-lottie="'checkmark'" style="height: 120px" />
    <!--
    ====================================================================================
      Body
    =====================================================================================
    -->
    <div class="mew-body">
      {{ bodyText }}
    </div>
    <!--
    ====================================================================================
      Links
    =====================================================================================
    -->
    <v-row class="justify-sm-space-between align-center pt-3" dense>
      <v-col cols="12" sm="auto" class="pb-2" order-sm="3">
        <a
          class="d-flex justify-center justify-sm-end"
          @click.stop="viewProgress"
          >View Progress</a
        >
      </v-col>
      <v-col cols="12" sm="auto" class="pb-2">
        <a
          rel="noopener noreferrer"
          target="_blank"
          :href="linkEthercan"
          class="d-flex justify-center justify-sm-start"
          >View on Etherscan
          <v-icon color="primary" small>mdi-launch</v-icon></a
        >
      </v-col>
      <v-col
        v-if="network.type.isEthVMSupported.supported"
        cols="12"
        sm="auto"
        class="pb-2"
      >
        <a
          rel="noopener noreferrer"
          target="_blank"
          :href="linkEthvm"
          class="d-flex justify-center"
          >View on EthVM <v-icon color="primary" small>mdi-launch</v-icon></a
        >
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { EventBus } from '@/core/plugins/eventBus';
import { mapGetters } from 'vuex';

export default {
  name: 'ConfirmationSuccessContent',
  props: {
    isSwap: {
      type: Boolean,
      default: false
    },
    linkEthercan: {
      type: String,
      default: 'https://www.ethvm.com/'
    },
    linkEthvm: {
      type: String,
      default: 'https://www.ethvm.com/'
    },
    reset: {
      type: Function,
      default: function () {
        return {};
      }
    }
  },
  computed: {
    ...mapGetters('global', ['network']),
    /**
     * Property returns strign, deodning whether or not this is a swap or send
     */
    bodyText() {
      return this.isSwap
        ? 'Once completed, the token amount will be deposited to your wallet. This should take a few minutes depending on how congested the Ethereum network is.'
        : 'Once completed, the token amount will be deposited to the address you provided. This should take a few minutes depending on how congested the Ethereum network is.';
    }
  },
  methods: {
    /**
     * Method calls
     */
    viewProgress() {
      EventBus.$emit('openNotifications');
      this.reset();
    }
  }
};
</script>

<style></style>
