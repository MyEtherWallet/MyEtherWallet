import categories from '../configs/configCategories';

export default {
  name: 'HandlerAnalytics',
  methods: {
    /**
     * Tracks when user lands on landing page
     */
    trackLandingPage() {
      if (this.$matomo) {
        this.$matomo.trackEvent(categories.landingPage, 'landed');
      }
    },
    /**
     * Tracks when user lands on create wallet
     * also tracks what type of wallet user creates
     * (depends on the action being passed in)
     */
    trackCreateWallet(action) {
      if (this.$matomo) {
        this.$matomo.trackEvent(categories.createWallet, action);
      }
    },
    /**
     * Tracks when user lands on access wallet
     * also tracks what type of connection user uses to access dashboard
     * (depends on the action being passed in)
     */
    trackAccessWallet(action) {
      console.error('action', action);
      if (this.$matomo) {
        this.$matomo.trackEvent(categories.accessWallet, action);
      }
    }
  }
};
