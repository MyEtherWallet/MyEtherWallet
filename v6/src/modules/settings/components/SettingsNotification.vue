<template>
  <div class="pb-4">
    <mew-switch label="Receive the notifications from MEW" />
    <div class="greyLight pa-8 border-radius--5px">
      <div class="mew-heading-3">
        What’s kind of notification do you want to receive from MEW?
      </div>
      <mew-checkbox label="All" />
      <mew-checkbox label="Transaction" />
      <mew-checkbox label="Swap" />
    </div>
    <div class="mt-5 greyLight pa-8 border-radius--5px">
      <div class="mew-heading-3">
        What’s the maximum number of the notification do you want to store
        within?
      </div>
      <v-radio-group v-model="radioGroup">
        <v-radio class="mb-4" label="10" value="10" />
        <v-radio class="mb-4" label="50" value="50" />
        <v-radio label="100" value="100" />
      </v-radio-group>
    </div>
    <div class="mt-8 d-flex justify-center">
      <mew-button title="Update" button-size="xlarge" />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({ radioGroup: '10' })
};
</script>
