<template>
  <v-snackbar
    :value="show"
    :vertical="true"
    multi-line
    height="208px"
    min-height="208px"
    :width="width"
    :min-width="width"
    :timeout="-1"
    color="#0C4180"
    right
    rounded
    :class="[notSmallOrXs ? 'pr-12' : 'pr-6', 'mr-16 snackbar-container']"
    transition="scale-transition"
    content-class="mew-survey-content d-flex flex-column justify-space-between pa-3"
  >
    <div
      :class="[
        notSmallOrXs ? 'text-center' : 'text-left',
        'mew-heading-4 whiteAlways--text'
      ]"
    >
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
    ...mapState('global', ['showSurvey']),
    notSmallOrXs() {
      return (
        this.$vuetify.breakpoint.lg ||
        this.$vuetify.breakpoint.xl ||
        this.$vuetify.breakpoint.md
      );
    },
    width() {
      if (this.notSmallOrXs) {
        return '281px';
      } else if (this.$vuetify.breakpoint.sm) {
        return '235px';
      }
      return '211px';
    }
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

.snackbar-container {
  margin-bottom: -80px;
}
</style>
