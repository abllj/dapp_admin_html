<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item"
          @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <date-range-picker v-model="query.gmtUpdated" class="date-item" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
        @selection-change="crud.selectionChangeHandler">
        <el-table-column align="center" prop="userId" label="UID" width="100px" />
        <el-table-column align="center" prop="currency" label="币种" width="100px" />
        <el-table-column align="center" prop="addr" label="地址" />
        <el-table-column align="center" prop="status" label="是否使用">
          <template slot-scope="scope">
            {{ dict.label.yes_no[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="135" prop="gmtUpdated" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtUpdated) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
  import crudFilAddress from '@/api/wallet/fil/address/FilAddress'
  import CRUD, {
    crud,
    form,
    header,
    presenter
  } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import DateRangePicker from "@/components/DateRangePicker"


  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: 'FIL地址',
    url: 'api/FilAddress',
    sort: 'id,desc',
    crudMethod: { ...crudFilAddress
    }
  })
  const defaultForm = {
    id: null,
    userId: null,
    currency: null,
    privateKey: null,
    addr: null,
    status: null,
    gmtCreate: null,
    gmtUpdated: null
  }
  export default {
    name: 'FilAddress',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
      DateRangePicker
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
     dicts: ['yes_no'],
    data() {
      return {

        permission: {
          add: ['FilAddress:add'],
          edit: ['FilAddress:edit'],
          del: ['FilAddress:del']
        },
        rules: {

        },
        queryTypeOptions: [{
            key: 'userId',
            display_name: 'UID'
          },
          {
            key: 'currency',
            display_name: '币种 '
          },
          {
            key: 'addr',
            display_name: '地址'
          }
        ]
      }
    },
    watch: {},
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        return true
      }, // 新增与编辑前做的操作
      [CRUD.HOOK.afterToCU](crud, form) {},
    }
  }
</script>

<style scoped>
  .table-img {
    display: inline-block;
    text-align: center;
    background: #ccc;
    color: #fff;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    vertical-align: middle;
    width: 32px;
    height: 32px;
    line-height: 32px;
  }
</style>
