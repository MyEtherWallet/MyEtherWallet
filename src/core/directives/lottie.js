import lottie from 'lottie-web';
import checkmark from '@/assets/images/icons/lottie/checkmark.json';
const ICONS = {
  checkmark: checkmark
};
const LottieAnimation = {
  bind: function (element, binding) {
    if (!ICONS[binding.value]) throw new Error('Lottie icon not found!');
    lottie.loadAnimation({
      container: element,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: ICONS[binding.value]
    });
  }
};

export default LottieAnimation;
