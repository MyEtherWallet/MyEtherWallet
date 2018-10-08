import Vue from 'vue'
import VueX from 'vuex'
import { shallowMount , createLocalVue} from '@vue/test-utils'
import Notification from '@/components/Notification/Notification.vue'
import BootstrapVue from "bootstrap-vue"

const localVue = createLocalVue()
localVue.use(VueX)
localVue.use(BootstrapVue);

describe('Notification.vue', () => {
  
    let store
    let getters

    beforeEach(() => {
      console.log('beforeEach Notification Test')
      getters = {
        notifications: () => []
      }

      store = new VueX.Store({
        getters,
        state: {
          wallet: {
            getAddressString: jest.fn(x=> 0)
          }
        }
      })
    })

  it('should render correct contents', () => {
  
    const wrapper = shallowMount(Notification , { store, localVue });
    console.log('notification:%O', wrapper.find('.notification-logo'));
  
    var notificationLogo = wrapper.find('.notification-logo');

    console.log('notification:%O', notificationLogo);

    // notificationLogo.trigger('click');
  });

  describe('Notification.vue Methods', () => {});
});
