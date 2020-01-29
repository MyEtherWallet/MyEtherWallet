<template>
  <div class="wrap">
    <div class="modal-container">
      <b-modal
        ref="issuelog"
        hide-footer
        hide-header
        centered
        class="bootstrap-modal nopadding"
        static
        lazy
      >
        <div class="new-issue-log">
          <div class="large-header">{{ $t('common.issue-log.oops') }}</div>
          <div class="sub-header">
            {{ $t('common.issue-log.error-text') }}
          </div>
          <div class="buttons mt-5">
            <div class="button-block-text">
              {{ $t('common.issue-log.inform-error') }}
            </div>
            <div class="mt-3 d-flex">
              <b-btn class="mr-1" @click="() => sendError(true)">{{
                $t('common.issue-log.send-button')
              }}</b-btn>
              <b-btn
                variant="outline-secondary"
                @click="() => sendError(false)"
                >{{ $t('common.issue-log.no-thanks') }}</b-btn
              >
            </div>

            <div v-if="showSkipper" class="button-block mt-3">
              <div class="checkbox-container">
                <label for="terms" @click="neverShow = !neverShow">
                  <span :class="[neverShow ? 'enable' : '', 'custom-marker']">
                    <i v-if="neverShow" class="fa fa-check" />
                  </span>
                  <input name="terms" type="checkbox" />
                  {{ $t('common.issue-log.hide-for-now') }}
                </label>
              </div>
            </div>

            <div
              v-b-toggle.collapse-error-detail
              class="mt-5 show-error-detail"
            >
              {{ $t('common.issue-log.show-error-details') }}
            </div>
          </div>

          <b-collapse id="collapse-error-detail" class="mt-2">
            <b-card>
              <textarea v-model="errorDetails" class="error-detail"></textarea>
            </b-card>
          </b-collapse>
        </div>

        <!-- .modal-contents -->
      </b-modal>
    </div>
    <!-- .modal-container -->
  </div>
  <!-- .wrap -->
</template>

<script>
import store from 'store';
import { mapActions } from 'vuex';

export default {
  name: 'IssueLogModal',
  components: {},
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
      errorDetails: JSON.stringify(this.error),
      errorCount: 0,
      showSkipper: false,
      neverShow: false
    };
  },
  watch: {
    neverShow() {
      this.toggleTempHide();
    }
  },
  mounted() {
    const popUpCount = store.get('errorPop') || 0;
    this.errorCount = popUpCount;
    if (this.errorCount >= 5) {
      this.showSkipper = true;
    }
  },
  methods: {
    ...mapActions('main', ['toggleTempHide']),
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
