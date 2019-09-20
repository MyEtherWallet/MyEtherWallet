import { shallowMount } from '@vue/test-utils';
import TeamLayout from '@/layouts/TeamLayout/TeamLayout.vue';
import TitleTextContentsLayout from '@/layouts/InformationPages/Components/TitleTextContentsLayout';

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
      attachToDocument: true,
      stubs: {
        'title-text-contents': TitleTextContentsLayout
      }
    });
  });

  it('should render correct team members data', () => {
    const { members } = wrapper.vm.$data;
    const memberElements = wrapper.vm.$el.getElementsByClassName('member');
    for (let i = 0; i < memberElements.length; i++) {
      const memberElement = memberElements[i];
      const member = members[i];
      expect(member.name).toEqual(
        memberElement.querySelector('h4').textContent.trim()
      );
      expect(member.position).toEqual(
        memberElement.querySelector('h6').textContent.trim()
      );
    }
  });

  it('should render correct titleAndTextContents data', () => {
    const { titleAndTextContents } = wrapper.vm.$data;

    if (titleAndTextContents.title) {
      const spanTitle = wrapper.vm.$el.querySelector(
        '.title-text-contents .title span'
      );
      expect(titleAndTextContents.title).toEqual(spanTitle.textContent.trim());
    }

    if (titleAndTextContents.boldSubTitle) {
      const divSubTitle = wrapper.vm.$el.querySelector(
        '.title-text-contents .bold-sub-title'
      );
      expect(titleAndTextContents.boldSubTitle).toEqual(
        divSubTitle.textContent.trim()
      );
    }

    if (titleAndTextContents.textContent) {
      const txtContent = wrapper.vm.$el.querySelector(
        '.title-text-contents .text-content'
      );
      expect(titleAndTextContents.textContent.join()).toEqual(
        txtContent.textContent.trim()
      );
    }
  });
});
