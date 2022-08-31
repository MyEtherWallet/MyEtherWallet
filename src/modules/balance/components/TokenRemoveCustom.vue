<template>
  <div>
    <!-- ===================================================================================== -->
    <!-- Remove Custom Token Overlay -->
    <!-- ===================================================================================== -->
    <v-dialog :value="open" max-width="330" @click:outside="reset">
      <div class="white pa-7">
        <div class="mew-heading-2 mb-10">Remove token?</div>
        <!--
    =====================================================================================
      Confirm Remove
    =====================================================================================
    -->
        <div class="full-width">
          <div class="d-flex align-center justify-center py-1">
            <div class="d-flex align-center justify-center">
              <v-img
                class="mr-2"
                :src="selectedToken.tokenImg"
                width="20"
                height="20"
                contain
              />
              {{ selectedToken.token }}
            </div>
          </div>
          <!-- =================================================== -->
          <!-- Add token / next button -->
          <!-- =================================================== -->
          <div class="d-flex align-center mt-5">
            <mew-button
              class="flex-grow-1 mr-1"
              style="flex-basis: 0"
              btn-size="large"
              btn-style="outline"
              title="Keep token"
              @click.native="reset"
            />
            <mew-button
              class="flex-grow-1 ml-1"
              style="flex-basis: 0"
              btn-size="large"
              :loading="loading"
              title="Remove Token"
              @click.native="confirmDelete"
            />
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { SUCCESS, Toast } from '@/modules/toast/handler/handlerToast';

export default {
  props: {
    open: {
      default: false,
      type: Boolean
    },
    close: {
      default: () => {},
      type: Function
    },
    selectedToken: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      contractAddress: '',
      customName: '',
      customSymbol: '',
      symbolLengthTooLong: '',
      nameLengthTooLong: '',
      loading: false,
      step: 1,
      token: {}
    };
  },
  computed: {
    ...mapState('wallet', ['web3', 'address']),
    ...mapGetters('wallet', ['tokensList']),
    ...mapGetters('external', ['contractToToken']),
    ...mapGetters('custom', ['customTokens']),
    ...mapGetters('global', ['getFiatValue'])
  },
  methods: {
    ...mapActions('custom', ['deleteToken', 'deleteHiddenToken']),
    /**
     * resets data and closes overlay on close button click
     */
    reset() {
      this.close();
      this.step = 1;
      this.token = {};
      this.contractAddress = '';
      this.customName = '';
      this.customSymbol = '';
      this.symbolLengthTooLong = '';
      this.nameLengthTooLong = '';
      this.loading = false;
    },
    /**
     * Delete custom token
     */
    confirmDelete() {
      const tokenSymbol = this.selectedToken.token;
      this.deleteToken([this.selectedToken]).then(() => {
        this.reset();
        Toast(`${tokenSymbol} Token removed succesfully`, {}, SUCCESS);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.token-placeholder {
  color: var(--v-textMedium-base);
  background-color: var(--v-disabledMedium-base);
  border-radius: 24px;
  height: 24px;
  width: 24px;
}
</style>
