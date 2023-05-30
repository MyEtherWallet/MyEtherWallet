<template>
  <mew-popup
    hide-close-btn
    :show="show"
    :has-buttons="false"
    :has-title="false"
    :has-padding="false"
    max-width="600"
    has-body-content
  >
    <div class="the-survey-popup popup-container px-6 px-sm-15">
      <!-- ======================================================================= -->
      <!-- Popup close button -->
      <!-- ======================================================================= -->
      <v-btn icon class="close-button" @click="close">
        <v-icon color="textDark">mdi-close</v-icon>
      </v-btn>

      <!-- ======================================================================= -->
      <!-- Header -->
      <!-- ======================================================================= -->
      <div class="text-center mew-logo">
        <img :src="logo" alt="mew logo" />
      </div>

      <!-- ======================================================================= -->
      <!-- Text content -->
      <!-- ======================================================================= -->
      <div class="px-5">
        <div class="survey-popup-title text-center black--text mb-4">
          Before you go!
        </div>
        <div class="survey-popup-text text-center black--text">
          Let's team up to hit your daily crypto targets. To better assist you,
          could you spare a moment for a quick survey? It won't take more than a
          minute.
        </div>
      </div>

      <!-- ======================================================================= -->
      <!-- Buttons -->
      <!-- ======================================================================= -->
      <div
        class="d-flex flex-column-reverse flex-md-row align-center justify-space-around mt-6 mb-10"
      >
        <mew-button
          title="Take a survey"
          btn-size="xlarge"
          btn-style="background"
          class="survey-button"
          @click.native="goToSurvey"
        />
      </div>
    </div>
  </mew-popup>
</template>
<script>
import mewLogo from '@/assets/images/icons/icon-mew-logo-survey.svg';
import { mapActions } from 'vuex';
export default {
  name: 'TheSurveytPopup',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      logo: mewLogo
    };
  },
  computed: {},
  methods: {
    ...mapActions('popups', ['neverShowSurveyPopup']),
    goToSurvey() {
      // eslint-disable-next-line
      window.open('https://mewwallet.typeform.com/websurvey-short', '_blank');
      this.close();
    },
    close() {
      this.neverShowSurveyPopup();
    }
  }
};
</script>

<style lang="scss" scoped>
.popup-container {
  position: relative;
  background-image: url(~@/assets/images/backgrounds/bg-survey.png);
  background-position: top center;
  background-size: contain;
  overflow: hidden;
  margin-top: -20px;
}

.mew-logo {
  font-size: 0;
  height: 156px;
}

.survey-button {
  width: 264px;
}

.survey-popup-title {
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 38px;
  letter-spacing: -0.24px;
  margin-top: -9px;
}

.survey-popup-text {
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 9;
}
</style>
