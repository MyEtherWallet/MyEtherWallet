<template>
  <div class="your-password">
    <tutorial-modal ref="tutorialModal" :skip="skip" />
    <scan-to-download-modal ref="scanToDownloadModal" />

    <by-json-page-title />
    <div class="wrap">
      <div class="page-container">
        <div v-show="!byJson && !byMnemonic" class="nav-tab-user-input-box">
          <b-tabs class="x100">
            <div v-if="showProgressBar" class="progress-bar" />
            <b-tab
              :title="$t('createWallet.byJsonFile')"
              @click="showProgressBar = true"
            >
              <div class="title-block">
                <!-- <div class="not-recommended">
                  {{ $t('createWallet.notARecommendedWay') }}
                </div> -->
                <div class="title-popover">
                  <h3>{{ $t('createWallet.yourPw') }}</h3>
                  <popover :popcontent="$t('popover.password')" />
                </div>
              </div>

              <create-wallet-input
                v-model="password"
                :switcher="switcher"
                :param="'Json'"
              />
              <create-wallet-input-footer
                :combo="$t('createWallet.keyPass')"
                :desc="$t('createWallet.keyPassDesc')"
              />
            </b-tab>
            <b-tab
              :title="$t('createWallet.byMnemonic')"
              @click="showProgressBar = true"
            >
              <div class="title-block">
                <!-- <div class="not-recommended">
                  {{ $t('createWallet.notARecommendedWay') }}
                </div> -->
                <div class="title-popover">
                  <h3>{{ $t('createWallet.yourPw') }}</h3>
                  <popover :popcontent="$t('popover.password')" />
                </div>
              </div>

              <create-wallet-input
                v-model="password"
                :switcher="switcher"
                :param="'Mnemonic'"
              />
              <create-wallet-input-footer
                :combo="$t('createWallet.passMnem')"
                :desc="$t('createWallet.passMnemDesc')"
              />
            </b-tab>
          </b-tabs>
        </div>
        <by-json-file-container
          v-if="byJson && !byMnemonic"
          :password="password"
        />
        <by-mnemonic-container v-if="!byJson && byMnemonic" />
      </div>
    </div>

    <by-json-page-footer />
  </div>
</template>

<script>
import ByJsonFileContainer from './containers/ByJsonFileContainer';
import ByMnemonicContainer from './containers/ByMnemonicContainer';
import TutorialModal from './components/TutorialModal';
import ScanToDownloadModal from './components/ScanToDownloadModal';
import CreateWalletInput from './components/CreateWalletInput';
import CreateWalletInputFooter from './components/CreateWalletInputFooter';
import PageFooter from './components/PageFooter';
import PageTitle from './components/PageTitle';
import store from 'store';
import Misc from '@/helpers/misc';

export default {
  components: {
    'by-json-file-container': ByJsonFileContainer,
    'by-mnemonic-container': ByMnemonicContainer,
    'tutorial-modal': TutorialModal,
    'scan-to-download-modal': ScanToDownloadModal,
    'by-json-page-title': PageTitle,
    'create-wallet-input': CreateWalletInput,
    'create-wallet-input-footer': CreateWalletInputFooter,
    'by-json-page-footer': PageFooter
  },
  data() {
    return {
      byJson: false,
      byMnemonic: false,
      password: '',
      showProgressBar: false
    };
  },
  mounted() {
    const skipTutorial = store.get('skipTutorial');
    if (
      skipTutorial === undefined ||
      skipTutorial === null ||
      skipTutorial === false
    ) {
      this.$refs.tutorialModal.$refs.tutorial.show();
    }
  },
  methods: {
    switcher(by) {
      Misc.scrollToTop(1000);
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
      store.set('skipTutorial', true);
      this.$refs.tutorialModal.$refs.tutorial.hide();
    },
    scanToDownloadModalOpen() {
      this.$refs.scanToDownloadModal.$refs.scantodownload.show();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CreateWalletLayout-desktop.scss';
@import 'CreateWalletLayout-tablet.scss';
@import 'CreateWalletLayout-mobile.scss';
</style>
