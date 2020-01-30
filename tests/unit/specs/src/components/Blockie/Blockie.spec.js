import Blockie from '@/components/Blockie';
import { mount } from '@vue/test-utils';

describe('Blockie.vue', () => {
  xit('should render correct contents', () => {
    const wrapper = mount(Blockie, {
      propsData: {
        address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
      }
    });
    expect(wrapper.element.style['background-image']).toEqual(
      'url(data:image/png;base64,00)'
    );
  });

  it('should render correct contents', () => {});
});
