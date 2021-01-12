<template>
  <v-sheet
    elevation="10"
    width="100%"
    max-width="600px"
    class="mx-auto pa-10"
    rounded
  >
    <div class="d-flex flex-column summary-container pa-6 rounded">
      <div class="d-flex justify-space-between">
        <span>{{ $t('ens.register.domain-name') }}:</span>
        <span class="font-weight-medium">{{ name }}</span>
      </div>
      <div class="d-flex justify-space-between">
        <span>{{ $t('ens.register.term') }}:</span>
        <span class="font-weight-medium">{{ duration }}</span>
      </div>
    </div>
    <div class="d-flex justify-center my-6">
      <mew-button
        :title="
          committed
            ? $t('ens.register.name')
            : $t('ens.register.create-commitment')
        "
        btn-size="xlarge"
        @click.native="!commited ? commit : register"
      />
    </div>
  </v-sheet>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    duration: {
      type: String,
      default: ''
    },
    committed: {
      type: String,
      default: ''
    },
    register: {
      default: function () {
        return {};
      },
      type: Function
    },
    commit: {
      default: function () {
        return {};
      },
      type: Function
    }
  }
  // data() {
  //   return {
  //     committed: false
  //   };
  // }
};
</script>

<style lang="scss" scoped>
.summary-container {
  background-color: var(--v-superPrimary-base);
}
</style>
