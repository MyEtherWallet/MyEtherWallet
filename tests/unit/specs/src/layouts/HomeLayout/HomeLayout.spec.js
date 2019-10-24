import { mount } from '@vue/test-utils';
import HomeLayout from '@/layouts/HomeLayout';

describe('HomeLayout.vue', () => {
  test('resnders correctly', () => {
    const wrapper = mount(HomeLayout);
    expect(wrapper.element).toMatchSnapshot();
  });
});
