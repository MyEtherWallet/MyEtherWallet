<template>
  <div class="your-password">
    <tutorial-modal ref="tutorialModal" :skip="skip" />
    <scan-to-download-modal ref="scanToDownloadModal" />
    <ipad-modal ref="ipadModal" />
    <by-json-page-title />
    <div class="wrap">
      <div class="page-container">
        <div v-show="!byJson && !byMnemonic" class="nav-tab-user-input-box">
          <b-tabs class="x100">
            <div v-if="showProgressBar" class="progress-bar" />
            <b-tab
              class="mew-connect-block"
              title="MEWconnect"
              active
              @click="showProgressBar = false"
            >
              <div class="title-block">
                <div class="title-popover">
                  <h3>{{ $t('createWallet.titleMEWConnect') }}</h3>
                  <popover :popcontent="$t('home.aboutMewConnectDesc')" />
                </div>
                <p>{{ $t('createWallet.mewConnectDesc') }}</p>
              </div>

              <div class="appstores">
                <div class="icons">
                  <a
                    v-if="canDownloadApple"
                    href="https://itunes.apple.com/us/app/mewconnect/id1391097156?mt=8"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="~@/assets/images/icons/appstore.svg"
                      height="40"
                    />
                  </a>
                  <div v-else @click="openIpadModal">
                    <img
                      src="~@/assets/images/icons/appstore.svg"
                      height="40"
                    />
                  </div>
                  <a
                    href="http://play.google.com/store/apps/details?id=com.myetherwallet.mewconnect"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="~@/assets/images/icons/google-play.svg"
                      height="40"
                    />
                  </a>
                </div>
                <div class="download">
                  <p @click="scanToDownloadModalOpen">
                    {{ $t('createWallet.scanToDownload') }}
                  </p>
                </div>
              </div>

              <div class="bottom-image">
                <img src="@/assets/images/etc/phones.png" />
              </div>
            </b-tab>
            <b-tab
              :title="$t('createWallet.byJsonFile')"
              @click="showProgressBar = true"
            >
              <div class="title-block">
                <div class="not-recommended">
                  {{ $t('createWallet.notARecommendedWay') }}
                </div>
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
                <div class="not-recommended">
                  {{ $t('createWallet.notARecommendedWay') }}
                </div>
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
import { Misc } from '@/helpers';
import IpadModal from '@/components/IpadModal';
import platform from 'platform';

export default {
  components: {
    'by-json-file-container': ByJsonFileContainer,
    'by-mnemonic-container': ByMnemonicContainer,
    'tutorial-modal': TutorialModal,
    'scan-to-download-modal': ScanToDownloadModal,
    'by-json-page-title': PageTitle,
    'create-wallet-input': CreateWalletInput,
    'create-wallet-input-footer': CreateWalletInputFooter,
    'by-json-page-footer': PageFooter,
    'ipad-modal': IpadModal
  },
  data() {
    return {
      byJson: false,
      byMnemonic: false,
      password: '',
      showProgressBar: false,
      canDownloadApple: true
    };
  },
  mounted() {
    this.canDownloadApple =
      platform.product !== null
        ? platform.product.toLowerCase() !== 'ipad'
        : true;
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
    },
    openIpadModal() {
      this.$refs.ipadModal.$refs.ipadModal.show();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CreateWalletLayout-desktop.scss';
@import 'CreateWalletLayout-tablet.scss';
@import 'CreateWalletLayout-mobile.scss';
</style>
