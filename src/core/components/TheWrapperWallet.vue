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
  <v-row class="pb-14">
    <!--
    =====================================================================================
     Network Col on SM-XS
    =====================================================================================
    -->
    <v-col cols="12" class="d-md-none pb-0">
      <module-network />
    </v-col>
    <!--
    =====================================================================================
      Left Col - primary modules
    =====================================================================================
    -->
    <v-col cols="12" md="8" class="pb-md-3">
      <v-row>
        <v-col
          v-for="n in totalLeftColItems"
          :key="n"
          cols="12"
          class="pb-0 pb-md-3"
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
    <v-col cols="12" md="4" class="pb-md-3">
      <v-row>
        <v-col cols="12" class="d-none d-md-block">
          <module-network />
        </v-col>
        <v-col
          v-for="n in totalRightColItems"
          :key="n"
          cols="12"
          class="pb-0 pb-md-3"
        >
          <slot :name="`rightColItem${n}`" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import ModuleNetwork from '@/modules/network/ModuleNetwork';
export default {
  name: 'TheWrapperWallet',
  components: {
    ModuleNetwork
  },
  props: {
    totalLeftColItems: {
      type: Number,
      default: 1
    },
    totalRightColItems: {
      type: Number,
      default: 1
    }
  }
};
</script>

<style lang="scss"></style>
