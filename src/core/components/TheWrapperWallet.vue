<template>
  <!--
    =====================================================================================
      WALLET LAYOUT:
      md-xl (totalCols = 2), network is always present on top off all items in the right col
      xs-sm (totalCols = 1), network is always present on top off all items
      LeftCol - takes leftColItem${n} slot that will be displayed one after another
      RightCol - takes rightColItem${n} slot that will be displayed one after another
    =====================================================================================
    -->
  <v-row class="ma-n2 ma-md-n3">
    <!--
    =====================================================================================
     Network Col on SM-XS
    =====================================================================================
    -->
    <v-col cols="12" class="pa-2 pa-md-3 d-md-none pb-0">
      <module-network />
    </v-col>
    <!--
    =====================================================================================
      Left Col - primary modules
    =====================================================================================
    -->
    <v-col cols="12" md="8" class="pa-2 pa-md-3">
      <v-row class="ma-n2 ma-md-n3">
        <v-col
          v-for="n in totalLeftColItems"
          :key="n"
          cols="12"
          class="pa-2 pa-md-3 pb-0"
        >
          <slot :name="`leftColItem${n}`" />
        </v-col>
      </v-row>
    </v-col>
    <!--
    =====================================================================================
      Right Col - secondary modules, Network is present on top on md-xl
    =====================================================================================
    -->
    <v-col
      v-if="!hasDraggable || totalRightColItems === 1"
      cols="12"
      md="4"
      class="pa-2 pa-md-3"
    >
      <v-row class="ma-n2 ma-md-n3">
        <v-col cols="12" class="pa-2 pa-md-3 d-none d-md-block">
          <module-network />
        </v-col>
        <v-col cols="12" class="pa-2 pa-md-3 d-none d-md-block">
          <div class="coinzilla" data-zone="C-4136467cdba0bdc8324"></div>
        </v-col>
        <v-col
          v-for="n in totalRightColItems"
          :key="n"
          cols="12"
          class="pa-2 pa-md-3 pb-0"
        >
          <slot :name="`rightColItem${n}`" />
        </v-col>
      </v-row>
    </v-col>
    <v-col
      v-if="totalRightColItems === 2 && hasDraggable"
      cols="12"
      md="4"
      class="pa-2 pa-md-3"
    >
      <module-network class="d-none d-md-block mb-2" />
      <div class="coinzilla" data-zone="C-4136467cdba0bdc8324"></div>
      <draggable
        v-bind="dragOptions"
        v-model="draggableItems"
        handle=".handle"
        @start="drag = true"
        @end="drag = false"
      >
        <transition-group>
          <div
            v-for="n in draggableItems"
            :key="n"
            class="position--relative mb-2"
          >
            <slot :name="`rightColItem${n}`" />
            <v-icon class="handle" color="#d6d6d6" size="23px">
              mdi-drag-horizontal-variant
            </v-icon>
          </div>
        </transition-group>
      </draggable>
    </v-col>
  </v-row>
</template>

<script>
import ModuleNetwork from '@/modules/network/ModuleNetwork';
import draggable from 'vuedraggable';

export default {
  name: 'TheWrapperWallet',
  components: {
    ModuleNetwork,
    draggable
  },
  props: {
    totalLeftColItems: {
      type: Number,
      default: 1
    },
    totalRightColItems: {
      type: Number,
      default: 1
    },
    hasDraggable: {
      type: Boolean,
      default: false
    }
  },
  created() {
    const adConfig1 = {
      zone: '4136467cdba0bdc8324',
      width: '300',
      height: '250'
    };
    window.coinzilla_display.push(adConfig1);
  },
  data() {
    const arr = [];
    for (let i = 0; i < this.totalRightColItems; i++) {
      arr.push(i + 1);
    }
    return {
      draggableItems: arr
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      };
    }
  },
  watch: {
    totalRightColItems() {
      this.draggableItems = [];
      const arr = [];
      for (let i = 0; i < this.totalRightColItems; i++) {
        arr.push(i + 1);
      }
      this.draggableItems = arr;
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
  top: 24px;
}
</style>
