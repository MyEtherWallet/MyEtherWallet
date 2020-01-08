import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import PhishingCatcherLayout from '@/layouts/PhishingCatcherLayout/PhishingCatcherLayout.vue';
import { Tooling } from '@@/helpers';

describe('PhishingCatcherLayout.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(PhishingCatcherLayout, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'router-link': RouterLinkStub
      },
      computed: {
        linkQuery() {
          return {
            url: 'https://www.some-phishing-site.net',
            'phishing-address': 'https://www.some-phishing-site.net'
          };
        }
      }
    });
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('Has url in linkQuery', () => {
    const url = 'https://www.some-phishing-site.net';
    const code = wrapper.find('code');
    const supposedValue = `<code>
          ${url}
        </code>`;
    expect(code.html()).toEqual(supposedValue);
  });

  it('dismounts', () => {
    wrapper.destroy();
    expect(wrapper.exists()).toBe(false);
  });
});
