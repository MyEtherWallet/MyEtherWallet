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
        <v-col
          cols="12"
          class="d-none d-md-flex align-center justify-center flex-column"
        >
          <div class="coinzilla" data-zone="C-5186467cdba0c51c392"></div>
          <div class="paid-ad">Paid Advertisement</div>
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
        <v-col cols="12" class="pa-2 pt-4 pa-md-3 d-none d-md-block">
          <module-network />
        </v-col>
        <v-col
          cols="12"
          class="pa-2 pa-md-3 d-flex align-center justify-center flex-column"
        >
          <div class="coinzilla" data-zone="C-4136467cdba0bdc8324"></div>
          <div class="paid-ad">Paid Advertisement</div>
        </v-col>
        <v-col
          v-for="n in totalRightColItems"
          v-show="totalRightColItems > 1"
          :key="n"
          cols="12"
          class="pa-2 pa-md-3 pb-0"
        >
          <slot :name="`rightColItem${n}`" />
        </v-col>
      </v-row>
    </v-col>
    <v-col
      v-if="totalRightColItems >= 2 && hasDraggable"
      cols="12"
      md="4"
      class="pa-2 pa-md-3"
    >
      <module-network class="d-none d-md-block mb-2" />
      <div
        class="d-flex align-center justify-center flex-column pa-2 pb-4 pa-md-3 pb-md-5"
      >
        <div class="coinzilla" data-zone="C-4136467cdba0bdc8324"></div>
        <div class="paid-ad">Paid Advertisement</div>
      </div>
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
import draggable from 'vuedraggable';
import ModuleNetwork from '@/modules/network/ModuleNetwork';

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
  },
  created() {
    const adConfig1 = {
      zone: '4136467cdba0bdc8324',
      width: '300',
      height: '250'
    };
    const adConfig2 = {
      zone: '5186467cdba0c51c392',
      width: '728',
      height: '90'
    };
    window.coinzilla_display.push(adConfig1);
    window.coinzilla_display.push(adConfig2);
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

.paid-ad {
  width: 100%;
  text-align: right;
  padding: 10px 40px 0;
  font-size: 8px;
}
</style>
