<template>
  <div>
    <b-modal
      ref="watchOnlyWallet"
      :title="$t('mewcx.add-watch-only')"
      hide-footer
      hide-header
      centered
      class="bootstrap-modal"
      dialog-class="watch-only-dialog"
      content-class="watch-only-content"
      body-class="watch-only-body"
    >
      <div class="modal-contents">
        <div class="modal-closer">
          <i class="fa fa-times-circle-o" @click="closeModal" />
          <span @click="closeModal">Cancel</span>
        </div>
        <div class="form-container">
          <form>
            <h2>{{ $t('mewcx.add-watch-only') }}</h2>
            <div class="input-container">
              <label for="walletName"> {{ $t('mewcx.wallet-name') }} </label>
              <input
                v-model="name"
                :placeholder="$t('mewcx.add-wallet-nickname')"
                name="walletName"
              />
            </div>
            <div class="input-container">
              <label for="walletAddr"> {{ $t('common.addr') }} </label>
              <blockie
                :address="address"
                :size="8"
                :scale="16"
                width="30px"
                height="30px"
                class="floated-blockie"
              />
              <input
                v-model="address"
                :placeholder="$t('mewcx.enter-address')"
                name="walletAddr"
                class="input-with-blockie"
              />
            </div>
            <button
              :class="[
                validInputs ? '' : 'disabled',
                loading ? 'disabled' : '',
                'submit-button large-round-button-green-filled'
              ]"
              type="submit"
              @click.prevent="submit"
            >
              <span v-show="!loading"> {{ $t('mewcx.add') }} </span>
              <i v-show="loading" class="fa fa-spinner fa-spin" />
            </button>
          </form>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { isAddress } from '@/helpers/addressUtils';
import Blockie from '@/components/Blockie';
export default {
  components: {
    blockie: Blockie
  },
  props: {
    addWatchOnly: {
      type: Function,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      name: '',
      address: ''
    };
  },
  computed: {
    validInputs() {
      return isAddress(this.address) && this.name !== '';
    }
  },
  mounted() {
    this.$refs.watchOnlyWallet.$on('hidden', () => {
      this.name = '';
      this.address = '';
    });
  },
  methods: {
    submit() {
      this.addWatchOnly(this.name, this.address);
    },
    closeModal() {
      this.$refs.watchOnlyWallet.hide();
    }
  }
};
</script>
<style lang="scss">
.watch-only-dialog {
  margin: 0 !important;
  max-width: 100%;
  border-radius: 0 !important;
}
.watch-only-content {
  height: 100vh;
  width: 100vw !important;
  border-radius: 0;
}
.watch-only-body {
  background-color: #f2f4fa !important;
}
</style>
<style scoped lang="scss">
@import 'WatchOnlyModal.scss';
</style>
