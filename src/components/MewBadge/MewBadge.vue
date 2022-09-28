<template>
  <!--
  =====================================================================================
    Mew Badge - currently used in mew-notifications.
  =====================================================================================
  -->
  <span :class="[getBadgeType(), 'text-center', 'white--text', 'px-3', 'py-1', 'rounded', 'mew-caption']">{{ badgeTitle }}</span>
</template>

<script>
const badgeTypes = {
  warning: 'warning'
}

export default {
  name: 'MewBadge',
  props: {
    /**
     * Badge types: 'in', 'out', 'swap, 'error', 'warning'
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
  },
  methods: {
    getBadgeType() {
      if (this.badgeType.toLowerCase() === badgeTypes.warning ) {
        return 'warning darken-2';
      }
      return this.badgeType;
    }
  }
}
</script>