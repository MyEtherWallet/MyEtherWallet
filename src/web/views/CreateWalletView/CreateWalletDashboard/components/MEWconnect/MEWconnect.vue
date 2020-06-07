<template>
  <SuperButton
    :to="{ name: 'HomeCreateWalletMewConnect', query: { step: '1' } }"
  >
    <v-icon color="teal lighten-1" class="mr-1">mdi-shield</v-icon>
  </SuperButton>
</template>

<script>
import SuperButton from '@/web/components/Buttons/SuperButton';
export default {
  components: { SuperButton },
  data: () => ({})
};
</script>
