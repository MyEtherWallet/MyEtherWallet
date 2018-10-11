import Vue from 'vue';
import { shallowMount, createLocalVue } from '@vue/test-utils'
import ConfirmModal from '@/containers/ConfirmationContainer/components/ConfirmModal/ConfirmModal.vue';
import BootstrapVue from "bootstrap-vue";
const localVue = createLocalVue()
localVue.use(BootstrapVue);

describe('ConfirmModal.vue', () => {
  it('should render correct contents', () => {
      const signedTx = 'confirmSendTx'
      const fee = 0
      const data = 'data'
      const from = 'from'
      const to = 'to'
      const gas = 0
      const gasPrice = 0
      const nonce = 0
      const value = 0
      const isHardwareWallet = false

      const wrapper = shallowMount(ConfirmModal, {
        sync:false,
        attachToDocument:true,
        localVue,
        propsData: { signedTx, data, from , to, fee, gas, gasPrice, nonce, value, isHardwareWallet}
      });

      // TODO: Address related informattion was moved to AdressBlock [in ConfirmationContainer/components]
      // console.log('ConfirmSignModal from:%O', wrapper.vm.$el.querySelector('.tx-info').getElementsByTagName('address-block'));
      // expect(wrapper.vm.$el.querySelector('.tx-info').getElementsByTagName('address-block')[1].textContent.trim()).toEqual(from);

      // console.log('ConfirmModal to:%O', wrapper.vm.$el.querySelector('.tx-to .address-info').getElementsByTagName('p')[1].textContent.trim());
      // expect(wrapper.vm.$el.querySelector('.tx-to .address-info').getElementsByTagName('p')[1].textContent.trim()).toEqual(to);

      console.log('modalDetailInformation:%O', wrapper.vm.modalDetailInformation)
      console.log('transactionSigned:%O', wrapper.vm.transactionSigned)
      console.log('signedMessageSignature:%O', wrapper.vm.signedMessageSignature)

      expect(wrapper.vm.modalDetailInformation).toBe(false);
      expect(wrapper.vm.transactionSigned).toBe(false);
      expect(wrapper.vm.signedTransaction).toEqual("");
  });


  it('should confirm sendtx when click submit button', () => {
    const confirmSendTx = jest.fn(()=> console.log('return true'))
    const wrapper = shallowMount(ConfirmModal, {
      sync:false,
      attachToDocument:true,
      localVue,
      propsData: {
        signedTx:'0x111',
        confirmSendTx: confirmSendTx
      }
    });

    const submitButton = wrapper.find('div.submit-button');
    submitButton.trigger('click');

    expect( confirmSendTx ).toHaveBeenCalled()
  })

  it('should change modalDetailInformation data when checked', () => {
      const signedTx = 'confirmSendTx'
      const fee = 0
      const data = 'data'
      const from = 'from'
      const to = 'to'
      const gas = 0
      const gasPrice = 0
      const nonce = 0
      const value = 0
      const isHardwareWallet = false



      const wrapper = shallowMount(ConfirmModal, {
        sync:false,
        attachToDocument:true,
        localVue,
        propsData: { signedTx, data, from , to, fee, gas, gasPrice, nonce, value, isHardwareWallet}
      });

      const checkboxElement = wrapper.find('.switch input')
      checkboxElement.trigger('click')

      console.log('modalDetailInformation:%O' ,wrapper.vm.modalDetailInformation);
      expect(wrapper.vm.modalDetailInformation).toBe(true);

      // const detailElement = wrapper.vm.$el.querySelector('.detail-info .expended-info');

      // console.log(detailElement)

      // const gasLimitElement = detailElement.getElementsByTagName('.grid-block')[1].getElementsByTagName('p')[1];
      // const gasPriceElement = detailElement.getElementsByTagName('.grid-block')[2].getElementsByTagName('p')[1];
      // const transactionFeeElement = detailElement.getElementsByTagName('.grid-block')[3].getElementsByTagName('p')[1];
      // const nonceElement = detailElement.getElementsByTagName('.grid-block')[4].getElementsByTagName('p')[1];
      // const dataElement = detailElement.getElementsByTagName('.grid-block')[5].getElementsByTagName('p')[1];


      // console.log(gasLimitElement.textContent.trim())
      // console.log(gasPriceElement.textContent.trim())
      // console.log(transactionFeeElement.textContent.trim())
      // console.log(nonceElement.textContent.trim())
      // console.log(dataElement.textContent.trim())
  });

  describe('ConfirmModal.vue Methods', () => {});
});
