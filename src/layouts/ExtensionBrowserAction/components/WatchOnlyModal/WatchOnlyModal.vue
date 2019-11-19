<template>
  <div>
    <b-modal
      ref="watchOnlyWallet"
      :title="$t('mewcx.add-watch-only')"
      hide-footer
      centered
      class="bootstrap-modal"
    >
      <div class="modal-contents">
        <form>
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
            <input
              v-model="address"
              :placeholder="$t('mewcx.enter-address')"
              name="walletAddr"
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
            <span v-show="!loading"> {{ $t('mewcx.add-wallet') }} </span>
            <i v-show="loading" class="fa fa-spinner fa-spin" />
          </button>
        </form>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { isAddress } from '@/helpers/addressUtils';

export default {
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
    }
  }
};
</script>

<style scoped lang="scss">
@import 'WatchOnlyModal.scss';
</style>
