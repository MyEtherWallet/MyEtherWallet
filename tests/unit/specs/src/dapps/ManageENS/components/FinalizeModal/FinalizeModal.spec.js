import { shallowMount } from '@vue/test-utils';
import FinalizeModal from '@/dapps/ManageENS/components/FinalizeModal/FinalizeModal.vue';
import { Tooling } from '@@/helpers';
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

//xdescribe
describe('FinalizeModal.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(FinalizeModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'b-modal': BModalStub
      }
    });
  });

  it('should render correct domain name', () => {
    const domainName = 'domainName';
    wrapper.setProps({ domainName });
    expect(
      wrapper.vm.$el
        .querySelector('.finalize-modal-container h3')
        .textContent.trim()
        .indexOf(domainName)
    ).toBeGreaterThan(-1);
  });

  it('should render correct confirm button', () => {
    const finalize = sinon.stub();
    wrapper.setProps({ finalize });
    wrapper
      .findAll('.button-container button')
      .at(1)
      .trigger('click');
    expect(finalize.called).toBe(true);
  });

  describe('FinalizeModal.vue Methods', () => {
    it('should render correct close method', () => {
      wrapper.vm.close();
      expect(hideModal.called).toBe(true);
    });

    it('should hide modal when close button clicked', () => {
      const finalize = sinon.stub();
      wrapper.setProps({ finalize });
      wrapper
        .findAll('.button-container button')
        .at(0)
        .trigger('click');
      expect(hideModal.called).toBe(true);
    });
  });
});
