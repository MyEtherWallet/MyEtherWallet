import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import DappsContainer from '@/layouts/InterfaceLayout/containers/DappsContainer/DappsContainer.vue';
import DappButtons from '@/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue';
import languages from '@/translations';
import { Tooling } from '@@/helpers';

const RouterLinkStub = {
  name: 'router-link',
  template:
    '<div class="routerlink"><slot> </slot><p class="param">{{to}}</p></div>',
  props: ['to']
};

function translate(lang) {
  const arrLang = lang.split('.');
  let langObj = languages.en_US;
  for (let i = 0; i < arrLang.length; i++) {
    langObj = langObj[arrLang[i]];
  }
  return langObj;
}

describe('DappsContainer.vue', () => {
  let localVue, i18n, wrapper, store;
  const address = 'DappsContainer address';
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;

    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(DappsContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        address: address
      },
      stubs: {
        'dapp-buttons': DappButtons,
        'router-link': RouterLinkStub
      }
    });
  });

  it('should render correct registerDomain title', () => {
    const dappsButtons = wrapper.vm.$el.querySelectorAll('.dapps-button');
    expect(dappsButtons[0].querySelector('h4').textContent.trim()).toEqual(
      translate(wrapper.vm.$data.localDapps.registerDomain.title)
    );
  });

  it('should render correct registerDomain description', () => {
    const dappsButtons = wrapper.vm.$el.querySelectorAll('.dapps-button');
    expect(dappsButtons[0].querySelector('p').textContent.trim()).toEqual(
      translate(wrapper.vm.$data.localDapps.registerDomain.desc)
    );
  });

  it('should render correct domainSale title', () => {
    const dappsButtons = wrapper.vm.$el.querySelectorAll('.dapps-button');
    expect(dappsButtons[1].querySelector('h4').textContent.trim()).toEqual(
      translate(wrapper.vm.$data.localDapps.domainSale.title)
    );
  });

  it('should render correct domainSale description', () => {
    const dappsButtons = wrapper.vm.$el.querySelectorAll('.dapps-button');
    expect(dappsButtons[1].querySelector('p').textContent.trim()).toEqual(
      translate(wrapper.vm.$data.localDapps.domainSale.desc)
    );
  });

  it('should render correct registerDomain route', () => {
    expect(
      wrapper.vm.$el.querySelectorAll('.param')[0].textContent.trim()
    ).toEqual(wrapper.vm.$data.localDapps.registerDomain.route);
  });

  it('should render correct domainSale route', () => {
    expect(
      wrapper.vm.$el.querySelectorAll('.param')[1].textContent.trim()
    ).toEqual(wrapper.vm.$data.localDapps.domainSale.route);
  });
});
