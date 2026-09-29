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
      'xl-min': '1140px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl': '1601px',
      print: { raw: 'print' }, // => @media  print { ... }
    },
    extend: {
      fontSize: {
        's-48': ['48px', '120%'],
        's-80': ['80px', '120%'],
        's-64': ['64px', '110%'],
        's-54': ['54px', '120%'],
        's-52': '52px',
        's-40': '40px',
        's-32': '32px',
        's-28': '28px',
        's-24': '24px',
        's-22': '22px',
        's-20': '20px',
        's-17': '17px',
        's-16': '16px',
        's-15': '15px',
        's-14': '14px',
        's-13': '13px',
        's-12': '12px',
        's-11': '11px',
        's-9': '9px',
        's-8': '8px',
      },
      lineHeight: {
        'p-100': '100%',
        'p-110': '110%',
        'p-120': '120%',
        'p-130': '130%',
        'p-140': '140%',
        'p-150': '150%',
        'p-160': '160%',
      },
      letterSpacing: {
        'sp-06': '0.6px',
        'sp-00': '0px',
      },
      transitionProperty: {
        height: 'height',
        bg: 'background',
      },
      borderWidth: {
        1: '1px',
      },
      borderRadius: {
        32: '32px',
        24: '24px',
        20: '20px',
        16: '16px',
        12: '12px',
        8: '8px',
      },
      backgroundImage: {
        // This adds the gradient as a reusable background utility
        'stock-gradient':
          'linear-gradient(270deg, #40E0D0 0%, #55DAA2 6.6%, #7ED06D 16.83%, #AAC137 25%, #D5AB00 35.58%, #FF8C00 43.75%, #FF8C00 55.77%, #FF7526 77.4%, #FF5D3D 100%)',
      },
    },
  },
}
