/**
 * Matomo Analytics Mixin
 */
import { mapState, mapActions } from 'vuex';
import categories from './configs/configCategories';
import { isEmpty } from 'lodash';

export default {
  name: 'HandlerAnalytics',
  computed: {
    ...mapState('popups', [
      'consentToTrack',
      'displayedTrackingPopup',
      'enkryptLandingPopup',
      'enkryptLandingPopupClosed'
    ]),
    ...mapState('wallet', ['isOfflineApp']),
    shouldDisplayTrackingPopup() {
      if (this.isOfflineApp) return false;
      if (!this.enkryptLandingPopup) {
        return this.displayedTrackingPopup;
      }
      return true;
    }
  },
  methods: {
    ...mapActions('popups', ['setTrackingConsent']),
    /**
     * Sets the consent to track on wallet page
     */
    setConsent() {
      this.$amplitude.setOptOut(!this.consentToTrack);
      this.setTrackingConsent(!this.consentToTrack);
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
          click_event: event
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
        this.$amplitude.track(categories.createWallet, {
          click_event: event
        });
      }
    },
    /**
     *
     * @param {String} event
     * tracks all events that happen
     * inside the access wallet page
     */
    trackAccessWalletAmplitude(event) {
      if (this.consentToTrack) {
        this.$amplitude.track(categories.accessWallet, {
          click_event: event
        });
      }
    },
    /**
     * Tracks when user lands on landing page
     */
    trackLandingPage() {
      if (this.$matomo && this.consentToTrack) {
        this.$matomo.trackEvent(categories.landingPage, 'landed on');
      }
    },
    /**
     * Tracks users version
     */
    trackUserVersion(action) {
      if (this.$matomo && action && this.consentToTrack) {
        this.$matomo.trackEvent(categories.mewVersion, action);
      }
    },
    /**
     * Tracks when user lands on create wallet
     * also tracks what type of wallet user creates
     * (depends on the action being passed in)
     */
    trackCreateWallet(action) {
      if (this.$matomo && action && this.consentToTrack) {
        this.$matomo.trackEvent(categories.createWallet, action);
      }
    },
    /**
     * Tracks when user lands on access wallet
     * also tracks what type of connection user uses to access dashboard
     * (depends on the action being passed in)
     */
    trackAccessWallet(action) {
      if (this.$matomo && action && this.consentToTrack) {
        this.$matomo.trackEvent(categories.accessWallet, action);
      }
    },
    /**
     * Tracks when user switches network
     */
    trackNetworkSwitch(action) {
      if (this.$matomo && action && this.consentToTrack) {
        this.$matomo.trackEvent(categories.networkSwitch, action);
      }
    },
    /**
     * Tracks which dapp user navigates to
     */
    trackDapp(action) {
      if (this.$matomo && action && this.consentToTrack) {
        this.$matomo.trackEvent(categories.dapp, action);
      }
    },
    /**
     * Tracks when user changes gas type
     */
    trackGasSwitch(action) {
      if (this.$matomo && action && this.consentToTrack) {
        this.$matomo.trackEvent(categories.gasSwitch, action);
      }
    },
    /**
     * Tracks when global error modal pops up
     */
    trackGlobalError(action) {
      if (this.$matomo && this.consentToTrack) {
        this.$matomo.trackEvent(categories.globalError, action);
      }
    },
    /**
     * Tracks when user logs out of dashboard
     */
    trackLogout() {
      if (this.consentToTrack) {
        if (this.$matomo) {
          this.$matomo.trackEvent(categories.exitDashboard, 'true');
        }

        this.$amplitude.track(categories.exitDashboard);
      }
    },
    /**
     * Tracks when user clicks enkrypt install
     */
    trackEnkryptInstall() {
      if (this.$matomo && this.consentToTrack) {
        this.$matomo.trackEvent(categories.enkrypt, 'true');
      }
    },
    /**
     * Tracks when user clicks mewwallet install
     */
    trackMewWalletInstall() {
      if (this.$matomo && this.consentToTrack) {
        this.$matomo.trackEvent(categories.mewwallet, 'true');
      }
    },
    /**
     * SWAP specific analytics
     */

    /**
     * Tracks which swap rate user clicks
     */
    trackSwapRate(action) {
      if (this.$matomo && action && this.consentToTrack) {
        this.$matomo.trackEvent(categories.swapTokenPair, action);
      }
    },
    /**
     * Tracks which swap rate user clicks
     */
    trackSwapToken(action) {
      if (this.$matomo && action && this.consentToTrack) {
        this.$matomo.trackEvent(categories.swapToken, action);
      }
    },
    /**
     * Tracks what user selects to swap from
     * and swap to
     */
    trackSwap(action, key, value) {
      if (this.$matomo && action && this.consentToTrack) {
        if (key && value) {
          this.$matomo.trackEvent(categories.swap, action, key, value);
        } else {
          this.$matomo.trackEvent(categories.swap, action);
        }
      }
    },
    /**
     * Tracks what user selects to buy or sell
     */
    trackBuySell(action) {
      if (this.$matomo && action && this.consentToTrack) {
        this.$matomo.trackEvent(categories.buySell, action);
      }
    }
  }
};
