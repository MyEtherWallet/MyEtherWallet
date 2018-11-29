import Vue from 'vue';
import { shallowMount ,createLocalVue} from '@vue/test-utils'
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal/SuccessModal.vue';
import sinon from 'sinon';
import {BBtn} from 'bootstrap-vue';
import {
  Tooling
} from '@@/helpers';

const hideModal = sinon.stub()
const BModalStub = {
  name:'b-modal',
  template:'<div><slot></slot></div>',
  props:['to'],
  methods: {
    hide: hideModal
  }
}

const BBtnStub = {
  name:'b-btn',
  template:'<div  class="b-btn"><slot></slot></div>'
}


describe('SuccessModal.vue', () => {
    let localVue, i18n, wrapper, store;
    const message = 'message'
    const linkMessage = 'linkMessage'
    const linkTo = '/linkTo';

    const spy = sinon.stub()
    const mockRoute = {
      push: spy
    };

    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(SuccessModal, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          propsData: { message, linkTo, linkMessage},
          stubs: {
            'b-modal':BModalStub,
            'b-btn':BBtnStub
          },
          mocks: {
            $router: mockRoute,
          }
        });
    });

  xit('[FAILING MAX STACK] should render correct message props', () => {
      expect(wrapper.vm.$el.querySelector('.d-block p').textContent.trim()).toEqual(message);
  });

  xit('[FAILING MAX STACK] should render correct linkMessage props', () => {
      expect(wrapper.vm.$el.querySelector('.button-container').textContent.trim()).toEqual(linkMessage);
  });

  describe('SuccessModal.vue Methods', () => {
    xit('[FAILING MAX STACK] should render correct hideModal method', () => {
      wrapper.vm.hideModal();
      expect(hideModal.called).toBe(true);
    });

    xit('[FAILING MAX STACK] should render correct router push method', () => {
        wrapper.vm.hideModal();
        expect(spy.calledWith({ path: linkTo })).toBe(true);
    });
  });
});
