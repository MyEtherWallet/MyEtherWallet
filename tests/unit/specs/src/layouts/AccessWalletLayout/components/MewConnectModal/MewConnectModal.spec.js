import VueQrcode from '@xkeshi/vue-qrcode';
import { shallowMount } from '@vue/test-utils';
import MewConnectModal from '@/layouts/AccessWalletLayout/components/MewConnectModal/MewConnectModal.vue';
import { Tooling } from '@@/helpers';

describe('MewConnectModal.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(MewConnectModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        qrcode: VueQrcode
      }
    });
  });

  it('should render correct contents', () => {
    const QrCode = 'QrCode';
    wrapper.setData({ QrCode: QrCode });
    expect(wrapper.vm.$data.QrCode).toEqual(QrCode);
  });

  describe('MewConnectModal.vue Methods', () => {});
});
