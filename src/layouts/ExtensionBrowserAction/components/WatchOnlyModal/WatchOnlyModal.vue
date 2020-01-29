<template>
  <div>
    <mewcx-modal-wrapper
      ref="watchOnlyWallet"
      :title="$t('mewcx.add-watch-only')"
    >
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
    </mewcx-modal-wrapper>
  </div>
</template>

<script>
import { isAddress } from '@/helpers/addressUtils';
import Blockie from '@/components/Blockie';
import MewcxModalWrapper from '../../wrappers/MewcxModalWrapper';
export default {
  components: {
    blockie: Blockie,
    'mewcx-modal-wrapper': MewcxModalWrapper
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
    this.$refs.watchOnlyWallet.$refs.modalWrapper.$on('hidden', () => {
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
