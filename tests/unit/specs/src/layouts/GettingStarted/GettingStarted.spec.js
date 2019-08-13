import { shallowMount } from '@vue/test-utils';
import GettingStarted from '@/layouts/GettingStarted/GettingStarted.vue';
import Congratulations from '@/layouts/GettingStarted/components/Congratulations/Congratulations.vue';
import SomeHelpfulTips from '@/layouts/GettingStarted/components/SomeHelpfulTips/SomeHelpfulTips.vue';
import WhatIfILoseMyKeysOrPassword from '@/layouts/GettingStarted/components/WhatIfILoseMyKeysOrPassword/WhatIfILoseMyKeysOrPassword.vue';
import WhatIsMyEtherWallet from '@/layouts/GettingStarted/components/WhatIsMyEtherWallet/WhatIsMyEtherWallet.vue';
import WhereAreMyFundsStored from '@/layouts/GettingStarted/components/WhereAreMyFundsStored/WhereAreMyFundsStored.vue';
import { Tooling } from '@@/helpers';
import { RouterLinkStub } from '@@/helpers/setupTooling';

describe('GettingStarted.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(GettingStarted, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'router-link': RouterLinkStub,
        'what-is-mew': WhatIsMyEtherWallet,
        'where-my-funds-stored': WhereAreMyFundsStored,
        'what-if-i-lose-key': WhatIfILoseMyKeysOrPassword,
        'some-helpful-tips': SomeHelpfulTips,
        congratulations: Congratulations
      }
    });
  });

  it('should render correct cwwCurrent data', () => {
    expect(
      wrapper
        .findAll('ul li')
        .at(0)
        .classes()
        .indexOf('active')
    ).toBeGreaterThan(-1);
    wrapper.setData({ cwwCurrent: 1 });
    expect(
      wrapper
        .findAll('ul li')
        .at(1)
        .classes()
        .indexOf('active')
    ).toBeGreaterThan(-1);
    wrapper.setData({ cwwCurrent: 2 });
    expect(
      wrapper
        .findAll('ul li')
        .at(2)
        .classes()
        .indexOf('active')
    ).toBeGreaterThan(-1);
    wrapper.setData({ cwwCurrent: 3 });
    expect(
      wrapper
        .findAll('ul li')
        .at(3)
        .classes()
        .indexOf('active')
    ).toBeGreaterThan(-1);
    wrapper.setData({ cwwCurrent: 4 });
    expect(
      wrapper
        .findAll('ul li')
        .at(4)
        .classes()
        .indexOf('active')
    ).toBeGreaterThan(-1);
  });

  it('should update cwwCurrent data when mouse wheel down', () => {
    // wrapper.trigger('wheel', { deltaY: 100 });
    wrapper.vm.mouseScrollDown();
    expect(wrapper.vm.$data.cwwCurrent).toBe(1);
  });

  it('should update cwwCurrent data when mouse wheel up', () => {
    // wrapper.setData({ cwwCurrent: 1 });
    // wrapper.trigger('wheel', { deltaY: -100 });
    wrapper.vm.mouseScrollUp();
    expect(wrapper.vm.$data.cwwCurrent).toBe(0);
  });

  describe('GettingStarted.vue Methods', () => {
    it('should render correct mouseScrollDown method', () => {
      wrapper.vm.mouseScrollDown();
      expect(wrapper.vm.$data.cwwCurrent).toBe(1);
    });

    it('should change class when mouse wheel', () => {
      wrapper.vm.mouseScrollDown();
      expect(
        wrapper
          .findAll('.cww')
          .at(0)
          .classes()
          .indexOf('positionTop')
      ).toBeGreaterThan(-1);
      wrapper.vm.mouseScrollUp();
      expect(
        wrapper
          .findAll('.cww')
          .at(1)
          .classes()
          .indexOf('positionBottom')
      ).toBeGreaterThan(-1);
    });

    it('should render correct mouseScrollUp method', () => {
      wrapper.setData({ cwwCurrent: 1 });
      wrapper.vm.mouseScrollUp();
      expect(wrapper.vm.$data.cwwCurrent).toBe(0);
    });
  });
});
