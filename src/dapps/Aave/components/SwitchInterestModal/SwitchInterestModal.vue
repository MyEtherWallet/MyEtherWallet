<template>
  <div class="modal-container">
    <b-modal
      ref="switchInterest"
      :title="$t('dappsAave.switch-interest')"
      centered
      hide-footer
      static
      lazy
    >
      <div class="modal-contents">
        <div class="switch-container">
          <div class="current-container">
            <p class="title">{{ $t('dappsAave.current-interest') }}</p>
            <!-- placeholder -->
            <p
              :class="[
                'percent-title',
                token.isStable ? 'stable-percent' : 'variable-percent'
              ]"
            >
              11.44%
            </p>
            <!-- placeholder -->
            <p
              :class="[
                'rate-title',
                token.isStable ? 'stable-percent' : 'variable-percent'
              ]"
            >
              Variable
            </p>
          </div>
          <div class="icon-container">
            <i class="fa fa-long-arrow-right" aria-hidden="true" />
          </div>
          <div class="next-container">
            <p class="title">{{ $t('dappsAave.next-interest') }}</p>
            <!-- placeholder -->
            <p
              :class="[
                'percent-title',
                token.isStable ? 'variable-percent' : 'stable-percent'
              ]"
            >
              1.44%
            </p>
            <!-- placeholder -->
            <p
              :class="[
                'rate-title',
                token.isStable ? 'variable-percent' : 'stable-percent'
              ]"
            >
              Stable
            </p>
          </div>
        </div>
        <hr />
        <div class="currency-container">
          <span class="currency-title">
            {{ $t('dappsAave.currency') }}
          </span>
          <!-- placeholder -->
          <span class="currency-type">
            DAI
          </span>
        </div>
        <hr />
        <div class="btn-container">
          <button>{{ $t('dappsAave.confirm-switch') }}</button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    token: {
      type: Object,
      default: function() {
        return {};
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SwitchInterestModal.scss';
</style>
