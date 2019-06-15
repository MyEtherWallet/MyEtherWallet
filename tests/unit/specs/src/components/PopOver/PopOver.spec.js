import Vue from 'vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import { shallowMount } from '@vue/test-utils';
import { Tooling } from '@@/helpers';
import { RouterLinkStub } from '@@/helpers/setupTooling';

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

describe('PopOver.vue', () => {
  let localVue, i18n, wrapper, store;
  const poptitle = 'poptitle';
  const popcontent = 'popcontent';
  const popovertype = 'popovertype';



  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(PopOver, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: { poptitle, popcontent, popovertype },
      stubs: {
        title: RouterLinkStub,
        'b-col': BColStub,
        'b-btn': BBtnStub
      }
    });
  });

  it('should render correct popcontent', () => {
    expect(
      wrapper.vm.$el.querySelector('p.popover-content').textContent
    ).toEqual(popcontent);
  });

  it('should render correct popoverID', () => {
    wrapper.setData({ popovertype: 'A' });
    expect(wrapper.vm.$el.querySelector('.b-btn').textContent).toEqual(
      wrapper.vm.$data.popOverId
    );
  });
});
