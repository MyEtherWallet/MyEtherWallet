/**
 * Amplitude Analytics Mixin
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
      if (this.consentToTrack) {
        this.$amplitude.track('LandingPageShown');
      }
    },
    /**
     * Tracks which dapp user navigates to
     */
    trackDapp(action) {
      if (action && this.consentToTrack) {
        this.$amplitude.track(`${categories.dashboard}${action}`);
      }
    },
    /**
     * Tracks when user logs out of dashboard
     */
    trackLogout() {
      if (this.consentToTrack) {
        this.$amplitude.track(categories.exitDashboard);
      }
    }
  }
};
