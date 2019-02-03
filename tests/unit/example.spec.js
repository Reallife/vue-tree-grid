import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import VueTreeGrid from '../../src/components/VueTreeGrid.vue';

describe('VueTreeGrid.vue', () => {
  it('renders empty grid', () => {
    const emptyText = 'No data';
    const wrapper = shallowMount(VueTreeGrid, {
      propsData: {
        columns: [
          {
            type: 'prop',
            prop: 'name',
          },
        ],
        tree: [],
      },
    });
    expect(wrapper.text()).to.include(emptyText);
  });
});
