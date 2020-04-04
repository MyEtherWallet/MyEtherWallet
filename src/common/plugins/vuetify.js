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
        white: '#ffffff',
        black: '#000000',
        emerald: '#05c0a5',
        royal_blue: '#5a78f0',
        dark_sacramento: '#003945',
        dark_space: '#0b2840',
        violet: '#7070e3',
        police_strobe: '#25b0e8',
        independence: '#536d8b',
        dark_independence: '#334758',
        cerise: '#e96071',
        cardinal: '#a70015',
        naples_yellow: '#fcb755',
        primary_silver: '#f2f4fa',
        mint: '#cdf2ee',
        light_mint: '#f2fafa',
        spruce: '#506175',
        silver: '#cecece',
        gray1: '#96a8b6',
        gray2: '#4d687e',
        gray3: '#ececec',
        gray4: '#6d89a6',
        text_default: '#0b2840',
        text_warning: '#ff9800',
        bg_warning: '#fffde7',
        bg_sidemenu: '#002747',
        bg_overlay: '#f2fafa',
        bg_white_sheet: '#ffffff',
        bg_wallet: '#f2f4fa',
        bg_table: '#f9f9f9'
      },
      dark: {
        white: '#ffffff',
        black: '#000000',
        emerald: '#05c0a5',
        royal_blue: '#5a78f0',
        dark_sacramento: '#003945',
        dark_space: '#0b2840',
        violet: '#7070e3',
        police_strobe: '#25b0e8',
        independence: '#536d8b',
        dark_independence: '#334758',
        cerise: '#e96071',
        cardinal: '#a70015',
        naples_yellow: '#fcb755',
        primary_silver: '#f2f4fa',
        mint: '#cdf2ee',
        light_mint: '#f2fafa',
        spruce: '#506175',
        silver: '#cecece',
        gray1: '#96a8b6',
        gray2: '#4d687e',
        gray3: '#ececec',
        gray4: '#6d89a6',
        text_default: '#95aed8',
        text_warning: '#ff9800',
        bg_warning: '#fffde7',
        bg_sidemenu: '#0d111e',
        bg_overlay: '#151a29',
        bg_white_sheet: '#151a29',
        bg_wallet: '#151a29',
        bg_table: '#0f1320'
      }
    }
  }
});
