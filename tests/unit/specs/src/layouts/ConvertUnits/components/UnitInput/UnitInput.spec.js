import Vue from 'vue';
import { shallowMount , mount} from '@vue/test-utils'
import UnitInput from '@/layouts/ConvertUnits/components/UnitInput/UnitInput.vue';

describe('UnitInput.vue', () => {
  it('should render correct contents', () => {
    const content = 'UnitInput content';
    const wrapper = shallowMount(UnitInput, {
      propsData: { content }
    });

    

    for(var i=0; i< wrapper.vm.$el.querySelector('.block-left .select-block select').length; i++) {
        const dropDownText = wrapper.vm.$el.querySelector('.block-left .select-block select').options[i].text;
        console.log('Right-Block Select Labels:%O',dropDownText);
        const unitInputData = wrapper.vm.$data.leftDropDown[i].label;
        console.log('UnitInput Data: %O', unitInputData);

        expect(dropDownText.trim()).toEqual(unitInputData);
    }

    for(var i=0; i< wrapper.vm.$el.querySelector('.block-right .select-block select').length; i++) {
        const dropDownText = wrapper.vm.$el.querySelector('.block-right .select-block select').options[i].text;
        console.log('Right-Block Select Labels:%O',dropDownText);

        const unitInputData = wrapper.vm.$data.rightDropDown[i].label;
        console.log('UnitInput Data: %O', unitInputData);

        expect(dropDownText.trim()).toEqual(unitInputData);
    }

  });

  describe('UnitInput.vue Methods', () => {});
});
