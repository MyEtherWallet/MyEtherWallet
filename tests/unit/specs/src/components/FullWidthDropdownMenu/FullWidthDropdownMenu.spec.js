import Vue from 'vue';
import FullWidthDropdownMenu from '@/components/FullWidthDropdownMenu/FullWidthDropdownMenu.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import StandardButton from '@/components/Buttons/StandardButton';
import { RouterLinkStub } from '@@/helpers/setupTooling';
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

describe('FullWidthDropdownMenu.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(FullWidthDropdownMenu, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'menu-title': MenuTitle,
        popover: PopOver,
        'b-col': BColStub,
        'b-btn': BBtnStub
      },
      mocks: {
        $eventHub: eventHub,
      }
    });
  });

  it('should render correct title props', () => {
      let title = 'title';
      wrapper.setProps({ title });
      expect(
        wrapper.vm.$el.querySelector('.the-title').textContent.trim()
      ).toEqual(title);
  });

  it('should render correct popup props', () => {
      let popup = 'popup'
      wrapper.setProps({ popup });
      expect(wrapper.vm.$el.querySelector('.popover-content').textContent.trim()).toEqual(popup);
  });

  it('should render correct dropdownOpen data', () => {
    expect(wrapper.find('.contents-container').classes().indexOf('opened')).toBe(-1);
    wrapper.setData({dropdownOpen:true});
    expect(wrapper.find('.contents-container').classes().indexOf('opened')).toBeGreaterThan(-1);
  });

  describe('FullWidthDropdownMenu.vue Methods', () => {
   it('should switch dropdownOpen data when button clicked', () => {
      wrapper.find('.title-container').trigger('click');
      expect(wrapper.vm.$data.dropdownOpen).toBe(true);
      wrapper.find('.title-container').trigger('click');
      expect(wrapper.vm.$data.dropdownOpen).toBe(false);
   })
  });

});
