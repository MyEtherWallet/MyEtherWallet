import { mount } from '@vue/test-utils';
import NotFoundLayout from '@/layouts/NotFoundLayout/NotFoundLayout.vue';
import { Tooling } from '@@/helpers';

describe('NotFoundLayout.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = mount(NotFoundLayout, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      mocks: {
        _t: () => {},
        $t: () => {}
      }
    });
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
