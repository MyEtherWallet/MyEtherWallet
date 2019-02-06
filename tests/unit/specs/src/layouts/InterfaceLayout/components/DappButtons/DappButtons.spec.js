import { shallowMount } from '@vue/test-utils';
import DappButtons from '@/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue';

import { Tooling } from '@@/helpers';

const RouterLinkStub = {
  name: 'router-link',
  template:
    '<div class="routerlink"><slot> </slot><p class="param">{{to}}</p></div>',
  props: ['to']
};

describe('DappButtons.vue', () => {
  let localVue, i18n, wrapper, store;

  const title = 'DappButtons title';
  const desc = 'DappButtons desc';
  const icon =
    'https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg';
  const iconDisabled =
    'https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg';
  const param = 'DappButtons param';
  const supportedNetworks = ['ETH'];
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(DappButtons, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: { title, desc, icon, param, iconDisabled, supportedNetworks },
      stubs: { 'router-link': RouterLinkStub }
    });
  });

  xit('[01/30/19] should render correct title', () => {
    expect(
      wrapper.vm.$el.querySelector('.dapps-button h4').textContent.trim()
    ).toEqual(title);
  });

  xit('[01/30/19] should render correct description', () => {
    expect(
      wrapper.vm.$el.querySelector('.dapps-button p').textContent.trim()
    ).toEqual(desc);
  });

  xit('[01/30/19] should render correct icon', () => {
    expect(
      wrapper.vm.$el.querySelector('.dapps-button img').src.trim()
    ).toEqual(icon);
  });

  xit('[01/30/19] should render correct param', () => {
    expect(wrapper.vm.$el.querySelector('.param').textContent.trim()).toEqual(
      param
    );
  });
  describe('DappButtons.vue Methods', () => {});
});
