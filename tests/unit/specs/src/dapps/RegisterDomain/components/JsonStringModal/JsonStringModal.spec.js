import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import JsonStringModal from '@/dapps/RegisterDomain/components/JsonStringModal/JsonStringModal.vue';
import {
  Tooling
} from '@@/helpers';

const hideModal = jest.fn()
const updateJsonString =  jest.fn()
const BModalStub = {
  name:'b-modal',
  template:'<div><slot></slot></div>',
  props:['to'],
  methods: {
    hide: hideModal
  }
}

describe('JsonStringModal.vue', () => {
    let localVue, i18n, wrapper, store;

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
      wrapper = shallowMount(JsonStringModal, {
        localVue,
        i18n,
        store,
        attachToDocument: true,
        stubs: {
          'b-modal':BModalStub
        },
        propsData:{ updateJsonString }
      });
    });

    xit('[FAILING MAX STACK] should render correct domain name', () => {
      const jsonText = 'jsonText';
      wrapper.setData({ jsonText });
      expect(wrapper.vm.$el.querySelector('.input-container textarea').value).toEqual(jsonText);
    });

    describe('RegisterDomain.vue Methods', () => {
      xit('[FAILING MAX STACK] should reset jsonText when submit button clicked', () => {
        const jsonText = 'jsonText';
        wrapper.setData({ jsonText });
        wrapper.find('.submit-button').trigger('click');
        expect(wrapper.vm.$data.jsonText).toEqual('');
      });

      xit('[FAILING MAX STACK] should hide modal when submit button clicked', () => {
        wrapper.find('.submit-button').trigger('click');
        expect( hideModal ).toHaveBeenCalled();
      });

      xit('[FAILING MAX STACK] should trigger updateJsonString method when submit button clicked', () => {
        wrapper.find('.submit-button').trigger('click');
        expect( updateJsonString ).toHaveBeenCalled();
      });
    });
});
