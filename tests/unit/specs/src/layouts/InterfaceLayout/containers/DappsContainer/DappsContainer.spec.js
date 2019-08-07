import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import DappsContainer from '@/layouts/InterfaceLayout/containers/DappsContainer/DappsContainer.vue';
import DappButtons from '@/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue';
import languages from '@/translations';
import { Tooling } from '@@/helpers';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
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
  if (langObj) return langObj;
  return lang;
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
        'interface-container-title': InterfaceContainerTitle,
        'dapp-buttons': DappButtons,
        'router-link': RouterLinkStub
      }
    });
  });

  it('should render correct localDapps data', () => {
    for (let i = 0; i < wrapper.vm.sortedObject.length; i++) {
      const sortedObject = wrapper.vm.sortedObject[i];
      const dappsButtonTitle = wrapper.vm.$el.querySelectorAll(
        '.dapps-button h4'
      )[i];
      wrapper.vm.$el.querySelectorAll('.dapps-button .param')[i];
      expect(translate(sortedObject.title)).toEqual(
        dappsButtonTitle.textContent.trim()
      );
      // expect(translate(sortedObject.route)).toEqual(
      //   dappsButtonRoute.textContent.trim()
      // );
      // console.log(translate(sortedObject.desc));
      // console.log(wrapper.findAll('.dapps-button p').at(i).html());
    }
  });
});
