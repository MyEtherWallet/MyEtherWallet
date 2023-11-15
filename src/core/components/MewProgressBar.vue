<template>
  <!--
  =====================================================================================
    Mew Progress Bar
  =====================================================================================
  -->
  <div class="mew-progress-bar full-width d-flex cursor-pointer">
    <div
      v-for="(section, idx) in data"
      :key="section + idx"
      :class="[
        section.color,
        idx === 0 ? 'left-border-radius' : '',
        idx === data.length - 1 ? 'right-border-radius' : ''
      ]"
      :style="{ height: '10px', width: section.percentage + '%' }"
      :title="section.tooltip ? section.tooltip : ''"
    />
  </div>
</template>

<script>
export default {
  name: 'MewProgressBar',
  props: {
    /**
     * Array of progress bar data , i.e [ percentage: '', color: '' ]}
     */
    data: {
      type: Array,
      default: () => {
        return [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.mew-progress-bar {
  background-color: var(--v-primaryOutlineActive-base);
  border-radius: 8.5px;

  .left-border-radius {
    border-top-left-radius: 8.5px;
    border-bottom-left-radius: 8.5px;
  }

  .right-border-radius {
    border-top-right-radius: 8.5px;
    border-bottom-right-radius: 8.5px;
  }
}
</style>
