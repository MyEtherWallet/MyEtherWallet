import Vue from 'vue';
import { shallowMount , mount} from '@vue/test-utils'
import FAQs from '@/layouts/HelpCenterLayout/components/FAQs/FAQs.vue';
import {
  Tooling
} from '@@/helpers';


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
           const linkWrappers = wrapper.findAll('.qa__contents--title')
            var linkWrapper = linkWrappers.at(0);
            linkWrapper.trigger('click')
            expect(wrapper.vm.$data.showFAQs.faq1).toBe(true)

            linkWrapper = linkWrappers.at(1);
            linkWrapper.trigger('click')
            expect(wrapper.vm.$data.showFAQs.faq2).toBe(true)

            linkWrapper = linkWrappers.at(2);
            linkWrapper.trigger('click')
            expect(wrapper.vm.$data.showFAQs.faq3).toBe(true)

            linkWrapper = linkWrappers.at(3);
            linkWrapper.trigger('click')
            expect(wrapper.vm.$data.showFAQs.faq4).toBe(true)

            linkWrapper = linkWrappers.at(4);
            linkWrapper.trigger('click')
            expect(wrapper.vm.$data.showFAQs.faq5).toBe(true)

            linkWrapper = linkWrappers.at(5);
            linkWrapper.trigger('click')
            expect(wrapper.vm.$data.showFAQs.faq5).toBe(true)


            linkWrapper = linkWrappers.at(6);
            linkWrapper.trigger('click')
            expect(wrapper.vm.$data.showFAQs.faq6).toBe(true)


            linkWrapper = linkWrappers.at(7);
            linkWrapper.trigger('click')
            expect(wrapper.vm.$data.showFAQs.faq8).toBe(true)


            linkWrapper = linkWrappers.at(8);
            linkWrapper.trigger('click')
            expect(wrapper.vm.$data.showFAQs.faq9).toBe(true)


            linkWrapper = linkWrappers.at(9);
            linkWrapper.trigger('click')
            expect(wrapper.vm.$data.showFAQs.faq10).toBe(true)


            linkWrapper = linkWrappers.at(10);
            linkWrapper.trigger('click')
            expect(wrapper.vm.$data.showFAQs.faq11).toBe(true)


            linkWrapper = linkWrappers.at(11);
            linkWrapper.trigger('click')
            expect(wrapper.vm.$data.showFAQs.faq12).toBe(true)

            linkWrapper = linkWrappers.at(12);
            linkWrapper.trigger('click')
            expect(wrapper.vm.$data.showFAQs.faq13).toBe(true)
        });
    });
});
