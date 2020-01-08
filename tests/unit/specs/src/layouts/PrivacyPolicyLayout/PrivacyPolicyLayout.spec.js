import { shallowMount } from '@vue/test-utils';
import PrivacyPolicyLayout from '@/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue';

import { Tooling } from '@@/helpers';

describe('PrivacyPolicyLayout.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(PrivacyPolicyLayout, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should dismount properly', () => {
    expect(wrapper.destroy()).toBe(undefined);
  });
});
