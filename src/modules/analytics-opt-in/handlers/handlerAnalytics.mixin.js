/**
 * Amplitude Analytics Mixin
 */
import { mapState, mapActions } from 'vuex';
import categories from './configs/configCategories';
import { isEmpty } from 'lodash';

export default {
  name: 'HandlerAnalytics',
  computed: {
    ...mapState('popups', ['consentToTrack']),
    ...mapState('wallet', ['isOfflineApp']),
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
      if (this.consentToTrack) {
        this.$amplitude.track(`UserOptOutTracking`);
      }

      const initialValue = this.consentToTrack;

      this.setTrackingConsent(!this.consentToTrack).then(() => {
        this.$amplitude.setOptOut(!this.consentToTrack);
        if (!initialValue && this.consentToTrack)
          this.$amplitude.track(`UserOptInTracking`);
      });
    },
    /**
     *
     * @param {String} event
     * tracks all events that happen
     * inside the landing page
     */
    trackLandingPageAmplitude(event, prop) {
      if (this.consentToTrack) {
        if (!isEmpty(prop)) {
          this.$amplitude.track(`${categories.landingPage}${event}`, prop);
          return;
        }
        this.$amplitude.track(`${categories.landingPage}${event}`);
      }
    },
    /**
     *
     * @param {String} event
     * tracks all events that happen
     * inside the landing page
     */
    trackNftModule(event, prop) {
      if (this.consentToTrack) {
        if (!isEmpty(prop)) {
          this.$amplitude.track(`${categories.nftModule}${event}`, prop);
          return;
        }
        this.$amplitude.track(`${categories.nftModule}${event}`);
      }
    },
    /**
     *
     * @param {String} event
     * tracks all events that happen
     * inside the header
     */
    trackHeaderAmplitude(event, prop) {
      if (this.consentToTrack) {
        if (!isEmpty(prop)) {
          this.$amplitude.track(`${categories.header}${event}`, prop);
          return;
        }
        this.$amplitude.track(`${categories.header}${event}`);
      }
    },
    /**
     *
     * @param {String} event
     * tracks all events that happen
     * inside the footer
     */
    trackFooterAmplitude(event) {
      if (this.consentToTrack) {
        this.$amplitude.track(categories.footer, {
          to: event
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
      if (this.consentToTrack) {
        if (!isEmpty(prop)) {
          this.$amplitude.track(`${categories.dashboard}${event}`, prop);
          return;
        }
        this.$amplitude.track(`${categories.dashboard}${event}`);
      }
    },
    /**
     *
     * @param {String} event
     * tracks all events that happen
     * inside the swap
     */
    trackSwapAmplitude(event, prop) {
      if (this.consentToTrack) {
        if (!isEmpty(prop)) {
          this.$amplitude.track(`${categories.swapAmplitude}${event}`, prop);
          return;
        }
        this.$amplitude.track(`${categories.swapAmplitude}${event}`);
      }
    },
    /**
     *
     * @param {String} event
     * tracks all events that happen
     * inside the create wallet page
     */
    trackCreateWalletAmplitude(event) {
      if (this.consentToTrack) {
        this.$amplitude.track(`${categories.createWallet}${event}`);
      }
    },
    /**
     *
     * @param {String} event
     * tracks all events that happen
     * inside the create wallet page
     */
    trackBuyHardwareAmplitude(event) {
      if (this.consentToTrack) {
        this.$amplitude.track(`${categories.buyHardware}${event}`);
      }
    },
    /**
     *
     * @param {String} event
     * tracks all events that happen
     * inside the access wallet page
     */
    trackAccessWalletAmplitude(event, prop) {
      if (this.consentToTrack) {
        if (!isEmpty(prop)) {
          this.$amplitude.track(`${categories.accessWallet}${event}`, prop);
          return;
        }
        this.$amplitude.track(`${categories.accessWallet}${event}`);
      }
    },
    /**
     * Tracks when user lands on landing page
     */
    trackLandingPage() {
      if (this.consentToTrack) {
        this.$amplitude.track('LandingPageShown');
      }
    },
    /**
     * Tracks which dapp user navigates to
     */
    trackDapp(action) {
      if (action && this.consentToTrack) {
        this.$amplitude.track(`${categories.dapp}${action}`);
      }
    },
    /**
     * Tracks ad
     */
    trackAd(action) {
      if (action && this.consentToTrack) {
        this.$amplitude.track(`${categories.advertisement}${action}`);
      }
    },
    /**
     * Tracks when user logs out of dashboard
     */
    trackLogout() {
      if (this.consentToTrack) {
        this.$amplitude.track(categories.exitDashboard);
      }
    },
    /**
     * Track Buy/Sell
     */
    trackBuySell(action, event = {}) {
      if (this.consentToTrack) {
        if (!isEmpty(event)) {
          this.$amplitude.track(`${categories.buySell}${action}`, event);
          return;
        }
        this.$amplitude.track(`${categories.buySell}${action}`);
      }
    }
  }
};
