import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import CreateWalletInputFooter from '@/layouts/CreateWalletLayout/components/CreateWalletInputFooter/CreateWalletInputFooter.vue';
import { Tooling } from '@@/helpers';

describe('CreateWalletInputFooter.vue', () => {
  let localVue, i18n, wrapper, store;
  const combo = 'combo';
  const desc = 'desc';
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(CreateWalletInputFooter, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        combo,
        desc
      }
    });
  });

  it('should render correct combo props', () => {
    expect(
      wrapper.vm.$el
        .querySelector('.footer-text p')
        .textContent.trim()
        .indexOf(combo)
    ).toBeGreaterThan(-1);
  });

  it('should render correct desc props', () => {
    expect(
      wrapper.vm.$el
        .querySelector('.footer-text p')
        .textContent.trim()
        .indexOf(desc)
    ).toBeGreaterThan(-1);
  });

  describe('CreateWalletInputFooter.vue Methods', () => {});
});
