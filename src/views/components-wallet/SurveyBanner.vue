<template>
  <div v-if="show" class="the-survey-banner">
    <div class="the-survey-banner__content">
      <!-- ======================================================================= -->
      <!-- Banner close button -->
      <!-- ======================================================================= -->
      <v-btn icon class="close-button" @click="close">
        <v-icon color="white">mdi-close</v-icon>
      </v-btn>

      <!-- ======================================================================= -->
      <!-- Content -->
      <!-- ======================================================================= -->
      <div class="pa-4 d-block d-md-flex align-center justify-space-between">
        <div class="d-block d-md-flex align-center justify-start">
          <img :src="iconBanner" alt="survey icon" class="mr-4" />
          <div>
            <div class="survey-banner-title white--text mb-2">
              We need your feedback!
            </div>
            <div class="survey-banner-text white--text">
              Help us improve the product you love.<br />Your insights would be
              incredibly valuable to us.
            </div>
          </div>
        </div>
        <mew-button
          title="Take a survey"
          btn-size="medium"
          btn-style="background"
          class="survey-button"
          @click.native="goToSurvey"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import iconSurveyBanner from '@/assets/images/icons/icon-survey-banner.svg';
export default {
  name: 'SurveytBanner',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      iconBanner: iconSurveyBanner
    };
  },
  computed: {},
  methods: {
    ...mapActions('popups', ['neverShowSurveyBanner']),
    goToSurvey() {
      // eslint-disable-next-line
      window.open('https://mewwallet.typeform.com/websurvey', '_blank');
      this.close();
    },
    close() {
      this.neverShowSurveyBanner();
    }
  }
};
</script>

<style lang="scss" scoped>
.the-survey-banner {
  position: fixed;
  min-height: 96px;
  left: 50%;
  bottom: 16px;
  z-index: 6;
  padding: 0 24px 0 24px;
  width: 790px;
  transform: translate(-50%, 0);
  margin-left: -48px;

  @media (max-width: 1480px) {
    width: 52.5%;
    transform: translate(0, 0);
    left: 300px;
    margin-left: 0;
  }

  @media (max-width: 1263px) {
    width: 70%;
    transform: translate(-50%, 0);
    left: 50%;
    margin-left: 0;
  }

  @media (max-width: 960px) {
    width: 100%;
    transform: translate(-50%, 0);
    left: 50%;
    margin-left: 0;
  }

  @media (max-width: 768px) {
    padding: 0 8px 0 8px;
  }

  &__content {
    background: #022546;
    box-shadow: 0px 8px 20px rgba(21, 29, 63, 0.3);
    border-radius: 8px;
    min-height: 96px;
    width: 100%;
  }
}

.survey-banner-title {
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 21px;
}

.survey-banner-text {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  opacity: 0.7;

  @media (max-width: 959px) {
    margin-bottom: 8px;
  }
}

.survey-button {
  width: 142px;
  height: 40px;
  margin-right: 24px;
}

.close-button {
  position: absolute;
  top: 0px;
  right: 24px;
  z-index: 9;

  @media (max-width: 768px) {
    right: 8px;
  }
}
</style>
