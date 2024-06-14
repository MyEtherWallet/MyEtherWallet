<template>
  <!--
  =====================================================================================
    Mew Badge - currently used in mew-notifications.
  =====================================================================================
  -->
  <span
    :class="[
      getBadgeType(),
      'text-center',
      'white--text',
      'px-3',
      'py-1',
      'rounded',
      'mew-caption'
    ]"
    >{{ badgeTitle }}</span
  >
</template>

<script setup>
const badgeTypes = {
  warning: 'warning'
};

// props
const props = defineProps({
  badgeType: {
    type: String,
    default: ''
  },
  badgeTitle: {
    type: String,
    default: ''
  }
});

// methods

const getBadgeType = () => {
  if (props.badgeType.toLowerCase() === badgeTypes.warning) {
    return 'warning darken-2';
  }
  return props.badgeType;
};
</script>
