/**
 * Amplitude Analytics Mixin
 */
import { mapState, mapActions, mapGetters } from 'vuex';
import categories from './configs/configCategories';
import { isEmpty } from 'lodash';

export default {
  name: 'HandlerAnalytics',
  computed: {
    ...mapState('popups', ['consentToTrack']),
    ...mapState('wallet', ['isOfflineApp']),
    ...mapState('wallet', ['isOfflineApp']),
    ...mapGetters('global', ['network']),
    shouldDisplayTrackingPopup() {
      if (this.isOfflineApp) return false;
      return true;
    }
  },
  methods: {
    ...mapActions('popups', ['setTrackingConsent']),
    /**
     * Sets the consent to track on wallet page
     */
    setConsent() {
      if (this.isOfflineApp) return;
      if (this.consentToTrack) {
        this.$amplitude.track(`UserOptOutTracking`, {
          network: this.network.type.name
        });
      }

      const initialValue = this.consentToTrack;

      this.setTrackingConsent(!this.consentToTrack).then(() => {
        this.$amplitude.setOptOut(!this.consentToTrack);
        if (!initialValue && this.consentToTrack)
          this.$amplitude.track(`UserOptInTracking`, {
            network: this.network.type.name
          });
      });
    },
    /**
     *
     * @param {String} event
     * tracks all events that happen
     * inside the landing page
     */
    trackLandingPageAmplitude(event, prop) {
      if (this.isOfflineApp) return;
      if (this.consentToTrack) {
        if (!isEmpty(prop)) {
          const newObj = Object.assign({}, prop, {
            network: this.network.type.name
          });
          this.$amplitude.track(`${categories.landingPage}${event}`, newObj);
          return;
        }
        this.$amplitude.track(`${categories.landingPage}${event}`, {
          network: this.network.type.name
        });
      }
    },
    /**
     *
     * @param {String} event
     * tracks all events that happen
     * inside the landing page
     */
    trackNftModule(event, prop) {
      if (this.isOfflineApp) return;
      if (this.consentToTrack) {
        if (!isEmpty(prop)) {
          const newObj = Object.assign({}, prop, {
            network: this.network.type.name
          });
          this.$amplitude.track(`${categories.nftModule}${event}`, newObj);
          return;
        }
        this.$amplitude.track(`${categories.nftModule}${event}`, {
          network: this.network.type.name
        });
      }
    },
    /**
     *
     * @param {String} event
     * tracks all events that happen
     * inside the header
     */
    trackHeaderAmplitude(event, prop) {
      if (this.isOfflineApp) return;
      if (this.consentToTrack) {
        if (!isEmpty(prop)) {
          const newObj = Object.assign({}, prop, {
            network: this.network.type.name
          });
          this.$amplitude.track(`${categories.header}${event}`, newObj);
          return;
        }
        this.$amplitude.track(`${categories.header}${event}`, {
          network: this.network.type.name
        });
      }
    },
    /**
     *
     * @param {String} event
     * tracks all events that happen
     * inside the footer
     */
    trackFooterAmplitude(event) {
      if (this.isOfflineApp) return;
      if (this.consentToTrack) {
        this.$amplitude.track(categories.footer, {
          to: event,
          network: this.network.type.name
        });
      }
    },
    /**
     *
     * @param {String} event
     * tracks all events that happen
     * inside the dashboard
     */
    trackDashboardAmplitude(event, prop) {
      if (this.isOfflineApp) return;
      if (this.consentToTrack) {
        if (!isEmpty(prop)) {
          const newObj = Object.assign({}, prop, {
            network: this.network.type.name
          });
          this.$amplitude.track(`${categories.dashboard}${event}`, newObj);
          return;
        }
        this.$amplitude.track(`${categories.dashboard}${event}`, {
          network: this.network.type.name
        });
      }
    },
    /**
     *
     * @param {String} event
     * tracks all events that happen
     * inside the swap
     */
    trackSwapAmplitude(event, prop) {
      if (this.isOfflineApp) return;
      if (this.consentToTrack) {
        if (!isEmpty(prop)) {
          const newObj = Object.assign({}, prop, {
            network: this.network.type.name
          });
          this.$amplitude.track(`${categories.swapAmplitude}${event}`, newObj);
          return;
        }
        this.$amplitude.track(`${categories.swapAmplitude}${event}`, {
          network: this.network.type.name
        });
      }
    },
    /**
     *
     * @param {String} event
     * tracks all events that happen
     * inside the create wallet page
     */
    trackCreateWalletAmplitude(event) {
      if (this.isOfflineApp) return;
      if (this.consentToTrack) {
        this.$amplitude.track(`${categories.createWallet}${event}`, {
          network: this.network.type.name
        });
      }
    },
    /**
     *
     * @param {String} event
     * tracks all events that happen
     * inside the create wallet page
     */
    trackBuyHardwareAmplitude(event) {
      if (this.isOfflineApp) return;
      if (this.consentToTrack) {
        this.$amplitude.track(`${categories.buyHardware}${event}`, {
          network: this.network.type.name
        });
      }
    },
    /**
     *
     * @param {String} event
     * tracks all events that happen
     * inside the access wallet page
     */
    trackAccessWalletAmplitude(event, prop) {
      if (this.isOfflineApp) return;
      if (this.consentToTrack) {
        if (!isEmpty(prop)) {
          const newObj = Object.assign({}, prop, {
            network: this.network.type.name
          });
          this.$amplitude.track(`${categories.accessWallet}${event}`, newObj);
          return;
        }
        this.$amplitude.track(`${categories.accessWallet}${event}`, {
          network: this.network.type.name
        });
      }
    },
    /**
     * Tracks when user lands on landing page
     */
    trackLandingPage() {
      if (this.isOfflineApp) return;
      if (this.consentToTrack) {
        this.$amplitude.track('LandingPageShown', {
          network: this.network.type.name
        });
      }
    },
    /**
     * Tracks which dapp user navigates to
     */
    trackDapp(action, prop) {
      if (this.isOfflineApp) return;
      if (action && this.consentToTrack) {
        if (!isEmpty(prop)) {
          const newObj = Object.assign({}, prop, {
            network: this.network.type.name
          });
          this.$amplitude.track(`${categories.accessWallet}${action}`, newObj);
          return;
        }
        this.$amplitude.track(`${categories.accessWallet}${action}`, {
          network: this.network.type.name
        });
      }
    },
    /**
     * Tracks which dapp user navigates to
     */
    trackStaking(action) {
      if (this.isOfflineApp) return;
      if (action && this.consentToTrack) {
        this.$amplitude.track(`${categories.staking}${action}`, {
          network: this.network.type.name
        });
      }
    },
    /**
     * Tracks ad
     */
    trackAd(action) {
      if (this.isOfflineApp) return;
      if (action && this.consentToTrack) {
        this.$amplitude.track(`${categories.advertisement}${action}`, {
          network: this.network.type.name
        });
      }
    },
    /**
     * Tracks when user logs out of dashboard
     */
    trackLogout() {
      if (this.isOfflineApp) return;
      if (this.consentToTrack) {
        this.$amplitude.track(categories.exitDashboard);
      }
    },
    /**
     * Track Buy/Sell
     */
    trackBuySell(action, event = {}) {
      if (this.isOfflineApp) return;
      if (this.consentToTrack) {
        if (!isEmpty(event)) {
          const newObj = Object.assign({}, event, {
            network: this.network.type.name
          });
          this.$amplitude.track(`${categories.buySell}${action}`, newObj);
          return;
        }
        this.$amplitude.track(`${categories.buySell}${action}`, {
          network: this.network.type.name
        });
      }
    },
    /**
     * Track Contract
     */
    trackContract(action, event = {}) {
      if (this.isOfflineApp) return;
      if (this.consentToTrack) {
        if (!isEmpty(event)) {
          const newObj = Object.assign({}, event, {
            network: this.network.type.name
          });
          this.$amplitude.track(`${categories.contract}${action}`, newObj);
          return;
        }
        this.$amplitude.track(`${categories.contract}${action}`, {
          network: this.network.type.name
        });
      }
    },
    trackSurvey(val) {
      if (this.consentToTrack) {
        this.$amplitude.track(`Survey${val}`, {
          network: this.network.type.name
        });
      }
    }
  }
};
