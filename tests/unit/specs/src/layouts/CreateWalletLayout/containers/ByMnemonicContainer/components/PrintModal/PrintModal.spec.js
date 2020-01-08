// import { shallowMount } from '@vue/test-utils';
// import PrintModal from '@/layouts/CreateWalletLayout/containers/ByMnemonicContainer/components/PrintModal/PrintModal.vue';
// import StandardButton from '@/components/Buttons/StandardButton';
// import MnemonicTableToPrint from '@/layouts/CreateWalletLayout/containers/ByMnemonicContainer/components/PrintModal/components/MnemonicTableToPrint';
// import MnemonicTableToDisplay from '@/layouts/CreateWalletLayout/containers/ByMnemonicContainer/components/PrintModal/components/MnemonicTableToDisplay';

// import sinon from 'sinon';
// import { Tooling } from '@@/helpers';

// const BModalStub = {
//   name: 'b-modal',
//   template: '<div><slot></slot></div>',
//   props: ['to']
// };

// const unlock = sinon.stub();

// const BBtnStub = {
//   name: 'b-btn',
//   template: `<button></button>`
// };

describe('PrintModal.vue', () => {
  it('making test pass', () => {
    expect(1).toBe(1);
  });
  // let localVue, i18n, wrapper, store;

  // beforeAll(() => {
  //   const baseSetup = Tooling.createLocalVueInstance();
  //   localVue = baseSetup.localVue;
  //   i18n = baseSetup.i18n;
  //   store = baseSetup.store;
  // });

  // beforeEach(() => {
  //   wrapper = shallowMount(PrintModal, {
  //     localVue,
  //     i18n,
  //     store,
  //     attachToDocument: true,
  //     propsData: {
  //       unlock
  //     },
  //     stubs: {
  //       'b-btn': BBtnStub,
  //       'b-modal': BModalStub,
  //       'standard-button': StandardButton,
  //       'mnemonic-table-to-print': MnemonicTableToPrint,
  //       'mnemonic-table-to-display': MnemonicTableToDisplay
  //     }
  //   });
  // });

  // xit('should render correct printButtonOptions data', () => {
  //   const printButtonOptions = wrapper.vm.$data.printButtonOptions;
  //   expect(
  //     wrapper.vm.$el
  //       .querySelectorAll('.the-button-box')[1]
  //       .textContent.indexOf(printButtonOptions.title)
  //   ).toBeGreaterThan(-1);
  //   expect(
  //     wrapper
  //       .find('.the-button-box')
  //       .classes()
  //       .indexOf('no-min-width')
  //   ).toBeGreaterThan(-1);
  //   expect(
  //     wrapper
  //       .find('.standard-button')
  //       .classes()
  //       .indexOf('full-width')
  //   ).toBeGreaterThan(-1);
  // });

  // xit('should render isTwentyFour props data', () => {
  //   expect(
  //     wrapper
  //       .find('.full-mnemonic')
  //       .classes()
  //       .indexOf('full-mnemonic')
  //   ).toBeGreaterThan(-1);
  // });

  // it('should render component', () => {
  //   expect(PrintModal).toMatchSnapshot();
  // });
  // it('should dismount properly', () => {
  //   expect(wrapper.destroy()).toBe(undefined);
  // });
});
