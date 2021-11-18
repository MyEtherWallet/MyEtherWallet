<template>
  <v-snackbar
    :value="showSurvey"
    :vertical="true"
    multi-line
    height="176px"
    width="257px"
    :timeout="-1"
    color="#0C4180"
    right
    rounded
    class="mr-16 pr-10"
    content-class="mew-survey-content d-flex flex-column justify-space-between pa-3"
  >
    <div class="mew-heading-4 text-center whiteAlways--text">
      Want to help improve MEW web?
    </div>
    <mew-button
      has-full-width
      title="Take a short survey"
      btn-style="background"
      btn-size="large"
      @click.native="openSurvey"
    />
    <mew-button
      has-full-width
      title="No, thanks"
      btn-style="outline"
      btn-size="large"
      @click.native="setShowSurvey(false)"
    />
  </v-snackbar>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
  computed: {
    ...mapState('global', ['showSurvey'])
  },
  methods: {
    ...mapActions('global', ['setShowSurvey']),
    openSurvey() {
      window.open('https://zjevge12plr.typeform.com/to/bheAMSYf', '_blank');
      this.setShowSurvey(false);
    }
  }
};
</script>
<style lang="scss">
.mew-survey-content {
  width: 100% !important;
}
</style>
