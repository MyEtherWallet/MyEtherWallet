import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#3f51b5',
        secondary: '#b0bec5',
        accent: '#8c9eff',
        error: '#b71c1c',
        success: '#ffbebe',
        sideMenuBackground: '#002747'
      },
      dark: {
        success: '#ff0000',
        sideMenuBackground: '#0d111e'
      }
    }
  }
});
