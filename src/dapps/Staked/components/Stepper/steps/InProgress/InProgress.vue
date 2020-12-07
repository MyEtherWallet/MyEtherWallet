<template>
  <div class="progress-step d-flex">
    <div class="content-container d-flex">
      <h3>{{ $t('dappsStaked.hang-on') }}</h3>
      <i18n tag="p" class="subtitle" path="dappsStaked.please-do-not-close">
        <p slot="creating-validators">
          {{ $t('dappsStaked.creating-validators') }}
        </p>
      </i18n>
      <b-progress
        v-if="details.currentValidatorsStaked"
        :max="total"
        class="w-100"
        height="2rem"
        :variant="
          details.currentValidatorsStaked === total ? 'success' : 'primary'
        "
      >
        <b-progress-bar
          :value="details.currentValidatorsStaked"
          :animated="details.currentValidatorsStaked !== total"
        />
      </b-progress>
      <b-progress
        v-if="!details.currentValidatorsStaked"
        :max="100"
        class="w-100"
        height="2rem"
        variant="secondary"
      >
        <b-progress-bar :value="100" animated>
          <span>Loading</span>
        </b-progress-bar>
      </b-progress>
      <p class="validator-progress">
        <strong
          >{{
            details.currentValidatorsStaked
              ? details.currentValidatorsStaked
              : '0'
          }}
          / {{ total }}</strong
        >
        {{
          $tc(
            'dappsStaked.completed-validators',
            details.currentValidatorsStaked > 1 ? 2 : 1
          )
        }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    details: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    total() {
      return this.details.amount / 32;
    }
  },
  watch: {
    details: {
      handler: function (newVal) {
        if (newVal && newVal.currentValidatorsStaked === this.total) {
          this.$emit('completed', true, { key: 'stake', value: true });
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InProgress.scss';
</style>
