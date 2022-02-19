<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.uid" clearable placeholder="输入搜索UID" style="width: 200px;" class="filter-item"
          @keyup.enter.native="crud.toQuery" />
        <date-range-picker v-model="query.gmtCreate" class="date-item" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
        @selection-change="crud.selectionChangeHandler">
              <el-table-column align="center" prop="id" label="ID" />
        <el-table-column align="center" prop="uid" label="UID" />
        <el-table-column align="center" prop="amount" label="购买数量" />
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
   import crudPartnerBuyRecord from '@/api/partner/buy/PartnerBuyRecord.js'
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
    title: '合伙人出售仓位',
    url: 'api/PartnerBuyRecord',
    sort: 'id,desc',
    crudMethod: { ...crudPartnerBuyRecord
    }
  })
  const defaultForm = {
    id: null,
    uid: null,
    amount: null,
    gmtCreate: null,
    gmtUpdated: null
  }
  export default {
    name: 'PartnerBuyRecord',
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
          add: [ 'PartnerBuyRecord:add'],
          edit: [ 'PartnerBuyRecord:edit'],
          del: ['PartnerBuyRecord:del']
        },
        rules: {
          uid: [{
            required: true,
            message: '用户ID不能为空',
            trigger: 'blur'
          }],
          amount: [{
            required: true,
            message: '购买数量不能为空',
            trigger: 'blur'
          }]
        },
        queryTypeOptions: [{
          key: 'uid',
          display_name: '用户ID'
        }]
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
