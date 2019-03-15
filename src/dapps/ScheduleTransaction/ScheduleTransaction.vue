<template>
  <div class="schedule-transaction">
    <back-button />
    <router-view :tokens-with-balance="tokensWithBalance" />
  </div>
</template>

<script>
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';

export default {
  components: {
    'back-button': BackButton
  },
  props: {
    tokensWithBalance: {
      type: Array,
      default: function() {
        return [];
      }
    }
  }
};
</script>

<style>
@import 'ScheduleTransaction.scss';
</style>
