/**
 * Matomo Analytics Mixin
 */
import categories from './configs/configCategories';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'HandlerAnalytics',
  computed: {
    ...mapState('global', ['consentToTrack', 'displayedTrackingPopup'])
  },
  methods: {
    ...mapActions('global', ['setTrackingConsent']),
    /**
     * Sets the consent to track on wallet page
     */
    setConsent() {
      this.setTrackingConsent(!this.consentToTrack);
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
     * Tracks which swap rate user clicks
     */
    trackSwapRate(action) {
      if (this.$matomo && action && this.consentToTrack) {
        this.$matomo.trackEvent(categories.swapRates, action);
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
     * Tracks what user selects to swap from
     * and swap to
     */
    trackSwap(action) {
      if (this.$matomo && action && this.consentToTrack) {
        this.$matomo.trackEvent(categories.swap, action);
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
      if (this.$matomo && this.consentToTrack) {
        this.$matomo.trackEvent(categories.exitDashboard, 'true');
      }
    }
  }
};
