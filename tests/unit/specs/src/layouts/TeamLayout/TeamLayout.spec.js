import { shallowMount } from '@vue/test-utils';
import TeamLayout from '@/layouts/TeamLayout/TeamLayout.vue';

import { Tooling } from '@@/helpers';

describe('TeamLayout.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(TeamLayout, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should render correct team members', () => {
    const memberElements = wrapper.vm.$el.getElementsByClassName('member');
    for (let i = 0; i < memberElements.length; i++) {
      const memberElement = memberElements[i];
      const member = wrapper.vm.$data.members[i];
      expect(member.name).toEqual(
        memberElement.querySelector('h4').textContent.trim()
      );
      expect(member.position).toEqual(
        memberElement.querySelector('h6').textContent.trim()
      );
    }
  });
});
