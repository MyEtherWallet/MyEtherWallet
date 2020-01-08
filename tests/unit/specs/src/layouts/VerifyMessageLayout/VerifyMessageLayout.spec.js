import { shallowMount } from '@vue/test-utils';
import VerifyMessageLayout from '@/layouts/VerifyMessageLayout/VerifyMessageLayout.vue';

import { Tooling } from '@@/helpers';

describe('VerifyMessageLayout.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(VerifyMessageLayout, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      mocks: {
        _t: () => {},
        $t: () => {}
      }
    });
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should dismount properly', () => {
    expect(wrapper.destroy()).toBe(undefined);
  });
});
