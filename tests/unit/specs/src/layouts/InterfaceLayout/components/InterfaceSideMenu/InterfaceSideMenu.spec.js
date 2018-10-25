import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import InterfaceSideMenu from '@/layouts/InterfaceLayout/components/InterfaceSideMenu/InterfaceSideMenu.vue';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton/BackButton.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import {
  Tooling
} from '@@/helpers';
import sinon from 'sinon'

const switchTabs = jest.fn()

xdescribe('InterfaceSideMenu.vue', () => {
    let localVue, i18n, wrapper, store;
    const resetView = jest.fn()
    beforeAll(() => {
        const baseSetup = Tooling.createLocalVueInstance();
        localVue = baseSetup.localVue;
        i18n = baseSetup.i18n;
        store = baseSetup.store;
    });

    beforeEach(() => {
        wrapper = shallowMount(InterfaceSideMenu, {
          localVue,
          i18n,
          store,
          attachToDocument: true,
          stubs: {
            'back-button':BackButton,
            'popover':PopOver
          },
          propsData: {
            resetView:resetView,
            switchTabs:switchTabs
          }
        });
    });

    it('should render correct showSend', () => {
      wrapper.setData({showSend:true});
      expect(wrapper.vm.$el.querySelectorAll('.menu-group-title i')[0].className.indexOf('fa-angle-up')).toBeGreaterThan(-1)
    });

    it('should render correct showContract', () => {
      wrapper.setData({showContract:true});
      expect(wrapper.vm.$el.querySelectorAll('.menu-group-title i')[3].className.indexOf('fa-angle-up')).toBeGreaterThan(-1)
    });

    it('should render correct showMessage', () => {
      wrapper.setData({showMessage:true});
      expect(wrapper.vm.$el.querySelectorAll('.menu-group-title i')[4].className.indexOf('fa-angle-up')).toBeGreaterThan(-1)
    });

    it('should render correct tabData', () => {
        const menuElement = wrapper.vm.$el.querySelectorAll('ul')[0];
        const groupElements = menuElement.querySelectorAll('.menu-group-title');
        wrapper.setData({showSend:true, showContract:true, showMessage:true})
        for(var i=0; i<groupElements.length; i++) {
          expect(groupElements[i].querySelector('p').textContent).toEqual(wrapper.vm.$data.tabData[i].title)
          if(wrapper.vm.$data.tabData[i].caret) {
            for(var j=0; j<menuElement.querySelectorAll('li').length; j++) {
              const liText = menuElement.querySelectorAll('li')[j].textContent.trim();
              

              if(wrapper.vm.$data.tabData[i].contents[j]!==undefined) {
                const itemTitle = menuElement.querySelectorAll('li')[j].textContent.trim();
                expect(liText.indexOf(itemTitle)).toBeGreaterThan(-1)
              }
            }
          }
        }
    });


    describe('InterfaceSideMenu.vue Methods', () => {
      it('should toggle showSend when click button', () => {
        wrapper.findAll('.menu-group-title').at(0).trigger('click');
        expect(wrapper.vm.$data.showSend).toBe(true);
        expect(wrapper.vm.$data.showContract).toBe(false);
        expect(wrapper.vm.$data.showMessage).toBe(false);
      })

      it('should toggle showContract when click button', () => {
        wrapper.findAll('.menu-group-title').at(3).trigger('click');
        expect(wrapper.vm.$data.showSend).toBe(false);
        expect(wrapper.vm.$data.showContract).toBe(true);
        expect(wrapper.vm.$data.showMessage).toBe(false);
      });

      it('should toggle showMessage when click button', () => {
        wrapper.findAll('.menu-group-title').at(4).trigger('click');
        expect(wrapper.vm.$data.showSend).toBe(false);
        expect(wrapper.vm.$data.showContract).toBe(false);
        expect(wrapper.vm.$data.showMessage).toBe(true);
      });

       it('should switch tab when button click', () => {
          const itemClickElements = wrapper.findAll('ul').at(0).findAll('ul li');
          for(var i=0; i<itemClickElements.length; i++) {
            itemClickElements.at(i).trigger('click')

          }
          expect( switchTabs ).toHaveBeenCalled()
      });

    });
});
