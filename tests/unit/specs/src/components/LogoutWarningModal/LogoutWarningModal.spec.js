import LogoutWarningModal from '@/components/LogoutWarningModal/LogoutWarningModal.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import StandardButton from '@/components/Buttons/StandardButton';
import sinon from 'sinon';

const hideModal = sinon.stub();

const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to'],
  methods: {
    hide: hideModal
  }
};

describe('LogoutWarningModal.vue', () => {
  let localVue, i18n, wrapper, store;

  const mockRouter = {
    push: sinon.stub()
  };

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(LogoutWarningModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'standard-button': StandardButton,
        'b-modal': BModalStub
      },
      mocks: {
        $router: mockRouter
      }
    });
  });

  it('should render correct buttonNo data', () => {
    expect(wrapper.findAll('.standard-button').at(0).classes().indexOf('full-width')).toBeGreaterThan(-1);
    expect(wrapper.findAll('.the-button-box').at(0).classes().indexOf('no-min-width')).toBeGreaterThan(-1);    
    expect(wrapper.vm.$el.querySelectorAll('.the-button-box')[1].textContent.indexOf(wrapper.vm.$data.buttonNo.title)).toBeGreaterThan(-1);    
  });

  it('should render correct buttonYes data', () => {
    expect(wrapper.findAll('.standard-button').at(1).classes().indexOf('full-width')).toBeGreaterThan(-1);
    expect(wrapper.findAll('.the-button-box').at(1).classes().indexOf('no-min-width')).toBeGreaterThan(-1);
    expect(wrapper.vm.$el.querySelectorAll('.the-button-box')[3].textContent.indexOf(wrapper.vm.$data.buttonYes.title)).toBeGreaterThan(-1);    
  });

  describe('LogoutWarningModal.vue Methods', () => {
    it('should render correct logout method', () => {
      wrapper.vm.logout();
      expect(hideModal.called).toBe(true);      
    });

    it('should render correct cancel method', () => {
      wrapper.vm.cancel();
      expect(hideModal.called).toBe(true);
    });
  });
});
