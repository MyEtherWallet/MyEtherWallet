export default {
  name: 'HandlerAnalytics',
  methods: {
    /**
     * Track a certain event
     */
    setTracking(category, action) {
      if (this.$matomo) {
        this.$matomo.trackEvent(category, action);
      }
    }
  }
};
