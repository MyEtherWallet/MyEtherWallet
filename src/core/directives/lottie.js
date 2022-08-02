import lottie from 'lottie-web';
import checkmark from '@/assets/images/icons/lottie/checkmark.json';
import swap from '@/assets/images/icons/lottie/swap.json';
import confetti from '@/assets/images/icons/lottie/confetti.json';
const ICONS = {
  checkmark: checkmark,
  swap: swap,
  confetti: confetti
};
const LottieAnimation = {
  bind: function (element, binding) {
    if (!ICONS[binding.value]) throw new Error('Lottie icon not found!');
    if (ICONS[binding.value] === ICONS.confetti) {
      lottie.loadAnimation({
        container: element,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: ICONS[binding.value]
      });

      return;
    }
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
