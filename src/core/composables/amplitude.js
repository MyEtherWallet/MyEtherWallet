import { computed, getCurrentInstance } from 'vue';
import { isEmpty } from 'lodash';

import categories from './amplitudeConfigs/configCategories';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { usePopupStore } from '@/core/store/popups';

export const useAmplitude = () => {
  const vm = getCurrentInstance();
  const $amplitude = vm.proxy.$amplitude;

  const { network } = useGlobalStore();
  const { isOfflineApp } = useWalletStore();
  const { consentToTrack, setTrackingConsent } = usePopupStore();

  const networkName = network.value.type.name;

  const wrapperMethod = (evt, prop = {}) => {
    if (isOfflineApp.value) return;
    if (consentToTrack.value) {
      const newObj = !isEmpty(prop)
        ? Object.assign({}, prop, {
            network: networkName
          })
        : { network: networkName };
      $amplitude.track(evt, newObj);
    }
  };

  const shouldDisplayTrackingPopup = computed(() => {
    if (isOfflineApp.value) return false;
    return true;
  });

  const setConsent = () => {
    if (isOfflineApp.value) return;
    if (consentToTrack.value) {
      $amplitude.track('UserOptOutTracking', {
        network: networkName
      });
    }

    const initialValue = consentToTrack.value;
    setTrackingConsent(!consentToTrack.value);
    $amplitude.setOptOut(!consentToTrack.value);
    if (!initialValue && consentToTrack.value) {
      $amplitude.track('UserOptInTracking', {
        network: networkName
      });
    }
  };

  const trackLandingPageAmplitude = (event, prop) => {
    wrapperMethod(`${categories.landingPage}${event}`, prop);
  };

  const trackNftModule = (event, prop) => {
    wrapperMethod(`${categories.nftModule}${event}`, prop);
  };

  const trackHeaderAmplitude = (event, prop) => {
    wrapperMethod(`${categories.header}${event}`, prop);
  };

  const trackFooterAmplitude = (event, prop) => {
    wrapperMethod(`${categories.footer}${event}`, prop);
  };

  const trackDashboardAmplitude = (event, prop) => {
    wrapperMethod(`${categories.dashboard}${event}`, prop);
  };

  const trackSwapAmplitude = (event, prop) => {
    wrapperMethod(`${categories.swapAmplitude}${event}`, prop);
  };

  const trackCreateWalletAmplitude = (event, prop) => {
    wrapperMethod(`${categories.createWallet}${event}`, prop);
  };

  const trackBuyHardwareAmplitude = (event, prop) => {
    wrapperMethod(`${categories.buyHardware}${event}`, prop);
  };

  const trackAccessWalletAmplitude = (event, prop) => {
    wrapperMethod(`${categories.accessWallet}${event}`, prop);
  };

  const trackLandingPage = () => {
    wrapperMethod('LandingPageShown');
  };

  const trackDapp = (event, prop) => {
    wrapperMethod(`${categories.dapp}${event}`, prop);
  };

  const trackStaking = event => {
    wrapperMethod(`${categories.staking}${event}`);
  };

  const trackAd = event => {
    wrapperMethod(`${categories.advertisement}${event}`);
  };

  const trackLogout = () => {
    wrapperMethod(`${categories.exitDashboard}`);
  };

  const trackBuySell = (event, prop) => {
    wrapperMethod(`${categories.buySell}${event}`, prop);
  };

  const trackContract = (event, prop) => {
    wrapperMethod(`${categories.contract}${event}`, prop);
  };

  const trackSurvey = event => {
    wrapperMethod(`Survey${event}`);
  };

  return {
    shouldDisplayTrackingPopup,
    setConsent,
    trackLandingPageAmplitude,
    trackNftModule,
    trackHeaderAmplitude,
    trackFooterAmplitude,
    trackDashboardAmplitude,
    trackSwapAmplitude,
    trackCreateWalletAmplitude,
    trackBuyHardwareAmplitude,
    trackAccessWalletAmplitude,
    trackLandingPage,
    trackDapp,
    trackStaking,
    trackAd,
    trackLogout,
    trackBuySell,
    trackContract,
    trackSurvey,
    $amplitude
  };
};
