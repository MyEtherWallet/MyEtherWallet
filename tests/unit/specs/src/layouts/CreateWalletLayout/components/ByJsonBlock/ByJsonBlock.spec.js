import { shallowMount } from '@vue/test-utils';
import ByJsonBlock from '@/layouts/CreateWalletLayout/components/ByJsonBlock/ByJsonBlock.vue';

import { Tooling } from '@@/helpers';

describe('ByJsonBlock.vue', () => {
  let localVue, i18n, wrapper, store;
  const img =
    'https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg';
  const title = 'ByJsonBlock title';
  const desc = 'ByJsonBlock desc';

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(ByJsonBlock, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: { img, title, desc }
    });
  });

  it('should render correct title', () => {
    expect(wrapper.vm.$el.querySelector('.icon-block img').src.trim()).toEqual(
      img
    );
  });

  it('should render correct description', () => {
    expect(
      wrapper.vm.$el.querySelector('.text-block p').textContent.trim()
    ).toEqual(desc);
  });

  it('should render correct image', () => {
    expect(wrapper.vm.$el.querySelector('.icon-block img').src.trim()).toEqual(
      img
    );
  });

  describe('ByJsonBlock.vue Methods', () => {});
});
