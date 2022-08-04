import lottie from 'lottie-web';
import checkmark from '@/assets/images/icons/lottie/checkmark.json';
import swap from '@/assets/images/icons/lottie/swap.json';
import confetti from '@/assets/images/icons/lottie/confetti.json';
const ICONS = {
  checkmark: checkmark,
  swap: swap,
  confetti: confetti
};

const LOOP = {
  checkmark: false,
  swap: false,
  confetti: true
};

const AUTOPLAY = {
  checkmark: true,
  swap: true,
  confetti: true
};
const LottieAnimation = {
  bind: function (element, binding) {
    if (!ICONS[binding.value]) throw new Error('Lottie icon not found!');
    lottie.loadAnimation({
      container: element,
      renderer: 'svg',
      loop: LOOP[binding.value],
      autoplay: AUTOPLAY[binding.value],
      animationData: ICONS[binding.value]
    });
  }
};

export default LottieAnimation;
