<template>
  <div>
    <the-default-header />
    <v-main>
      <router-view />
    </v-main>
    <the-default-footer />
    <the-enkrypt-popup v-if="!isOfflineApp" :show="enkryptLandingPopup" />
    <the-survey-popup
      v-if="!isOfflineApp"
      :show="surveyPopup && !neverShowSurveyPopup"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'TheDefaultView',
  components: {
    TheDefaultHeader: () => import('./components-default/TheDefaultHeader'),
    TheDefaultFooter: () => import('./components-default/TheDefaultFooter'),
    TheEnkryptPopup: () => import('./components-default/TheEnkryptPopup'),
    TheSurveyPopup: () => import('./components-default/TheSurveyPopup')
  },
  computed: {
    ...mapState('popups', [
      'enkryptLandingPopup',
      'surveyPopup',
      'neverShowSurveyPopup'
    ]),
    ...mapState('wallet', ['isOfflineApp'])
  }
};
</script>
