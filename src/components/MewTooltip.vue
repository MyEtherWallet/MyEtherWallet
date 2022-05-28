<template>
  <!--
=====================================================================================
  Mew Tooltip 
=====================================================================================
-->
  <div>
    <v-tooltip
      eager
      :max-width="maxWidth"
      open-on-hover
      content-class="tooltip-inner"
      color="titlePrimary--text"
      top
    >
      <template #activator="{ on }">
        <v-icon class="cursor-pointer mew-body" color="searchText" v-on="on">
          mdi-information
        </v-icon>
        <slot name="activatorSlot" />
      </template>
      <slot name="contentSlot" />
      <span>{{ text }}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: 'MewTooltip',
  props: {
    /**
     * The tooltip text.
     */
    text: {
      type: String,
      default: ''
    },
    /**
     * The max width for tooltip text.
     */
    maxWidth: {
      type: [String, Number],
      default: '100%'
    }
  }
};
</script>
