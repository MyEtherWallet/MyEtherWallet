import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook';

const localVue = createLocalVue();
localVue.use(Vuex);

const NAME = 'attacker.eth';
const ATTACKER = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const CORRECTED = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
const ACCOUNT = '0x1111111111111111111111111111111111111111';

const ETH = {
  type: { chainID: 1, currencyName: 'ETH', ensEnkryptType: 'ETH' }
};
const POL = {
  type: { chainID: 137, currencyName: 'POL', ensEnkryptType: 'MATIC' }
};

/** A promise whose settlement the test controls, standing in for a stalled resolver. */
const deferred = () => {
  let release;
  let fail;
  const promise = new Promise((resolve, reject) => {
    release = resolve;
    fail = reject;
  });
  return { promise, release, fail };
};

const mountModule = (network = ETH) => {
  const store = new Vuex.Store({
    modules: {
      global: {
        namespaced: true,
        // Reactive state, not a closure variable, so switching networks
        // actually re-evaluates the getter and fires the watcher.
        state: { network },
        getters: { network: s => s.network },
        mutations: {
          setNetwork: (s, value) => {
            s.network = value;
          }
        }
      },
      wallet: {
        namespaced: true,
        state: {
          web3: {},
          address: ACCOUNT,
          isOfflineApp: false,
          // myAddressBook() calls instance.errorHandler when identifier is
          // falsy, so give it a real identifier and a callable handler.
          identifier: 'MEWCONNECT',
          instance: { errorHandler: () => {} }
        }
      },
      addressBook: {
        namespaced: true,
        state: { addressBookStore: [] }
      }
    }
  });

  const wrapper = shallowMount(ModuleAddressBook, {
    localVue,
    store,
    mocks: { $t: key => key, $route: { path: '/nft/send-your-nft' } },
    stubs: {
      'mew-address-select': true,
      'mew-overlay': true,
      'address-book-add-edit': true
    }
  });
  return { wrapper, store };
};

describe('ModuleAddressBook (mounted)', () => {
  it('installs per-instance debounced resolvers, not shared ones', () => {
    const a = mountModule().wrapper;
    const b = mountModule().wrapper;

    expect(typeof a.vm.resolveName).toBe('function');
    expect(typeof a.vm.resolveName.cancel).toBe('function');
    // The shared-throttle bug: both instances used to be the same function
    // object, so their timers and cached results collided.
    expect(a.vm.resolveName).not.toBe(b.vm.resolveName);
    expect(a.vm.resolveAddress).not.toBe(b.vm.resolveAddress);

    a.destroy();
    b.destroy();
  });

  it('applies a resolution that is still current', async () => {
    const { wrapper } = mountModule();
    wrapper.vm.nameResolver = { resolveName: () => Promise.resolve(ATTACKER) };
    wrapper.vm.inputAddr = NAME;
    await wrapper.vm.$nextTick();

    await wrapper.vm.resolveNameNow();

    expect(wrapper.vm.resolvedAddr).toBe(ATTACKER);
    expect(wrapper.emitted().setAddress.pop()).toEqual([
      ATTACKER,
      true,
      { type: 'RESOLVED', value: NAME }
    ]);
    wrapper.destroy();
  });

  it('drops a stale completion after the user corrects the recipient', async () => {
    const { wrapper } = mountModule();
    const stalled = deferred();
    wrapper.vm.nameResolver = { resolveName: () => stalled.promise };
    wrapper.vm.inputAddr = NAME;
    await wrapper.vm.$nextTick();

    const pending = wrapper.vm.resolveNameNow();

    // The user replaces the name with a literal address. The real watcher
    // runs and invalidates the outstanding lookup.
    wrapper.vm.inputAddr = CORRECTED;
    await wrapper.vm.$nextTick();
    const emittedBefore = (wrapper.emitted().setAddress || []).length;

    stalled.release(ATTACKER);
    await pending;

    expect(wrapper.vm.resolvedAddr).not.toBe(ATTACKER);
    expect((wrapper.emitted().setAddress || []).length).toBe(emittedBefore);
    wrapper.destroy();
  });

  it('keeps the newest result when completions arrive out of order', async () => {
    const { wrapper } = mountModule();
    const slow = deferred();
    const fast = deferred();
    let call = 0;
    wrapper.vm.nameResolver = {
      resolveName: () => (call++ === 0 ? slow.promise : fast.promise)
    };

    wrapper.vm.inputAddr = NAME;
    await wrapper.vm.$nextTick();
    const first = wrapper.vm.resolveNameNow();

    wrapper.vm.inputAddr = 'victim.eth';
    await wrapper.vm.$nextTick();
    const second = wrapper.vm.resolveNameNow();

    fast.release(CORRECTED);
    await second;
    slow.release(ATTACKER);
    await first;

    expect(wrapper.vm.resolvedAddr).toBe(CORRECTED);
    expect(wrapper.emitted().setAddress.pop()).toEqual([
      CORRECTED,
      true,
      { type: 'RESOLVED', value: 'victim.eth' }
    ]);
    wrapper.destroy();
  });

  it('drops a completion issued before a network change', async () => {
    const { wrapper, store } = mountModule();
    const stalled = deferred();
    wrapper.vm.nameResolver = { resolveName: () => stalled.promise };
    wrapper.vm.inputAddr = NAME;
    await wrapper.vm.$nextTick();

    const pending = wrapper.vm.resolveNameNow();

    store.commit('global/setNetwork', POL);
    await wrapper.vm.$nextTick();

    stalled.release(ATTACKER);
    await pending;

    expect(wrapper.vm.resolvedAddr).not.toBe(ATTACKER);
    wrapper.destroy();
  });

  it('drops a completion issued before an account change', async () => {
    const { wrapper, store } = mountModule();
    const stalled = deferred();
    wrapper.vm.nameResolver = { resolveName: () => stalled.promise };
    wrapper.vm.inputAddr = NAME;
    await wrapper.vm.$nextTick();

    const pending = wrapper.vm.resolveNameNow();

    store.state.wallet.address = '0x2222222222222222222222222222222222222222';
    await wrapper.vm.$nextTick();

    stalled.release(ATTACKER);
    await pending;

    expect(wrapper.vm.resolvedAddr).not.toBe(ATTACKER);
    wrapper.destroy();
  });

  it('does not report a stale failure over a current input', async () => {
    const { wrapper } = mountModule();
    const stalled = deferred();
    wrapper.vm.nameResolver = { resolveName: () => stalled.promise };
    wrapper.vm.inputAddr = NAME;
    await wrapper.vm.$nextTick();

    const pending = wrapper.vm.resolveNameNow();

    wrapper.vm.inputAddr = CORRECTED;
    await wrapper.vm.$nextTick();
    wrapper.vm.loadedAddressValidation = false;

    stalled.fail(new Error('Invalid Address!'));
    await pending;

    // A rejection for the abandoned name must not mark the current input
    // validated, which would have flagged it invalid in the UI.
    expect(wrapper.vm.loadedAddressValidation).toBe(false);
    wrapper.destroy();
  });

  it('cancels outstanding work when the component is destroyed', async () => {
    const { wrapper } = mountModule();
    const cancel = jest.spyOn(wrapper.vm.resolveName, 'cancel');
    wrapper.destroy();
    expect(cancel).toHaveBeenCalled();
  });
});
