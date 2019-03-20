import { shallowMount } from '@vue/test-utils';
import Timer from '@/dapps/ManageENS/components/Timer/Timer.vue';
import { Tooling } from '@@/helpers';
import { Misc } from '@/helpers';

describe('Timer.vue', () => {
  let localVue, i18n, wrapper, store;

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(Timer, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  it('should render correct dateType', () => {
    let dateType;
    dateType = 'reveal';
    wrapper.setProps({ dateType });
    expect(
      wrapper
        .findAll('.actual-timer span')
        .at(0)
        .isVisible()
    ).toBe(true);
    expect(
      wrapper
        .findAll('.actual-timer span')
        .at(1)
        .isVisible()
    ).toBe(false);
    dateType = 'auction';
    wrapper.setProps({ dateType });
    expect(
      wrapper
        .findAll('.actual-timer span')
        .at(0)
        .isVisible()
    ).toBe(false);
    expect(
      wrapper
        .findAll('.actual-timer span')
        .at(1)
        .isVisible()
    ).toBe(true);
  });

  it('should render correct dateNumber', () => {
    const dateType = 'reveal';
    wrapper.setProps({ dateType });
    const currentTime = Date.now();
    wrapper.setProps({ dateNumber: currentTime });

    const auctionCloses = new Date(currentTime);
    const revealDate = auctionCloses.setDate(auctionCloses.getDate() - 2);
    const strDate =
      dateType === 'reveal'
        ? Misc.formatDate(revealDate)
        : Misc.formatDate(currentTime);

    expect(
      wrapper.vm.$el.querySelector('.deadline').textContent.trim()
    ).toEqual(strDate);
  });
  describe('Timer.vue Methods', () => {});
});
