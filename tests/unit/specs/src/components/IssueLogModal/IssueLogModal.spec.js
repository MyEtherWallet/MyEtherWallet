import Vue from 'vue';
import IssueLogModal from '@/components/IssueLogModal/IssueLogModal.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import StandardButton from '@/components/Buttons/StandardButton';
import sinon from 'sinon';
import MenuTitle from '@/components/MenuTitle';
import PopOver from '@/components/PopOver';

const hideModal = sinon.stub();

const BModalStub = {
  name: 'b-modal',
  template: '<div><slot></slot></div>',
  props: ['to'],
  methods: {
    hide: hideModal
  }
};

const BBtnStub = {
  name: 'b-btn',
  template: '<div class="b-btn">{{id}}</div>',
  props: ['id']
};

const BColStub = {
  name: 'b-col',
  template: '<div class="b-col"><slot></slot></div>',
  props: ['id']
};

const eventHub = {
  $on: sinon.stub()
};

describe('IssuesLogModal.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(IssueLogModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'menu-title': MenuTitle,
        popover: PopOver,
        'b-col': BColStub,
        'b-btn': BBtnStub,
        'b-modal': BModalStub,
        'standard-button': StandardButton
      },
      mocks: {
        $eventHub: eventHub
      }
    });
  });

  it('should render correct title props', () => {
    expect(wrapper.vm.$data.cancelButtonOptions.title).toEqual(
      wrapper.vm.$el
        .querySelectorAll('.standard-button')[0]
        .querySelectorAll('.the-button-box')[1]
        .textContent.trim()
    );
    expect(wrapper.vm.$data.sendButtonOptions.title).toEqual(
      wrapper.vm.$el
        .querySelectorAll('.standard-button')[1]
        .querySelectorAll('.the-button-box')[1]
        .textContent.trim()
    );
  });

  it('should render correct showSkipper data', () => {
    wrapper.setData({ showSkipper: true });
    expect(wrapper.find('.button-block').exists()).toBe(true);
  });

  it('should render correct showSkipper data', () => {
    wrapper.setData({ showSkipper: true });
    expect(
      wrapper
        .find('.custom-marker')
        .classes()
        .indexOf('enable')
    ).toBe(-1);
    wrapper.setData({ neverShow: true });
    expect(
      wrapper
        .find('.custom-marker')
        .classes()
        .indexOf('enable')
    ).toBeGreaterThan(-1);
  });

  describe('IssueLogModal.vue Methods', () => {
    it('should switch neverShow data when button clicked', () => {
      wrapper.setData({ showSkipper: true });
      wrapper.find('.checkbox-container label').trigger('click');
      expect(wrapper.vm.$data.neverShow).toBe(true);
      wrapper.find('.checkbox-container label').trigger('click');
      expect(wrapper.vm.$data.neverShow).toBe(false);
    });
  });
});
