<template>
  <div class="pa-6">
    <v-sheet color="transparent" max-width="550px" class="mb-7">
      {{ $t('interface.export.desc') }}
    </v-sheet>
    <div class="d-flex justify-center mt-5">
      <mew-button
        title="Export"
        btn-size="xlarge"
        @click.native="exportConfig"
      />
    </div>
  </div>
</template>

<script setup>
// props
defineProps({
  exportConfig: {
    type: Function,
    default: () => {}
  }
});
</script>
