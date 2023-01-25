<template>
  <div>
    <module-swap-rates class="mb-2" />
    <module-transfer-history
      v-if="true || (hasHistory && hasSwap)"
      :is-swap="isSwap"
    />

    <draggable v-model="draggableItems">
      <transition-group>
        <div v-for="(item, key) in draggableItems" :key="key">
          {{ item }}
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import draggable from 'vuedraggable';

export default {
  components: {
    ModuleSwapRates: () => import('@/modules/swap/ModuleSwapRates'),
    ModuleTransferHistory: () =>
      import('@/modules/transfer-history/ModuleTransferHistory'),
    draggable
  },
  props: {
    isSwap: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      draggableItems: [1, 2, 3, 4, 5, 6, 7]
    };
  },
  computed: {
    ...mapGetters('global', ['hasSwap']),
    ...mapGetters('notifications', ['swapNotifications']),
    hasHistory() {
      return this.swapNotifications && this.swapNotifications.length > 0;
    }
  }
};
</script>
