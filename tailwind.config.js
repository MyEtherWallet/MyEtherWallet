/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,vue,ts}',
    './index.html',
    './node_modules/@myetherwallet/vue-common-components/dist/*.js',
    './node_modules/@myetherwallet/vue-common-components/dist/*.cjs',
  ],
  theme: {
    screens: {
      /**
       * Old Names:
       * @screen-desktop-large: 1601px;
       * @screen-desktop: 1400px;
       * @screen-desktop-min: 1280px;
       * @screen-tablet-big: 1084px;
       * @screen-tablet: 1024px;
       * @screen-tablet-header: 940px;
       * @screen-tablet-portaint: 820px;
       * @screen-tablet-min: 768px;
       * @screen-mobile: 576px
       */
      xs: '576px',
      sm: '768px',
      md: '820px',
      'md-header': '940px',
      lg: '1024px',
      'lg-max': '1084px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl': '1601px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      appBackground: '#f5f5f7',
      'side-menu': '#07385f',
      titleColor: '#222222',
      primary: 'rgb(0,90,229,1)',
      primaryActive: '#0067e0',
      violet: '#9D00FF',
      violetActive: '#a81aff',
      portfolio: '#0c5876',
      mewBg: 'rgba(53,94,236,0.1)',
      enkryptBg: 'rgba(186,74,255,0.1)',
      black: '#000000',
      white: '#ffffff',
      info: 'rgba(0, 0, 0, 0.7)',
      'grey-light': 'rgba(232, 232, 237, 1)',
      'grey-50': 'rgba(0,0,0,0.5)',
      'grey-30': 'rgba(0,0,0,0.3)',
      'grey-10': 'rgba(0,0,0,0.1)',
      'grey-5': 'rgba(0,0,0,0.05)',
      'grey-8': 'rgba(0,0,0,0.08)',
      mewGreenText: 'rgba(12,88,118,1)',
      error: 'rgba(228,12,91,1)',
      'error-10': 'rgba(228,12,91,0.1)',
      'error-7': 'rgba(228,12,91,0.07)',
      blue: 'rgba(22 129,255,1)',
      'blue-10': 'rgba(22,129,255,0.1)',
      'blue-7': 'rgba(22,129,255,0.07)',
      'blue-950': 'rgb(23 37 84)',
      purple: 'rgba(104, 76, 255, 1)',
      'purple-10': 'rgba(104,76,255,0.1)',
      'purple-7': 'rgba(104,76,255,0.07)',
      'ring-color': 'rgba(228,12,91,1)'
    },
    extend: {
      fontSize: {
        's-80': ['80px', '120%'],
        's-64': ['64px', '110%'],
        's-54': ['54px', '120%'],
        's-52': '52px',
        's-40': '40px',
        's-32': '32px',
        's-28': '28px',
        's-17': '17px',
      },
      lineHeight: {
        'p-100': '100%',
        'p-110': '110%',
        'p-120': '120%',
        'p-130': '130%',
        'p-140': '140%',
        'p-150': '150%',
      },
      letterSpacing: {
        'sp-06': '0.6px',
      },
      transitionProperty: {
        height: 'height',
        bg: 'background',
      },
      borderRadius: {
        '4xl': '32px',
      },
      ringColor: '#3b82f6', // Change default ring color to blue

    },
  },
  plugins: [],
}
