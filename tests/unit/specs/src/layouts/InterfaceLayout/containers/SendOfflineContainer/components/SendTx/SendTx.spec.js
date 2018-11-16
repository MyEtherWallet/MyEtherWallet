import { shallowMount } from '@vue/test-utils';
import SendTx from '@/layouts/InterfaceLayout/containers/SendOfflineContainer/components/SendTx/SendTx.vue';
import sinon from 'sinon';
import { Tooling } from '@@/helpers';

describe('SendTx.vue', () => {
  let localVue, i18n, wrapper, store;

  const rawTx = '{ "rawTransaction": "0xasdfasdfasdfasdfasasdfasdf" }';
  const spy = sinon.stub();

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(SendTx, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        rawTx: rawTx,
        pathUpdate: spy()
      }
    });
  });

  it('should render correct content', () => {});

  describe('SendTx.vue Methods', () => {});
});
