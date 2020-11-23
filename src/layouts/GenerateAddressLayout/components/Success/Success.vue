<template>
  <div class="success-container d-flex mt-4">
    <i class="check-icon fa fa-check" aria-hidden="true" />
    <h2 class="title">{{ $t('confirmation.success') }}</h2>
    <p>{{ $t('dappsStaked.generate-address.generated-successfully') }}</p>
    <div class="button-container d-flex">
      <button
        :class="['large-round-button-green-filled mt-3']"
        @click="startToStake"
      >
        {{ $t('dappsStaked.generate-address.start-to-stake') }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    startToStake() {
      this.$router.push('/access-my-wallet');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'Success.scss';
</style>
