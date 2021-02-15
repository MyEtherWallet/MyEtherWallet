<template>
  <mew-module
    class="d-flex flex-grow-1 pt-6"
    :has-elevation="true"
    :has-indicator="true"
    title="Deploy contract"
  >
    <template #moduleBody>
      <mew-input label="Byte code" placeholder=" " />

      <v-textarea
        no-resize
        outlined
        name="input-7-4"
        label="ABI/JSON Interface"
        value=""
        placeholder=" "
      ></v-textarea>

      <mew-input label="Contract name" placeholder=" " />

      <div class="text-center mt-3">
        <mew-button
          title="Sign Transaction"
          :has-full-width="false"
          btn-size="xlarge"
        />
      </div>
    </template>
  </mew-module>
</template>

<script>
export default {
  name: 'ModuleContractDeploy'
};
</script>
