<template>
  <div class="enter-pin-number-modal">
    <b-modal
      ref="enterpin"
      :title="$t('common.password.string')"
      hide-footer
      centered
      static
      lazy
      class="bootstrap-modal nopadding"
    >
      <div class="modal-contents">
        <div class="pin-input-block">
          <i18n path="accessWallet.pin.enter" tag="p" class="main-title"
            ><span slot="device"> {{ deviceInfo.name }} </span></i18n
          >
          <p class="sub-title">
            {{ $t('accessWallet.pin.layout') }}
          </p>
          <div class="input-container">
            <div class="input-headers">
              <p>{{ $t('accessWallet.pin.string') }}</p>
              <span @click="clear">{{ $t('common.clear') }}</span>
            </div>
            <input v-model="pin" type="password" readonly="true" />
          </div>
        </div>
        <div class="button-matrix-block">
          <button
            v-for="(pos, idx) in positions"
            :key="pos + idx"
            @click="pin += pos"
          ></button>
        </div>
        <div class="button-block">
          <div class="checkbox-container">
            <label for="terms" @click="acknowledgedTerms = !acknowledgedTerms">
              <span
                :class="[acknowledgedTerms ? 'enable' : '', 'custom-marker']"
              >
                <i v-if="acknowledgedTerms" class="fa fa-check" />
              </span>
              <input name="terms" type="checkbox" />{{
                $t('accessWallet.pin.access')
              }}
              <br />
              {{ $t('accessWallet.pin.accept') }}
              <router-link to="/terms-of-service">
                {{ $t('accessWallet.pin.terms') }}
              </router-link>
            </label>
          </div>
          <button :disabled="!acknowledgedTerms" @click="actualClick">
            {{ $t('common.wallet.access-my') }}
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'WalletPassword',
  data() {
    return {
      deviceInfo: {},
      pin: '',
      acknowledgedTerms: false,
      positions: ['7', '8', '9', '4', '5', '6', '1', '2', '3'],
      callback: () => {}
    };
  },
  mounted() {
    this.$eventHub.$on('showHardwarePinMatrix', (deviceInfo, callback) => {
      this.$refs.enterpin.show();
      this.deviceInfo = deviceInfo;
      this.callback = callback;
    });
  },
  beforeDestroy() {
    this.$eventHub.$off('showHardwarePinMatrix');
  },
  methods: {
    clear() {
      this.pin = '';
      this.acknowledgedTerms = false;
    },
    actualClick() {
      this.callback(this.pin);
      this.$refs.enterpin.hide();
      this.pin = '';
      this.acknowledgedTerms = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'EnterPinNumberModal.scss';
</style>
