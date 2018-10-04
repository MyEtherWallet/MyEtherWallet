import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import TeamLayout from '@/layouts/TeamLayout/TeamLayout.vue';

import {
  Tooling
} from '@@/helpers';


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
       // console.log(wrapper.vm.$el.querySelectorAll('.team-info div'))

       const memberElements = wrapper.vm.$el.getElementsByClassName('member')

       for(var i=0; i<memberElements.length; i++) {
        const memberElement = memberElements[i];
        console.log(memberElement.querySelector('img').getAttribute('src'))
        console.log(memberElement.querySelector('h4').textContent.trim())
        console.log(memberElement.querySelector('h6').textContent.trim())

        const member = wrapper.vm.$data.members[i]
        expect(member.name).toEqual(memberElement.querySelector('h4').textContent.trim())
        expect(member.position).toEqual(memberElement.querySelector('h6').textContent.trim())
        // expect(member.img).toEqual(memberElement.querySelector('img').getAttribute('src'))
       }
    });
});
