import { shallowMount } from '@vue/test-utils';
import NameForbiddenENSContainer from '@/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue';
import { Tooling } from '@@/helpers';

describe('NameForbiddenENSContainer.vue', () => {
  let localVue, i18n, wrapper, store;

  const domainName = 'domainName';

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(NameForbiddenENSContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: { domainName }
    });
  });

  it('should render correct domain name', () => {
    expect(
      wrapper.vm.$el
        .querySelector('.name-forbidden-container h3')
        .textContent.trim()
    ).toEqual(`${domainName}.eth is not available yet!`);
  });
});
