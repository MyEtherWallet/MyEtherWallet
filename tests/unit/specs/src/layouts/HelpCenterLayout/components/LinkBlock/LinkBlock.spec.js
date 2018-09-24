import Vue from 'vue';
import { shallowMount , mount} from '@vue/test-utils'
// import LinkBlock from '@/layouts/HelpCenterLayout/components/LinkBlock/LinkBlock.vue';

describe('LinkBlock.vue', () => {
  it('should render correct contents', () => {
    const content = {
      icon:'https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg',
      title:'linkblock  title',
      description:'linkblock description',
      email:'stuntblitz@gmail.com',
      social:[
        { key:'twitter', link:'http://www.twitter.com', icon:'https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg'},
        { key:'facebook', link:'http://www.facebook.com', icon:'https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg'},
        { key:'instagram', link:'http://www.instagram.com', icon:'https://media.kasperskydaily.com/wp-content/uploads/sites/92/2016/09/06021623/bitcoin-easy-explanation-featured.jpg'}
      ]
    }
    // const wrapper = mount(LinkBlock, {
    //   propsData:content
    // });
    

     // const Constructor = Vue.extend(LinkBlock)
     //    const wrapper = new Constructor({
     //      propsData: content
     //    }).$mount()

    // console.log('Link Block icon: %O', wrapper.vm.$el.querySelector('.block-icon img').src.trim());
    // expect(wrapper.vm.$el.querySelector('.block-icon img').src.trim()).toEqual(content.icon);

    // console.log('Link Block title: %O', wrapper.vm.$el.querySelector('.block-title').textContent.trim());
    // expect(wrapper.vm.$el.querySelector('.block-title').textContent.trim()).toEqual(content.title);

    // console.log('Link Block description: %O', wrapper.vm.$el.querySelector('.block-description').textContent.trim());
    // expect(wrapper.vm.$el.querySelector('.block-description').textContent.trim()).toEqual(content.description);

    // console.log('Link Block description: %O', wrapper.vm.$el.querySelector('.block-description').textContent.trim());
    // expect(wrapper.vm.$el.querySelector('.block-description').textContent.trim()).toEqual(content.description);

    // console.log('Link Block description: %O', wrapper.vm.$el.querySelector('.block-description').textContent.trim());
    // expect(wrapper.vm.$el.querySelector('.block-description').textContent.trim()).toEqual(content.description);



    /*    const Constructor = Vue.extend(Component)
        const vm = new Constructor({
          propsData: {
            // address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
          }
        }).$mount()
        expect(vm.$el.style['background-image'])
          .toEqual('')
          */
  });

  describe('LinkBlock.vue Methods', () => {});
});
