import Vue from 'vue';
import { shallowMount } from '@vue/test-utils'
import Social from '@/layouts/HomeLayout/components/Social/Social.vue';
const $t = ()=>{}
describe('Social.vue', () => {
  it('should render correct contents', () => {
      const wrapper = shallowMount(Social, {
      	      mocks:{$t}
      });
    
      const linkElements = wrapper.vm.$el.querySelector('.icons').getElementsByTagName('a');	
      const imgElements = wrapper.vm.$el.getElementsByTagName('img');
      for(var i=0; i<imgElements.length; i++) {
      	console.log(imgElements[i].src)
      	console.log(imgElements[i].parentElement.className)
      }
      
      for(var i =0 ; i < wrapper.vm.$data.links.length; i++) {
      	var data = wrapper.vm.$data.links[i];

      	var link = data.to 
        var linkElement = linkElements[i].href
        if(linkElements[i].href.lastIndexOf("/") === linkElements[i].href.length - 1) {
          linkElement = linkElements[i].href.substring(0, linkElements[i].href.length - 1)
        }
        console.log('link:%O', linkElement)
        expect( link ).toEqual(linkElement)
      	expect(data.name).toEqual(imgElements[i].parentElement.className)
      }
  });

  describe('Social.vue Methods', () => {});
});
