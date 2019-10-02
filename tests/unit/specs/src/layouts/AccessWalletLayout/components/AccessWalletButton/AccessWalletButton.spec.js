import { shallowMount } from '@vue/test-utils';
import AccessWalletButton from '@/layouts/AccessWalletLayout/components/AccessWalletButton/AccessWalletButton.vue';
import sinon from 'sinon';
import { Tooling } from '@@/helpers';

const BBtnStub = {
  name: 'b-btn',
  template: '<div class="b-btn">{{title}}</div>',
  props: ['title']
};

describe('AccessWalletButton.vue', () => {
  let localVue, i18n, wrapper, store;

  const img =
    'https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg';
  const title = 'AccessWalletButton title';
  const desc = 'AccessWalletButton desc';
  const recommend = 'AccessWalletButton recommend';
  const tooltip = 'AccessWalletButton tooltip';
  const func = sinon.stub();

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(AccessWalletButton, {
      localVue,
      i18n,
      store,
      stubs: {
        'b-btn': BBtnStub
      },
      attachToDocument: true,
      propsData: {
        img,
        title,
        desc,
        recommend,
        tooltip,
        func
      }
    });
  });

  it('should render correct recommend', () => {
    expect(
      wrapper.vm.$el.querySelector('.small-note').textContent.trim()
    ).toEqual(recommend);
  });

  it('should render correct description', () => {
    expect(wrapper.vm.$el.querySelector('p').textContent.trim()).toEqual(desc);
  });

  it('should render correct title', () => {
    expect(wrapper.vm.$el.querySelector('h3').textContent.trim()).toEqual(
      title
    );
  });

  it('should render correct disabled', () => {
    const btnBlock = wrapper.find('.button-block');
    expect(btnBlock.classes().indexOf('disabled')).toBeGreaterThan(-1);
  });

  describe('AccessWalletButton.vue Methods', () => {
    it('should call propsData "func" when click button', () => {
      const btnBlock = wrapper.find('.button-block');
      btnBlock.trigger('click');
      expect(func.called).toBe(true);
    });
  });
});
