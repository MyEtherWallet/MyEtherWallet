<template>
  <div class="generate-address-layout d-flex">
    <div class="title">{{ $t('dappsStaked.generate-address.title') }}</div>
    <i18n
      v-if="onCreatePw"
      tag="div"
      class="desc"
      path="dappsStaked.generate-address.desc"
    >
      <!-- change to link -->
      <span slot="learn-more">{{ $t('common.learn-more') }}</span>
    </i18n>
    <div v-else class="desc">
      {{ $t('dappsStaked.generate-address.desc2') }}
    </div>
    <create-password v-if="onCreatePw" @createPw="createPw" />
    <mnemonic-phrase
      v-if="onMnemonic"
      :generating="generating"
      :mnemonic="mnemonic"
      :keystore-json="keystoreJson"
      :keystore-name="keystoreName"
      @onContinue="onContinue"
    />
    <success v-if="onSuccess" :address="address" />
  </div>
</template>

<script>
import createPassword from './components/CreatePassword/CreatePassword';
import KeyStore, { verifyKeystore } from '@myetherwallet/eth2-keystore';
import mnemonicPhrase from './components/MnemonicPhrase/MnemonicPhrase';
import success from './components/Success/Success';
import createBlob from '@/helpers/createBlob.js';
import { Toast } from '@/helpers';

export default {
  components: {
    createPassword,
    mnemonicPhrase,
    success
  },
  data() {
    return {
      mnemonic: '',
      onCreatePw: true,
      generating: false,
      onMnemonic: false,
      onSuccess: false,
      keystoreJson: '',
      keystoreName: '',
      address: ''
    };
  },
  methods: {
    onContinue() {
      this.onMnemonic = false;
      this.onSuccess = true;
    },
    async createPw(pw) {
      this.generating = true;
      const ks = new KeyStore();
      // get mnemonic
      const mnemonic = await ks.getMnemonic();
      this.mnemonic = mnemonic.split(' ');
      this.onCreatePw = false;
      this.onMnemonic = true;
      //generates the keystore json
      const genWithdrawalKeystore = await ks.toWithdrawalKeystore(pw);
      this.keystoreJson = createBlob(genWithdrawalKeystore, 'mime');
      this.generating = false;
      this.keystoreName =
        'keystore-' +
        genWithdrawalKeystore.path.split('/').join('_') +
        '-' +
        Date.now() +
        '.json';
      const address = await ks.getPublicKey();
      this.address = address.toString('hex');
      //verify generated keystore
      await verifyKeystore(genWithdrawalKeystore, pw).catch(error => {
        Toast.responseHandler(error, Toast.ERROR);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'GenerateAddressLayout.scss';
</style>
