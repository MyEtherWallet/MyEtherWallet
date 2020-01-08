import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import TopBanner from '@/layouts/HomeLayout/components/TopBanner/TopBanner.vue';
import { Tooling } from '@@/helpers';

describe('TopBanner.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(TopBanner, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        RouterLink: RouterLinkStub
      }
    });
  });

  it('should render correct contents', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('Renders correct router link for create-wallet', () => {
    const routerTo = wrapper.findAll(RouterLinkStub);
    const createWalletRouter = routerTo.at(0);
    expect(createWalletRouter.props().to).toBe('/create-wallet');
  });

  it('Renders correct router link for access-wallet', () => {
    const routerTo = wrapper.findAll(RouterLinkStub);
    const createWalletRouter = routerTo.at(1);
    expect(createWalletRouter.props().to).toBe('/access-my-wallet');
  });

  it('Should dismount component', () => {
    wrapper.destroy();
    expect(wrapper.exists()).toBe(false);
  });
});
