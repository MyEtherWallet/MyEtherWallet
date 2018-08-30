<template>
  <div class="your-password">
    <tutorial-modal :skip="skip"/>
    <by-json-page-title/>
    <div class="wrap">
      <div class="page-container">
        <div 
          v-show="!byJson && !byMnemonic" 
          class="nav-tab-user-input-box">
          <b-tabs class="x100">
            <div class="progress-bar"/>
            <b-tab
              title="By JSON File"
              active>

              <div class="title-block">
                <div class="title-popover">
                  <h3>{{ $t("createWallet.yourPw") }}</h3>
                  <popover :popcontent="$t('popover.whatIsMessageContent')" />
                </div>
              </div>

              <create-wallet-input
                v-model="password"
                :switcher="switcher"
                :param="'Json'" />
              <create-wallet-input-footer />
            </b-tab>
            <b-tab title="By Mnemonic Phrase" >

              <div class="title-block">
                <div class="title-popover">
                  <h3>{{ $t("createWallet.yourPw") }}</h3>
                  <popover :popcontent="$t('popover.whatIsMessageContent')"/>
                </div>
              </div>

              <create-wallet-input
                v-model="password"
                :switcher="switcher"
                :param="'Mnemonic'" />
              <create-wallet-input-footer />
            </b-tab>
          </b-tabs>
        </div>
        <by-json-file-container
          v-if="byJson && !byMnemonic"
          :password="password" />
        <by-mnemonic-container v-if="!byJson && byMnemonic" />
      </div>
    </div>

    <by-json-page-footer/>

  </div>
</template>

<script>
import ByJsonFileContainer from './containers/ByJsonFileContainer';
import ByMnemonicContainer from './containers/ByMnemonicContainer';
import TutorialModal from './components/TutorialModal';
import CreateWalletInput from './components/CreateWalletInput';
import CreateWalletInputFooter from './components/CreateWalletInputFooter';
import PageFooter from './components/PageFooter';
import PageTitle from './components/PageTitle';

export default {
  components: {
    'by-json-file-container': ByJsonFileContainer,
    'by-mnemonic-container': ByMnemonicContainer,
    'tutorial-modal': TutorialModal,
    'by-json-page-title': PageTitle,
    'create-wallet-input': CreateWalletInput,
    'create-wallet-input-footer': CreateWalletInputFooter,
    'by-json-page-footer': PageFooter
  },
  data() {
    return {
      byJson: false,
      byMnemonic: false,
      password: ''
    };
  },
  mounted() {
    const skipTutorial = localStorage.getItem('skipTutorial');
    if (
      skipTutorial === undefined ||
      skipTutorial === null ||
      skipTutorial === false
    ) {
      this.$children[0].$refs.tutorial.show();
    }
  },
  methods: {
    switcher(by) {
      if (by === 'Json') {
        this.byJson = true;
        this.byMnemonic = false;
      } else if (by === 'Mnemonic') {
        this.byJson = false;
        this.byMnemonic = true;
      } else {
        this.byJson = false;
        this.byMnemonic = false;
      }
    },
    skip() {
      localStorage.setItem('skipTutorial', true);
      this.$children[0].$refs.tutorial.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CreateWalletLayout.scss';
</style>
