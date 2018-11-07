<template>
  <div>
    <b-modal
      ref="finalize"
      hide-footer
      centered
      :title="$t('dapps.finalize')"
      class="bootstrap-modal-wide nopadding finalize-modal">
      <div class="finalize-modal-container">
        <h3>{{ $t('dapps.areYouFinalizing') }} <br> {{ domainName }}.eth {{ $t('dapps.areYouFinalizingCont') }}</h3>
        <div class="button-container">
          <button
            class="cancel"
            @click="close">{{ $t('common.cancel') }}</button>
          <button
            class="confirm"
            @click="finalize">{{ $t('dapps.confirm') }}</button>
        </div>
        <p>{{ $t('dapps.nodeProvider') }} <a
          :href="network.url"
          target="_blank">{{ network.service }}</a></p>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  props: {
    finalize: {
      type: Function,
      default: function() {}
    },
    domainName: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters({
      network: 'network'
    })
  },
  methods: {
    close() {
      this.refs.finalize.hide();
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'FinalizeModal.scss';
</style>
