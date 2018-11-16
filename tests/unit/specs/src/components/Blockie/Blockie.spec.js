import Vue from 'vue';
import Blockie from '@/components/Blockie';
import { mount, shallowMount } from '@vue/test-utils';

import { Tooling } from '@@/helpers';

describe('Blockie.vue', () => {
  let localVue, i18n, wrapper, store;
  const address = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(Blockie, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: {
        address: address
      }
    });
  });

  it('should render correct contents', () => {});
});

describe('Blockie.vue', () => {
  it('should render correct contents', () => {
    const wrapper = mount(Blockie, {
      propsData: {
        address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
      }
    });
    expect(wrapper.element.style['background-image']).toEqual(
      'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABmJLR0QA/wD/AP+gvaeTAAABzElEQVR4nO3doU0EURRA0R0CColGEzxq/QoKwFEDgkIwtICjAASeMjAYDBLNFvHED7nn+JdMZm+emb8z283+7G838PvzNBnfHd7uRvPvt6+j+anV139+8TiaPxlN8+8JIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBC3Tc8D7F++RhfwcX85mp+eR5iaPo9fff9sgDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOJOp8+jWWv6+9kAcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxG3XV8+j9wNM35fPzPR7AzZAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcePzAFP18wTT5/lTNkCcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBx28Pn99LzAKxlA8QJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBC3/HsBq/8fv9rq+2cDxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQdwRncC48IWUlugAAAABJRU5ErkJggg==)'
    );
  });
});
