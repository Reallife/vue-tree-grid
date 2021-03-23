<template>
    <div class="tree-grid__wrapper">
        <div class="tree-grid__header-wrapper">
            <table
                cellspacing="0"
                cellpadding="0"
                border="0"
                class="tree-grid__table"
            >
                <thead>
                    <tr class="tree-grid__header-row">
                        <th
                          v-for="(column, columnIndex) in columns"
                          :key="columnIndex"
                          class="tree-grid__header-cell"
                          :width="column.width || 'auto'"
                        >
                            <div class="tree-grid__header-cell-inner">
                                <template v-if="column.type === 'checkbox'">
                                    <input
                                        class="tree-grid__checkbox tree-grid__checkbox--check-all"
                                        type="checkbox"
                                        :checked="isAllChecked"
                                        :indeterminate.prop="isAllIndeterminate"
                                        @change="onCheckAll"
                                    />
                                </template>
                                <template v-else>
                                    <slot
                                      :name="column.prop + '--header-cell'"
                                      v-bind:column="column"
                                    >
                                        {{ column.label ? column.label : '' }}
                                    </slot>
                                </template>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="cloneTree.length > 0">
                        <VueTreeGridRow
                            v-for="(row, index) in cloneTree"
                            :key="index"
                            :columns="columns"
                            :row="row"
                            :children-property="childrenProperty"
                            :row-class="rowClass"
                            @row-checked="onRowChecked"
                            @row-expanded="onRowExpanded"
                        >
                            <template
                              v-for="slot in rowCellsSlotNames"
                              :slot="slot"
                              slot-scope="scope"
                            >
                                <slot :name="slot" v-bind="scope" />
                            </template>
                        </VueTreeGridRow>
                    </template>
                    <template v-else>
                        <tr class="tree-grid__empty-body-row">
                            <td :colspan="columns.length">
                                {{ emptyText }}
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import set from 'lodash.set';
import get from 'lodash.get';
import VueTreeGridRow from './VueTreeGridRow.vue';

