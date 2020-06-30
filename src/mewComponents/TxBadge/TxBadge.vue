<template>
  <div>
    <span :class="[badgeType, 'text-center', 'white--text', 'px-3', 'py-1', 'badge-type', 'mew-caption']">{{ badgeTitle }}</span>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * Badge types: 'txIn', 'txOut', 'swap, 'error'
     */
    badgeType: {
      type: String,
      default: ''
    },    
    /**
     * Badge title
     */
    badgeTitle: {
      type: String,
      default: ''
    }
  }
}
</script>


<style lang="scss" scoped>
.badge-type {
  border-radius: 4px;
}
</style>