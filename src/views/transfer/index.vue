<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item"
          @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 100px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-select v-model="query.currency" clearable size="small" placeholder="币种" class="filter-item" style="width: 100px">
          <el-option v-for="item in dict.currency_type" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
    <date-range-picker v-model="query.gmtCreate" class="date-item" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />

      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
        @selection-change="crud.selectionChangeHandler">
        <el-table-column align="center" prop="fromUserId" label="转出人"  />
        <el-table-column align="center" prop="toUserId" label="接受人" />
        <el-table-column align="center" prop="address" label="地址" width="260px"/>
        <el-table-column align="center" prop="amount" label="数量" />
        <el-table-column align="center" prop="currency" label="币种" />
        <el-table-column align="center" prop="fee" label="手续费" />
        <el-table-column align="center" prop="feeCurrency" label="手续费币种" />
        <el-table-column align="center" width="135" prop="gmtCreate" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtCreate) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
  import crudTransferRecord from '@/api/transfer/TransferRecord'
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
    title: '划转管理',
    url: 'api/TransferRecord',
    sort: 'id,desc',
    crudMethod: { ...crudTransferRecord
    }
  })
  const defaultForm = {
    id: null,
    fromUserId: null,
    toUserId: null,
    address: null,
    fromAccount: null,
    toAccount: null,
    amount: null,
    currency: null,
    fee: null,
    feeCurrency: null,
    feeRate: null,
    gmtCreate: null,
    gmtUpdated: null
  }
  export default {
    name: 'TransferRecord',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
      DateRangePicker,
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
        dicts: [ 'currency_type'],
    data() {
      return {

        permission: {
          add: ['', 'TransferRecord:add'],
          edit: ['', 'TransferRecord:edit'],
          del: ['', 'TransferRecord:del']
        },
        rules: {},
        queryTypeOptions: [{
            key: 'fromUserId',
            display_name: '转出人'
          },
          {
            key: 'toUserId',
            display_name: '接受人'
          },
          {
            key: 'address',
            display_name: '地址'
          }

        ]
      }
    },
    watch: {},
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        const query = this.query
        this.crud.params = [];
        if (query.type && query.value) {
          this.crud.params[query.type] = query.value
        }
        return true
      }, // 新增与编辑前做的操作
      [CRUD.HOOK.afterToCU](crud, form) {},
    }
  }
</script>

<style scoped>
</style>