export default {
  name: 'VueTreeGrid',
  components: { VueTreeGridRow },
  props: {
    columns: {
      type: Array,
      required: true,
    },
    tree: {
      type: Array,
      required: true,
    },
    searchQuery: {
      type: String,
      default: '',
    },
    childrenProperty: {
      type: String,
      default: 'children',
    },
    emptyText: {
      type: String,
      default: 'No data',
    },
    rowClass: {
      type: Function,
      default: () => '',
    },
  },
  data() {
    return {
      checked_rows: [],
      cloneTree: [],
    };
  },
  computed: {
    enabledRootRows() {
      return this.cloneTree.filter(({ _isDisabled }) => !_isDisabled);
    },
    isAllChecked() {
      return this.enabledRootRows.every(({ _isChecked }) => _isChecked);
    },
    isAllIndeterminate() {
      return !this.isAllChecked
        && (
          this.enabledRootRows.some(({ _isChecked }) => _isChecked)
          || this.enabledRootRows.some(({ _isIndeterminate }) => _isIndeterminate)
        );
    },
    rowCellsSlotNames() {
      return Object.keys(this.$scopedSlots).filter((slotKey) => slotKey.endsWith('--row-cell'));
    },
  },
  watch: {
    tree: {
      handler(val) {
        this.buildTree(val);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    onRowChecked(row, isChecked) {
      this.toggleCheckRow(row, isChecked)
        .then(() => {
          this.getAllCheckedRows()
            .then((checkedRows) => {
              this.$emit('check', checkedRows);
            });
        });
    },
    onRowExpanded(row, isExpanded) {
      this.toggleExpandRow(row, isExpanded)
        .then(() => {
          this.$emit('expand', row);
        });
    },
    onCheckAll(event) {
      return Promise.all(
        this.cloneTree.map((row) => this.toggleCheckRow(row, event.target.checked)),
      )
        .then(() => {
          this.getAllCheckedRows()
            .then((checkedRows) => {
              this.$emit('check', checkedRows);
            });
        });
    },
    getAllCheckedRows(parent = null) {
      let checkedRows = [];
      return new Promise((resolve) => {
        if (parent === null) {
          Promise.all(
            this.cloneTree.map((child) => this.getAllCheckedRows(child)),
          )
            .then((checkedChildrenRows) => {
              checkedChildrenRows
                .filter((rows) => rows.length > 0)
                .forEach((rows) => {
                  checkedRows = checkedRows.concat(rows);
                });
              resolve(checkedRows);
            });
        } else if (parent._isChecked || parent._isIndeterminate) {
          if (parent._isChecked) {
            checkedRows.push(parent);
          }
          if (parent._childrenLength > 0) {
            Promise.all(
              parent[this.childrenProperty].map((child) => this.getAllCheckedRows(child)),
            )
              .then((checkedChildrenRows) => {
                checkedChildrenRows
                  .filter((rows) => rows.length > 0)
                  .forEach((rows) => {
                    checkedRows = checkedRows.concat(rows);
                  });
                resolve(checkedRows);
              });
          } else {
            resolve(checkedRows);
          }
        } else {
          resolve([]);
        }
      });
    },
    buildTree(tree) {
      this.cloneTree = tree.map((row, index) => this.buildTreeItem(row, index));
    },
    buildTreeItem(row, index, parent = null, level = 1) {
      const treeItem = {
        _isChecked: false,
        _isIndeterminate: false,
        _isDisabled: false,
        _isHidden: false,
        _isFolded: false,
        _isExpanded: false,
        _childrenLength: 0,
        ...row,
        _level: level,
        _path: parent !== null
          ? [parent._path, this.childrenProperty, index].join('.')
          : index.toString(),
        _index: index,
      };

      if (parent !== null) {
        if (parent._isHidden) {
          treeItem._isHidden = true;
        }

        if (!parent._isExpanded) {
          treeItem._isFolded = true;
        }
      }

      if (Object.prototype.hasOwnProperty.call(treeItem, this.childrenProperty)) {
        treeItem[this.childrenProperty] = treeItem[this.childrenProperty]
          .map((child, idx) => this.buildTreeItem(child, idx, treeItem, level + 1));
        treeItem._childrenLength = treeItem[this.childrenProperty].length;
        treeItem._isIndeterminate = this.isIndeterminate(treeItem);
      }

      treeItem._isChecked = this.isChecked(treeItem, parent);

      return treeItem;
    },
    getParent(row) {
      return get(this.cloneTree, row._path.split('.').slice(0, -2), null);
    },
    toggleCheckRow(row, isChecked, updateParent = true) {
      return new Promise((resolve) => {
        if (row._isDisabled) {
          resolve();
        } else {
          if (row._childrenLength > 0) {
            Promise.all(
              row[this.childrenProperty].map(
                (child) => this.toggleCheckRow(child, isChecked, false),
              ),
            )
              .then(() => {
                set(this.cloneTree, [row._path, '_isChecked'].join('.'), isChecked);
              });
          } else {
            set(this.cloneTree, [row._path, '_isChecked'].join('.'), isChecked);
          }
          if (updateParent) {
            let parent = this.getParent(row);
            while (parent) {
              const isParentIndeterinate = this.isIndeterminate(parent);
              const isParentChecked = this.isChecked(parent);

              if (isParentIndeterinate) {
                set(this.cloneTree, [parent._path, '_isChecked'].join('.'), false);
                set(this.cloneTree, [parent._path, '_isIndeterminate'].join('.'), true);
              } else {
                set(this.cloneTree, [parent._path, '_isChecked'].join('.'), isParentChecked);
                set(this.cloneTree, [parent._path, '_isIndeterminate'].join('.'), false);
              }

              parent = this.getParent(parent);
            }
          }

          resolve();
        }
      });
    },
    toggleExpandRow(row, isExpanded) {
      return new Promise((resolve) => {
        set(this.cloneTree, [row._path, '_isExpanded'].join('.'), isExpanded);
        row[this.childrenProperty].forEach((child) => {
          set(this.cloneTree, [child._path, '_isFolded'].join('.'), !isExpanded);
        });
        resolve();
      });
    },
    isChecked(row, parent) {
      if (row._childrenLength === 0) {
        if (parent) {
          return parent._isChecked || row._isChecked;
        }

        return row._isChecked;
      }

      return row[this.childrenProperty].every((child) => child._isChecked);
    },
    isIndeterminate(row) {
      if (row._childrenLength === 0) {
        return false;
      }

      return !row[this.childrenProperty].every((child) => child._isChecked)
        && row[this.childrenProperty].some((child) => child._isChecked || child._isIndeterminate);
    },
  },
};
</script>
<style lang="scss">
  .tree-grid__wrapper {
    text-align: left;
    .tree-grid__table {
      width: 100%;
      max-width: 100%;
      margin-bottom: 1rem;
      background-color: transparent;
      border-collapse: collapse;
      .tree-grid__header-row {
        background-color: #bbb;
        .tree-grid__header-cell {
          vertical-align: bottom;
          border-bottom: 2px solid #dee2e6;
          padding: .75rem;
          border-top: 1px solid #dee2e6;
          text-align: inherit;
        }
      }
      .tree-grid__checkbox {
        width: 15px;
        height: 15px;
      }
    }
  }
</style>
