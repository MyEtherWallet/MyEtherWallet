<template>
  <div class="wrap">
    <div class="modal-container">
      <b-modal
        ref="issuelog"
        hide-footer
        hide-header
        centered
        class="bootstrap-modal nopadding"
      >
        <div class="modal-contents">
          <div class="modal-header-block">
            <h2 class="title">Something went wrong.</h2>
            <p class="sub-text">
              Do you want to inform MEW about this error?
            </p>
          </div>
          <div class="modal-user-input-block">
            <code>
              {{ JSON.stringify(error) }}
            </code>
          </div>
          <div class="modal-button-block">
            <standard-button
              :options="cancelButtonOptions"
              @click.native="sendError(false)"
            />
            <standard-button
              :options="sendButtonOptions"
              @click.native="sendError(true)"
            />
          </div>
          <div v-if="showSkipper" class="button-block">
            <div class="checkbox-container">
              <label for="terms" @click="neverShow = !neverShow">
                <span :class="[neverShow ? 'enable' : '', 'custom-marker']">
                  <i v-if="neverShow" class="fa fa-check" />
                </span>
                <input name="terms" type="checkbox" /> Never Show again
              </label>
            </div>
          </div>
        </div>

        <!-- .modal-contents -->
      </b-modal>
    </div>
    <!-- .modal-container -->
  </div>
  <!-- .wrap -->
</template>

<script>
import StandardButton from '@/components/Buttons/StandardButton';
import store from 'store';

export default {
  name: 'IssueLogModal',
  components: {
    'standard-button': StandardButton
  },
  props: {
    error: {
      type: Object,
      default: () => {
        return {};
      }
    },
    resolver: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      cancelButtonOptions: {
        title: 'Cancel',
        buttonStyle: 'green-border',
        noMinWidth: true,
        fullWidth: true
      },
      sendButtonOptions: {
        title: 'Send',
        buttonStyle: 'green',
        noMinWidth: true
      },
      errorCount: 0,
      showSkipper: false,
      neverShow: false
    };
  },
  watch: {
    neverShow(newVal) {
      store.set('neverReport', newVal);
    }
  },
  mounted() {
    const popUpCount = store.get('errorPop') || 0;
    this.errorCount = popUpCount;
    if (this.errorCount >= 10) {
      this.showSkipper = true;
    }
  },
  methods: {
    sendError(bool) {
      this.resolver(bool);
      this.$refs.issuelog.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'IssueLogModal.scss';
</style>
