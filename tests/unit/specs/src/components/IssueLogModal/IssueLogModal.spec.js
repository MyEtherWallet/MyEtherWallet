import Vue from 'vue';
import IssueLogModal from '@/components/IssueLogModal/IssueLogModal.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import StandardButton from '@/components/Buttons/StandardButton';
import sinon from 'sinon';
import MenuTitle from '@/components/MenuTitle';
import PopOver from '@/components/PopOver';
import { actions } from '@@/helpers/mockStore';
import VueX from 'vuex';

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
    store = store = new VueX.Store({
      modules: {
        main: {
          namespaced: true,
          actions
        }
      }
    });
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

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correct showSkipper data', async () => {
    wrapper.setData({ showSkipper: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.button-block').exists()).toBe(true);
    expect(wrapper.find('.custom-marker').classes()).not.toContain('enable');
    wrapper.setData({ neverShow: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.custom-marker').classes()).toContain('enable');
  });

  describe('IssueLogModal.vue Methods', () => {
    it('should switch neverShow data when button clicked', async () => {
      wrapper.setData({ showSkipper: true });
      await wrapper.vm.$nextTick();
      wrapper.find('.checkbox-container label').trigger('click');
      expect(wrapper.vm.$data.neverShow).toBe(true);
      wrapper.find('.checkbox-container label').trigger('click');
      expect(wrapper.vm.$data.neverShow).toBe(false);
    });
  });

  it('should dismount properly', () => {
    expect(wrapper.destroy()).toBe(undefined);
  });
});
