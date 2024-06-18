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
            :class="[showSuccessSwap ? 'py-7' : '', 'lottie']"
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

<script setup>
import { computed } from 'vue';
import { route } from 'vue-router/composables';
import { EventBus } from '@/core/plugins/eventBus';
import { useAmplitude } from '@/core/composables/amplitude';

// injections
const { $amplitude } = useAmplitude();
const { route } = useRoute();

// props
const props = defineProps({
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
});

// computed
const successLottie = computed(() => {
  return props.showSuccessSwap ? 'swap' : 'checkmark';
});

const explorerText = computed(() => {
  return props.network.type.blockExplorer;
});

// methods
const viewProgress = () => {
  EventBus.$emit('openNotifications');
  props.reset();
};

const trackExplorrer = explorer => {
  if (explorer.toLowerCase() === 'ethvm') {
    $amplitude.track('EthVMLinkClicked', {
      path: route.path,
      network: props.network.type.name
    });
  }
};
</script>

<style lang="scss" scoped>
.lottie {
  height: 120px;
}
</style>
