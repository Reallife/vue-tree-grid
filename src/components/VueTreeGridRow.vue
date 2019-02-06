<template>
    <Fragment>
        <tr
            v-show="!model._isHidden && !model._isFolded"
            class=""
            :class="getRowClass()"
        >
            <td
              v-for="(column, columnIndex) in columns"
              :key="columnIndex"
              class="tree-grid__body-cell"
              :class="{'tree-grid__body-cell--with-checkbox': column.type === 'checkbox'}"
            >
                <template v-if="column.type === 'checkbox'">
                    <input
                      v-model="model._isChecked"
                      class="tree-grid__checkbox"
                      type="checkbox"
                      :indeterminate.prop="model._isIndeterminate"
                      :disabled="model._isDisabled"
                      @change="(event) => onCheckRow(event.target.checked)"
                    >
                </template>
                <template v-else>
                    <template v-if="hasChildren && columnIndex === 1">
                        <i
                            v-if="model._isExpanded"
                            class="tree-grid__expand-icon tree-grid__expand-icon--expanded"
                            @click="onExpand(false)"
                        >
                            -
                        </i>
                        <i
                            v-else
                            class="tree-grid__expand-icon tree-grid__expand-icon--collapsed"
                            @click="onExpand(true)"
                        >
                            +
                        </i>
                    </template>
                    <slot :name="column.prop + '--row-cell'" v-bind:row="row">
                        {{ row.hasOwnProperty(column.prop) ? row[column.prop] : '' }}
                    </slot>
                </template>
            </td>
        </tr>
        <template v-if="hasChildren">
            <VueTreeGridRow
                v-for="(childRow, index) in children"
                v-show="!model._isHidden && !model._isFolded"
                :key="index"
                :columns="columns"
                :row="childRow"
                :children-property="childrenProperty"
                :row-class="rowClass"
                @row-checked="onChildRowChecked"
                @row-expanded="onChildRowExpanded"
            >
                <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope">
                    <slot :name="slot" v-bind="scope" />
                </template>
            </VueTreeGridRow>
        </template>
    </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment';

export default {
  name: 'VueTreeGridRow',
  components: { Fragment },
  props: {
    columns: {
      type: Array,
      required: true,
    },
    row: {
      type: Object,
      required: true,
    },
    rowClass: {
      type: Function,
      default: () => '',
    },
    childrenProperty: {
      type: String,
      default: 'children',
    },
  },
  data() {
    return {
      model: this.row,
    };
  },
  computed: {
    hasChildren() {
      return this.children.length > 0;
    },
    children() {
      return this.model[this.childrenProperty] || [];
    },
  },
  watch: {
    row: {
      handler(val) {
        this.model = val;
      },
      deep: true,
    },
  },
  methods: {
    onCheckRow(isChecked) {
      this.$emit('row-checked', this.model, isChecked);
    },
    onExpand(isExpanded) {
      this.$emit('row-expanded', this.model, isExpanded);
    },
    onChildRowChecked(childRow, isChecked) {
      this.$emit('row-checked', childRow, isChecked);
    },
    onChildRowExpanded(childRow, isExpanded) {
      this.$emit('row-expanded', childRow, isExpanded);
    },
    getRowClass() {
      const classNames = [
        'tree-grid__body-row',
        ['tree-grid__body-row--level-', this.model._level].join(''),
      ];

      if (this.model._isHidden) {
        classNames.push('tree-grid__body-row--hidden');
      }

      if (this.model._isFolded) {
        classNames.push('tree-grid__body-row--folded');
      }

      classNames.push(this.rowClass(this.model));

      return classNames.join(' ');
    },
  },
};
</script>
<style lang="scss">
  .tree-grid__body-row {
    .tree-grid__body-cell {
      padding: .75rem;
      vertical-align: top;
      border-top: 1px solid #dee2e6;
      &.tree-grid__body-cell--with-checkbox {
        padding: .75rem !important;
      }
      .tree-grid__expand-icon {
        padding: 0;
        width: 15px;
        height: 15px;
        position: relative;
        line-height: 1;
        cursor: pointer;
        background: transparent;
        border: 1px solid;
        text-align: center;
        display: inline-block;
        border-radius: 2px;
      }
    }
    &.tree-grid__body-row--level-2 {
      .tree-grid__body-cell {
        padding: 1rem;
      }
    }
  }
</style>
