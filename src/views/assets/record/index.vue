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
        <el-select v-model="query.currency" clearable size="small" placeholder="选择币种" class="filter-item" style="width: 130px">
            <el-option v-for="item in dict.currency_type" :key="item.id" :label="item.label" :value="item.value" />
          </el-select>
        <el-select v-model="query.recordType" clearable size="small" placeholder="选择类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in dict.profit_record_type" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
   <date-range-picker v-model="query.gmtCreate" class="date-item" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />

      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
        @selection-change="crud.selectionChangeHandler">
        <el-table-column align="center" prop="fromUid" label="发送人UID" />
        <el-table-column align="center" prop="toUid" label="接收人UID" />
        <el-table-column align="center" prop="recordType" label="类型">
          <template slot-scope="scope">
            {{ dict.label.profit_record_type[scope.row.recordType] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="currency" label="币种" >
          <template slot-scope="scope">
              {{ dict.label.currency_type[scope.row.currency] }}
            </template>
          </el-table-column>
        <el-table-column align="center" prop="amount" label="金额" />
        <el-table-column align="center" prop="rate" label="利率" />
        <el-table-column align="center" prop="beforeAmount" label="修改前资产" />
        <el-table-column align="center" prop="afterAmount" label="修改后资产" />
        <el-table-column align="center" width="135" prop="gmtCreate" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtCreate) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="descript" label="备注" />
<!--        <el-table-column v-permission="['admin','RevenueProfitRecord:edit','RevenueProfitRecord:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission" />
          </template>
        </el-table-column> -->
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
   import crudRevenueProfitRecord from '@/api/assets/record/RevenueProfitRecord'
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
    title: '收益记录',
    url: 'api/RevenueProfitRecord',
    sort: 'id,desc',
    crudMethod: { ...crudRevenueProfitRecord
    }
  })
  const defaultForm = {
    id: null,
    fromUid: null,
    toUid: null,
    recordType: null,
    currency: null,
    amount: null,
    rate: null,
    beforeAmount: null,
    afterAmount: null,
    gmtCreate: null,
    gmtUpdated: null,
    descript: null
  }
  export default {
    name: 'RevenueProfitRecord',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
      DateRangePicker
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['profit_record_type','currency_type'],
    data() {
      return {

        permission: {
          add: [ 'RevenueProfitRecord:add'],
          edit: [ 'RevenueProfitRecord:edit'],
            del: [ '','RevenueProfitRecord:del']
        },
        rules: {},
        queryTypeOptions: [{
            key: 'fromUid',
            display_name: '发送人UID'
          },
          {
            key: 'toUid',
            display_name: '接收人UID'
          },
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
