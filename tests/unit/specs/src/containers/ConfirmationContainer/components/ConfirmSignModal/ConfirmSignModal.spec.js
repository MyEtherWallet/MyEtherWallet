import Vue from 'vue';
import { shallowMount ,createLocalVue} from '@vue/test-utils'
import ConfirmSignModal from '@/containers/ConfirmationContainer/components/ConfirmSignModal/ConfirmSignModal.vue';
import BootstrapVue from "bootstrap-vue";

const localVue = createLocalVue()
localVue.use(BootstrapVue);

describe('ConfirmSignModal.vue', () => {
  it('should render correct contents', () => {
      const signedMessage = 'signedMessage'
      const messageToSign = 'messageToSign'
      const from = 'from'
      const isHardwareWallet = false

      const wrapper = shallowMount(ConfirmSignModal, {
        localVue,
        sync:false,
        attachToDocument:true, 
        propsData: { signedMessage, messageToSign, from , isHardwareWallet}
      });

      console.log('ConfirmSignModal from:%O', wrapper.vm.$el.querySelector('.tx-from .address-info').getElementsByTagName('p')[1].textContent.trim());
      expect(wrapper.vm.$el.querySelector('.tx-from .address-info').getElementsByTagName('p')[1].textContent.trim()).toEqual(from);

      console.log('ConfirmSignModal messageToSign:%O', wrapper.vm.$el.querySelector('.tx-to .address-info').getElementsByTagName('p')[1].textContent.trim());
      expect(wrapper.vm.$el.querySelector('.tx-to .address-info').getElementsByTagName('p')[1].textContent.trim()).toEqual(messageToSign);

      console.log('modalDetailInformation:%O', wrapper.vm.modalDetailInformation)
      console.log('transactionSigned:%O', wrapper.vm.transactionSigned)
      console.log('signedMessageSignature:%O', wrapper.vm.signedMessageSignature)

      expect(wrapper.vm.modalDetailInformation).toBe(false)
      expect(wrapper.vm.transactionSigned).toBe(false)
      expect(wrapper.vm.signedMessageSignature).toEqual(signedMessage)
  });


  it('should confirm SignMessage when click submit button', () => {
    const confirmSignMessage = jest.fn(()=> console.log('return true'))
    const wrapper = shallowMount(ConfirmSignModal, {
      localVue,
      sync:false,
      attachToDocument:true, 
      propsData: {
        signedMessage:'signedMessage',
        confirmSignMessage: confirmSignMessage
      }
    })

    const submitButton = wrapper.find('div.submit-button')
    submitButton.trigger('click')
    expect( confirmSignMessage ).toHaveBeenCalled()
  })
  describe('ConfirmSignModal.vue Methods', () => {});
});
