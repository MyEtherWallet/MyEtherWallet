<template>
  <v-snackbar
    :value="show"
    :vertical="true"
    multi-line
    height="176px"
    width="257px"
    :timeout="-1"
    color="#0C4180"
    right
    rounded
    class="mr-16 pr-10"
    transition="scale-transition"
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
  data() {
    return {
      show: false,
      timeoutHolder: null
    };
  },
  computed: {
    ...mapState('global', ['showSurvey'])
  },
  watch: {
    showSurvey(newVal) {
      if (this.timeoutHolder) clearTimeout(this.timeoutHolder);
      if (newVal) {
        this.delayOpenSnackBar();
      } else {
        this.show = newVal;
      }
    }
  },
  mounted() {
    this.delayOpenSnackBar();
  },
  methods: {
    ...mapActions('global', ['setShowSurvey']),
    openSurvey() {
      window.open('https://zjevge12plr.typeform.com/to/bheAMSYf', '_blank');
      this.setShowSurvey(false);
    },
    delayOpenSnackBar() {
      // add 6 secs delay
      // on load when showSurvey is true
      if (this.showSurvey) {
        this.timeoutHolder = setTimeout(() => {
          this.show = this.showSurvey;
        }, 3000);
      }
    }
  }
};
</script>
<style lang="scss">
.mew-survey-content {
  width: 100% !important;
}
</style>
