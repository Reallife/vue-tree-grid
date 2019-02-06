<template>
  <div id="app">
    <h1>Simple Vue tree grid component</h1>
    <div class="demo-wrapper">
      <VueTreeGrid
        :columns="columns"
        :tree="tree"
        @check="onRowChecked"
      >
        <template slot="description--row-cell" slot-scope="scope">
          Path: <code>{{scope.row._path}}</code>
        </template>
      </VueTreeGrid>
      <div class="checked-rows-wrapper">
        <h2>Checked rows</h2>
        <p v-if="checkedRows.length === 0" class="checked-row checked-row--empty">
          No checked rows
        </p>
        <p v-else v-for="row in checkedRows" :key="row._path" class="checked-row">
          {{ row.name }} (Path: <code>"{{row._path}}"</code>)
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import VueTreeGrid from '../src/components/VueTreeGrid.vue';

export default {
  name: 'app',
  components: {
    VueTreeGrid,
  },
  data() {
    return {
      checkedRows: [],
      columns: [
        {
          type: 'checkbox',
          width: '10%',
        },
        {
          type: 'prop',
          prop: 'name',
          label: 'Name',
          width: '20%',
        },
        {
          type: 'prop',
          prop: 'description',
          label: 'Description',
          width: '70%',
        },
      ],
      tree: [
        {
          name: 'Parent 1',
          _isExpanded: true,
          children: [
            {
              name: 'Child 1',
            },
            {
              name: 'Child 2',
              children: [
                {
                  name: 'Child 2-1',
                },
                {
                  name: 'Child 2-2',
                  _isChecked: true,
                },
              ],
            },
          ],
        },
        {
          name: 'Parent 2',
          description: 'I\'m the second parent',
          children: [
            {
              name: 'Child 1',
            },
            {
              name: 'Child 2',
            },
          ],
        },
        {
          name: 'Parent 3',
        },
      ],
    };
  },
  methods: {
    onRowChecked(checkedRows) {
      this.checkedRows = checkedRows;
    },
  },
};
</script>

<style lang="scss">
#app {
  text-align: center;
  margin-top: 60px;
  .demo-wrapper {
    max-width: 1024px;
    margin: 0 auto;
    position: relative;
    .checked-rows-wrapper {
      max-width: 500px;
      margin: 0 auto;
      position: relative;
      .checked-row {
        text-align: left;
        &--empty{
          text-align: center;
        }
      }
    }
    code {
      color: darkred;
    }
  }
}
</style>
