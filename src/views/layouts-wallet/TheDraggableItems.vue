<template>
  <draggable
    v-bind="dragOptions"
    v-model="draggableItems"
    handle=".handle"
    @start="drag = true"
    @end="drag = false"
  >
    <transition-group>
      <div
        v-for="(item, key) in draggableItems"
        :key="key"
        class="position--relative"
      >
        <template v-if="item === 1">
          <module-swap-rates class="mb-2" />
          <v-icon class="handle" color="#d6d6d6" size="23px">
            mdi-drag-horizontal-variant
          </v-icon>
        </template>

        <template v-if="item === 2 || (hasHistory && hasSwap)">
          <module-transfer-history class="mb-3" :is-swap="isSwap" />
          <v-icon class="handle" color="#d6d6d6" size="23px">
            mdi-drag-horizontal-variant
          </v-icon>
        </template>
      </div>
    </transition-group>
  </draggable>
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
      draggableItems: [1, 2]
    };
  },
  computed: {
    ...mapGetters('global', ['hasSwap']),
    ...mapGetters('notifications', ['swapNotifications']),
    hasHistory() {
      return this.swapNotifications && this.swapNotifications.length > 0;
    },
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.button {
  margin-top: 35px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.handle {
  cursor: move;
  position: absolute;
  left: 24px;
  top: 28px;
}
</style>
