<template>
  <div>
    <v-row>
      <v-col cols="12">
        <div v-lottie="'checkmark'" class="lottie py-7" style="height: 200px" />
      </v-col>
      <v-col cols="12" class="text-center">
        <p class="mew-heading-2">Registration Completed</p>
        <p class="mew-heading-4">
          Please navigate to the 'Manage Domains' tab to see your newly
          registered name
        </p>
      </v-col>
      <v-col cols="12" align-self="center" class="text-center">
        <mew-button btn-size="xlarge" title="Close" @click.native="close" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
defineProps({
  close: {
    type: Function,
    default: () => {}
  }
});
</script>
