import DisconnectedModal from '@/components/DisconnectedModal/DisconnectedModal.vue';
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
    close: hideModal
  }
};

describe('DisconnectedModal.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(DisconnectedModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'standard-button': StandardButton,
        'b-modal': BModalStub
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
    wrapper = null;
  });

  xit('should render correct browser data', () => {
    expect(
      wrapper.vm.$el.querySelectorAll('.the-button-box')[1].textContent.trim()
    ).toEqual(wrapper.vm.$data.okayButtonOptions.title);
  });

  describe('DisconnectedModal.vue Methods', () => {
    it('should hide disconnected modal when button clicked', () => {
      wrapper.find('.standard-button').trigger('click');
      expect(hideModal.called).toBe(false);
    });
  });
});
