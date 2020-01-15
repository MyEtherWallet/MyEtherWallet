import Blockie from '@/components/Blockie';
import { mount } from '@vue/test-utils';

describe('Blockie.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(Blockie, {
      propsData: {
        address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
      }
    });
  });

  afterAll(() => {
    wrapper.destroy();
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correct contents', () => {
    expect(wrapper.element.style['background-image']).toEqual(
      'url(data:image/png;base64,00)'
    );
  });

  it('dismounts', () => {
    wrapper.destroy();
    expect(wrapper.exists()).toBe(false);
  });
});
