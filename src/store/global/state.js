import nodeList from '@/utils/networks';
import store from 'store';

const state = {
  Errors: {},
  Networks: nodeList,
  path: '',
  online: true,
  linkQuery: {},
  locale: store.get('locale') !== undefined ? store.get('locale') : 'en_US'
};

export default state;
