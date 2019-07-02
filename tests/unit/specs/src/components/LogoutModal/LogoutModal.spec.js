import LogoutModal from '@/components/LogoutModal/LogoutModal.vue';
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

describe('LogoutModal.vue', () => {
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
    wrapper = shallowMount(LogoutModal, {
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

  describe('LogoutModal.vue Methods', () => {
    it('should cancel when button is clicked', () => {
      wrapper.find('.buttons .no').trigger('click');
      expect(hideModal.called).toBe(true);
    });

    it('should logout when button is clicked', () => {
      wrapper.find('.buttons .yes').trigger('click');
      expect(mockRouter.push.calledWith('/')).toBe(true);
      expect(hideModal.called).toBe(true);
    });
  });
});
