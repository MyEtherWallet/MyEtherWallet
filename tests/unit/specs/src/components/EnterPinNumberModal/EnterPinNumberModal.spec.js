import Vue from 'vue';
import EnterPinNumberModal from '@/components/EnterPinNumberModal/EnterPinNumberModal.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import StandardButton from '@/components/Buttons/StandardButton';
import { RouterLinkStub } from '@@/helpers/setupTooling';
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

const eventHub = {
  $on: sinon.stub()
};

describe('EnterPinNumberModal.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(EnterPinNumberModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'standard-button': StandardButton,
        'b-modal': BModalStub,
        'router-link': RouterLinkStub
      },
      mocks: {
        $eventHub: eventHub
      }
    });
  });

  it('should render correct acknowledgedTerms data', () => {
    expect(
      wrapper
        .find('.custom-marker')
        .classes()
        .indexOf('enable')
    ).toBe(-1);
    wrapper.setData({ acknowledgedTerms: true });
    expect(
      wrapper
        .find('.custom-marker')
        .classes()
        .indexOf('enable')
    ).toBeGreaterThan(-1);
  });

  it('should render correct position data', () => {
    const buttons = wrapper.findAll('.button-matrix-block button');

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons.at(i);
      button.trigger('click');
    }

    let strPosition = '';
    for (let i = 0; i < wrapper.vm.$data.positions.length; i++) {
      const position = wrapper.vm.$data.positions[i];
      strPosition = strPosition + position;
    }
    expect(wrapper.vm.$data.pin).toBe(strPosition);
  });

  it('should render correct pin data', () => {
    wrapper.setData({ pin: 'pin' });
    expect(
      wrapper.vm.$el.querySelector('.modal-contents .input-container input')
        .value
    ).toEqual(wrapper.vm.$data.pin);
  });

  it('should render correct deviceInfo data', () => {
    const deviceInfo = { name: 'deviceInfo' };
    wrapper.setData({ deviceInfo });
    expect(
      wrapper.vm.$el
        .querySelector('.pin-input-block .main-title')
        .textContent.trim()
        .indexOf(deviceInfo.name)
    ).toBeGreaterThan(-1);
  });

  describe('EnterPinNumberModal.vue Methods', () => {
    it('should render actualClick method', () => {
      const callback = sinon.stub();
      wrapper.setData({ callback });
      wrapper.vm.actualClick();
      expect(wrapper.vm.$data.pin).toBe('');
      expect(wrapper.vm.$data.acknowledgedTerms).toBe(false);
      expect(hideModal.called).toBe(true);
      expect(callback.called).toBe(true);
    });

    it('should render correct clear method', () => {
      wrapper.vm.clear();
      expect(wrapper.vm.$data.pin).toBe('');
      expect(wrapper.vm.$data.acknowledgedTerms).toBe(false);
    });
  });
});
