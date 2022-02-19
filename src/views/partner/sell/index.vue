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
        <date-range-picker v-model="query.gmtCreate" class="date-item" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
        @selection-change="crud.selectionChangeHandler">
        <el-table-column align="center" prop="id" label="ID" />
        <el-table-column align="center" prop="fromUid" label="售出UID" />
        <el-table-column align="center" prop="toUid" label="购买UID" />
        <el-table-column align="center" prop="amount" label="数量" />
        <el-table-column align="center" prop="name" label="仓位名称" />
        <el-table-column align="center" prop="pairQty" label="交易对数量" />
        <el-table-column align="center" prop="qty" label="仓位" />
        <el-table-column align="center" prop="period" label="有效期" />
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
    import crudPartnerSellRecord from '@/api/partner/sell/PartnerSellRecord.js'
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
    title: '合伙人购买仓位',
    url: 'api/PartnerSellRecord',
    sort: 'id,desc',
    crudMethod: { ...crudPartnerSellRecord
    }
  })
  const defaultForm = {
    id: null,
    fromUid: null,
    toUid: null,
    amount: null,
    name: null,
    pairQty: null,
    qty: null,
    period: null,
    gmtCreate: null,
    gmtUpdated: null
  }
  export default {
    name: 'PartnerSellRecord',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
      DateRangePicker
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    data() {
      return {

        permission: {
          add: [ 'PartnerSellRecord:add'],
          edit: ['PartnerSellRecord:edit'],
          del: [ 'PartnerSellRecord:del']
        },
        rules: {
          fromUid: [{
            required: true,
            message: '售出点卡用户不能为空',
            trigger: 'blur'
          }],
          toUid: [{
            required: true,
            message: '购买点卡用户不能为空',
            trigger: 'blur'
          }],
          gmtCreate: [{
            required: true,
            message: '创建时间不能为空',
            trigger: 'blur'
          }],
          gmtUpdated: [{
            required: true,
            message: '修改时间不能为空',
            trigger: 'blur'
          }]
        },
        queryTypeOptions: [{
            key: 'fromUid',
            display_name: '售出UID'
          },
          {
            key: 'toUid',
            display_name: '购买UID'
          },
          {
            key: 'name',
            display_name: '仓位名称'
          },
          {
            key: 'qty',
            display_name: '仓位'
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
