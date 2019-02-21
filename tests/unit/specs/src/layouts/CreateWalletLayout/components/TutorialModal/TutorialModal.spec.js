import { shallowMount } from '@vue/test-utils';
import TutorialModal from '@/layouts/CreateWalletLayout/components/TutorialModal/TutorialModal.vue';
import { Tooling } from '@@/helpers';
import { RouterLinkStub } from '@@/helpers/setupTooling';

describe('TutorialModal.vue', () => {
  let localVue, i18n, wrapper, store;
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(TutorialModal, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: { 'router-link': RouterLinkStub }
    });
  });

  it('should call skip function when trigger click skip', () => {
    const skip = jest.fn();
    wrapper.setProps({ skip: skip });
    const spanElement = wrapper.find('.content span');
    spanElement.trigger('click');
    expect(skip).toHaveBeenCalled();
  });
});
