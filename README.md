# Vue Tree Grid

### WORK IN PROGRESS! USE IN PRODUCTION ON YOUR OWN RISK!

## Install

```bash
npm i --save @reallife/vue-tree-grid
```
or 
```bash
yarn add @reallife/vue-tree-grid
```

## Usage

```vue
<template>
  <div id="app">
    <VueTreeGrid
      :columns="columns"
      :tree="tree"
      @check="onRowChecked"
      @expand="onRowExpanded"
    >
      <template slot="description--row-cell" slot-scope="scope">
        Path: <code>{{scope.row._path}}</code>
      </template>
    </VueTreeGrid>
  </div>
</template>

<script>
import VueTreeGrid from '@reallife/vue-tree-grid' 

export default {
  name: 'app',
  components: {
    VueTreeGrid,
  },
  data() {
    return {
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
                  _isChecked: true,
                },
                {
                  name: 'Child 2-2',
                },
              ],
            },
          ],
        },
      ],
    };
  },
  methods: {
    onRowChecked(checkedRows) {
      console.log(checkedRows);
    },
    onRowExpanded(row) {
      if (row._isExpanded) {
        console.log('Row with path' + row._path + ' has been expanded');
      } else {
        console.log('Row with path' + row._path + ' has been collapsed');
      }
    }
  },
};
</script>
```

## Component properties

| Name | Required | Type |Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `columns` | **yes** | Array ([Details](#column-properties)) | - | Columns array |
| `tree` | **yes** | Array ([Details](#tree-structure-properties)) | - | Tree structure of rows |
| `childrenProperty` | no | String | 'children' | Name of tree's row property that contains children rows |
| `emptyText` | no | String | 'No data' | Text for empty grid |
| `rowClass` | no | Function (params: `row` ) | - | Function that returns style classes for each row |


## Column properties

| Name | Required | Type |Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `type` | **yes** | String | - | Type of column. Available values: `"checkbox"`, `"prop"`. |
| `prop` | no | String | - | Row's prop name for output in this column. Using only when `type` is `"prop"` |
| `label` | no | String | - | Column label |
| `width` | no | String | 'auto' | Column width |

#### Examples
```javascript
[
  // Column with checkbox
  {
    type: 'checkbox',
    width: '10%'
  }
    
  // Column for row's property "name"
  {
    type: 'prop',
    prop: 'name',
    label: 'Name',
    width: '300px',
  }
]
```

## Tree structure properties

Each row in tree after passing in component will be contain this properties:

| Name  | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `_isChecked` | Boolean | `false` | Determines is row checked |
| `_isIndeterminate` | Boolean | `false` | Determines is row indeterminate |
| `_isExpanded` | Boolean | `false` | Determines is row expanded |
| `_isFolded` | Boolean | `false` | Determines is row folded (for children rows). If parent row is expanded then children rows will be folded |
| `_isDisabled` | Boolean | `false` | Determines is row disabled (row don't change own `_isChecked` property on parent row checking/unchecking) |
| `_isHidden` | Boolean | `false` | Determines is row hidden (row just hidden, it continue reacts on parent checking/unchecking). If row is hidden, all it's children also hides |
| `_childrenLength` | Integer | - | Count of row's children. |
| `_level` | Integer | - | Row's level in tree structure. Counts with 1 |
| `_path` | String | - | Row's path in tree structure. For example: `0.children.4.children.1` |
| `_index` | Integer | - | Row's index in table |

You can use this properties to define initial state of tree and change it from outside of component.

#### Example tree structure

```javascript
[
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
            _isChecked: true,
          },
          {
            name: 'Child 2-2',
          },
        ],
      },
    ],
  },
]
```

## Component events

| Name  | Type | Parameters | Description |
| :--- | :--- | :--- | :--- |
| `check` | Function  | `checkedRows` - array of checked rows | Event fires when any row in the tree has been checked or unchecked |
| `expand` | Function | `row` - row that has been expanded or collapsed | Event fires when any row in the tree has been expanded or collapsed |

## Component slots

You can use slots for changing output of every header label or cell content.

Slot names for body cells looks like `%column_prop%--row-cell`. For example: `name--row-cell`.

Slot names for header cells looks like `%column_prop%--header-cell`. For example: `name--header-cell`.

#### Example

```vue
<VueTreeGrid
  :columns="columns"
  :tree="tree"
  @check="onRowChecked"
  @expand="onRowExpanded"
>
  <template slot="description--row-cell" slot-scope="scope">
    Path: <code>{{scope.row._path}}</code>
  </template>
</VueTreeGrid>
```
