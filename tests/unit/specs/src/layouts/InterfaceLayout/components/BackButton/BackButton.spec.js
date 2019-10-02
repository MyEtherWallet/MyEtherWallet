import { shallowMount } from '@vue/test-utils';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton/BackButton.vue';
import sinon from 'sinon';
import { Tooling } from '@@/helpers';

describe('BackButton.vue', () => {
  let localVue, i18n, wrapper, store;
  const spy = sinon.stub();
  const mockRouter = {
    push: spy,
    go: spy,
    history: {
      current: {
        path: '/interface/dapps/register-domain'
      }
    }
  };

  const mockRoute = {
    path: '/interface/dapps/register-domain'
  };
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(BackButton, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      mocks: {
        $router: mockRouter,
        $route: mockRoute
      }
    });
  });

  it('should render correct content', () => {});

  describe('BackButton.vue Methods', () => {
    it('should go back when button clicked', () => {
      const path = mockRoute.path.split('/');
      const goToPath = path.slice(0, path.length - 1).join('/');
      wrapper.find('.content-title').trigger('click');
      expect(spy.calledWith(goToPath)).toBe(true);
    });
  });
});
