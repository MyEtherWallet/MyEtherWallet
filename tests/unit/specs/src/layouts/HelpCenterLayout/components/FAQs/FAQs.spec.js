import { shallowMount } from '@vue/test-utils';
import FAQs from '@/layouts/HelpCenterLayout/components/FAQs/FAQs.vue';
import { Tooling } from '@@/helpers';

describe('FAQs.vue', () => {
  describe('FAQs.vue Methods', () => {
    let localVue, i18n, wrapper, store;

    beforeAll(() => {
      const baseSetup = Tooling.createLocalVueInstance();
      localVue = baseSetup.localVue;
      i18n = baseSetup.i18n;
      store = baseSetup.store;
    });

    beforeEach(() => {
      wrapper = shallowMount(FAQs, {
        localVue,
        i18n,
        store,
        attachToDocument: true
      });
    });

    it('should render correct contents', () => {
      const linkWrappers = wrapper.findAll('.qa__contents--title');
      const { showFAQs } = wrapper.vm.$data;
      linkWrappers.at(0).trigger('click');
      expect(showFAQs.faq1).toBe(true);
      linkWrappers.at(1).trigger('click');
      expect(showFAQs.faq2).toBe(true);
      linkWrappers.at(2).trigger('click');
      expect(showFAQs.faq3).toBe(true);
      linkWrappers.at(3).trigger('click');
      expect(showFAQs.faq4).toBe(true);
      linkWrappers.at(4).trigger('click');
      expect(showFAQs.faq5).toBe(true);
      linkWrappers.at(5).trigger('click');
      expect(showFAQs.faq6).toBe(true);
      linkWrappers.at(0).trigger('click');
      expect(showFAQs.faq7).toBe(true);
      linkWrappers.at(7).trigger('click');
      expect(showFAQs.faq8).toBe(true);
      linkWrappers.at(8).trigger('click');
      expect(showFAQs.faq9).toBe(true);
      linkWrappers.at(9).trigger('click');
      expect(showFAQs.faq10).toBe(true);
      linkWrappers.at(10).trigger('click');
      expect(showFAQs.faq11).toBe(true);
      linkWrappers.at(11).trigger('click');
      expect(showFAQs.faq12).toBe(true);
      linkWrappers.at(12).trigger('click');
      expect(showFAQs.faq13).toBe(true);
    });
  });
});
