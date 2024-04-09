<template>
  <div>
    <app-modal
      :show="showSuccessModal"
      :title="successTitle"
      :close="resetSuccess"
      :close-only="true"
      :has-close-button="hasCloseButton"
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
                :href="links.explorer"
                class="d-flex justify-center justify-sm-start"
                @click="trackExplorrer(explorerText)"
                >View on {{ explorerText }}
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
import { EventBus } from '@/core/plugins/eventBus';

export default {
  name: 'SuccessModal',
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
    },
    hasCloseButton: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    /**
     * Property returns string, depending whether or not this is a swap or send
     */
    successLottie() {
      return this.showSuccessSwap ? 'swap' : 'checkmark';
    },
    explorerText() {
      return this.network.type.blockExplorer;
    }
  },
  methods: {
    viewProgress() {
      EventBus.$emit('openNotifications');
      this.reset();
    },
    trackExplorrer(explorer) {
      if (explorer.toLowerCase() === 'ethvm') {
        this.$amplitude.track('EthVMLinkClicked', {
          path: this.$route.path,
          network: this.network.type.name
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.lottie {
  height: 120px;
}
</style>
