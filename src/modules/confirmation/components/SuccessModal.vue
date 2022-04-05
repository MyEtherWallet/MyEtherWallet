<template>
  <div>
    <app-modal
      :show="showSuccessModal"
      :title="successTitle"
      :close="resetSuccess"
      :close-only="true"
      width="480"
      @close="resetSuccess"
    >
      <template #dialogBody>
        <div>
          <!--
          ====================================================================================
            Lottie or icon
          =====================================================================================
          -->
          <div
            v-if="showSuccessModal"
            v-lottie="successLottie"
            :class="[{ 'py-7': showSuccessSwap }, 'lottie']"
          />
          <!--
          ====================================================================================
            Body
          =====================================================================================
          -->
          <div class="mew-body">
            {{ successBodyText }}
          </div>
          <!--
          ====================================================================================
            Links
          =====================================================================================
          -->
          <v-row class="justify-sm-space-around align-center pt-3" dense>
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
                :href="links.etherscan"
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
                :href="links.ethvm"
                class="d-flex justify-center"
                >View on EthVM
                <v-icon color="primary" small>mdi-launch</v-icon></a
              >
            </v-col>
          </v-row>
        </div>
      </template>
    </app-modal>
  </div>
</template>

<script>
import AppModal from '@/core/components/AppModal';
import { EventBus } from '@/core/plugins/eventBus';
export default {
  name: 'SuccessModal',
  components: { AppModal },
  props: {
    showSuccessModal: {
      type: Boolean,
      default: false
    },
    successTitle: {
      type: String,
      default: ''
    },
    resetSuccess: {
      type: Function,
      default: () => {}
    },
    reset: {
      type: Function,
      default: () => {}
    },
    network: {
      type: Object,
      default: () => {}
    },
    links: {
      type: Object,
      default: () => {}
    },
    successBodyText: {
      type: String,
      default: ''
    },
    showSuccessSwap: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    /**
     * Property returns string, depending whether or not this is a swap or send
     */
    successLottie() {
      return this.showSuccessSwap ? 'swap' : 'checkmark';
    }
  },
  methods: {
    viewProgress() {
      EventBus.$emit('openNotifications');
      this.reset();
    }
  }
};
</script>

<style lang="scss" scoped>
.lottie {
  height: 120px;
}
</style>
