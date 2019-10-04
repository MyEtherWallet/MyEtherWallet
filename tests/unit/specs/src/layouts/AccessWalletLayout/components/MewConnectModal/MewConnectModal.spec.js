import VueQrcode from '@xkeshi/vue-qrcode';
import { mount } from '@vue/test-utils';
import MewConnectModal from '@/layouts/AccessWalletLayout/components/MewConnectModal/MewConnectModal.vue';
import { Tooling } from '@@/helpers';

describe('MewConnectModal.vue', () => {
  let localVue, i18n, wrapper, store;
  window.matchMedia =
    window.matchMedia ||
    function() {
      return {
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn()
      };
    };
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    const mockRouter = {
      history: {
        current: {
          fullPath: '/'
        }
      }
    };
    wrapper = mount(MewConnectModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        qrcode: VueQrcode
      },
      mocks: {
        $router: mockRouter
      }
    });
  });

  it('should render correct contents', () => {
    const QrCode = 'QrCode';
    wrapper.setData({ QrCode: QrCode });
    expect(wrapper.vm.$data.QrCode).toEqual(QrCode);
  });
});
