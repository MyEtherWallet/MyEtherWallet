import nodeList from '@/utils/networks';
import store from 'store';

const state = {
  Errors: {},
  ethDonationAddress: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
  Networks: nodeList,
  path: '',
  online: true,
  linkQuery: {},
  locale: store.get('locale') !== undefined ? store.get('locale') : 'en_US'
};

export default state;
