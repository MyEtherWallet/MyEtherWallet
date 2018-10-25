import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
// import RegisterDomainContainer from '@/layouts/InterfaceLayout/containers/RegisterDomainContainer/RegisterDomainContainer.vue';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton/BackButton.vue';
import {
  Tooling
} from '@@/helpers';


xdescribe('RegisterDomainContainer.vue', () => {
    let localVue, i18n, wrapper, store;
    const resetView = jest.fn()
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(RegisterDomainContainer, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          stubs: {
            'back-button':BackButton
          },
          propsData: {
            resetView:resetView,

          }
        });
    });

    it('should call propsData "resetView" when click button', () => {
      
    });

  describe('RegisterDomainContainer.vue Methods', () => {
  
  });
});



// import Vue from 'vue';
// import { shallowMount } from '@vue/test-utils'
// import RegisterDomain from '@/dapps/RegisterDomain/RegisterDomain.vue';
// import BackButton from '@/layouts/InterfaceLayout/components/BackButton/BackButton.vue';
// import {
//   Tooling
// } from '@@/helpers';


// describe('RegisterDomain.vue', () => {
//     let localVue, i18n, wrapper, store;
//     const resetView = jest.fn()
//     beforeAll(() => {
//         const baseSetup = Tooling.createLocalVueInstance();
//         localVue = baseSetup.localVue;
//         i18n = baseSetup.i18n;
//         store = baseSetup.store;
//     });

//     beforeEach(() => {
//         wrapper = shallowMount(RegisterDomain, {
//           localVue,
//           i18n,
//           store,
//           attachToDocument: true,
//           stubs: {
//             'back-button':BackButton
//           },
//           propsData: {
//             resetView:resetView,

//           }
//         });
//     });

//     it('should call propsData "resetView" when click button', () => {
//         wrapper.find('.back-container').trigger('click')
//         expect( resetView ).toHaveBeenCalled()
//     });

//   describe('RegisterDomain.vue Methods', () => {
//      let localVue, i18n, wrapper, store;
//       const resetView = jest.fn(()=> console.log('resetView function called'))
//       beforeAll(() => {
//           const baseSetup = Tooling.createLocalVueInstance();
//           localVue = baseSetup.localVue;
//           i18n = baseSetup.i18n;
//           store = baseSetup.store;
//       });

//       beforeEach(() => {
//           wrapper = shallowMount(RegisterDomain, {
//             localVue,
//             i18n,
//             store,
//             attachToDocument: true,
//             stubs: {
//               'back-button':BackButton
//             },
//             propsData: {
//               resetView:resetView,

//             }
//           });
//       });

//       it('should expand domainCheckForm when click button', () => {
//           wrapper.find('.switch input').trigger('click')
//           expect(wrapper.find('.sub-domain-list').classes().indexOf('hidden')).toBeGreaterThan(-1)
//           expect(wrapper.find('.domain-check-form').classes().indexOf('hidden')).toEqual(-1)
//       });

//       it('should check domain availability when click button', () => {
//           wrapper.find('div.check-button').trigger('click')
//           expect(wrapper.find('.sub-domain-list').classes().indexOf('hidden')).toBeGreaterThan(-1)
//           // expect(wrapper.find('.domain-check-form').classes().indexOf('hidden')).toEqual(-1)
//       });

//   });
// });
