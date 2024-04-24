import { computed, getCurrentInstance } from 'vue';
import { isEmpty } from 'lodash';

import {
  global as useGlobalStore,
  wallet as useWalletStore,
  popups as usePopupsStore
} from '@/core/store/index.js';

import categories from './amplitudeConfigs/configCategories';

export const useAmplitude = () => {
  const vm = getCurrentInstance();
  const $amplitude = vm.proxy.$amplitude;

  const { network } = useGlobalStore();
  const { isOfflineApp } = useWalletStore();
  const { consentToTrack, setTrackingConsent } = usePopupsStore();

  const networkName = network.type.name;

  const wrapperMethod = (evt, prop = {}) => {
    if (isOfflineApp) return;
    if (consentToTrack) {
      const newObj = !isEmpty(prop)
        ? Object.assign({}, prop, {
            network: networkName
          })
        : { network: networkName };
      $amplitude.track(evt, newObj);
    }
  };

  const shouldDisplayTrackingPopup = computed(() => {
    if (isOfflineApp) return false;
    return true;
  });

  const setConsent = () => {
    if (isOfflineApp) return;
    if (consentToTrack) {
      $amplitude.track('UserOptOutTracking', {
        network: networkName
      });
    }

    const initialValue = consentToTrack;
    setTrackingConsent(!consentToTrack).then(() => {
      $amplitude.setOptOut(!consentToTrack);
      if (!initialValue && consentToTrack) {
        $amplitude.track('UserOptInTracking', {
          network: networkName
        });
      }
    });
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
    wrapperMethod(`${categories.accessWallet}${event}`, prop);
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
