<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <date-range-picker v-model="query.gmtCreate" class="date-item" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
        @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column align="center" prop="id" label="id" width="50" />
        <el-table-column align="center" prop="vehicleAmount" label="赛车产出" />
        <el-table-column align="center" prop="emptyAmount" label="空投产出" />
        <el-table-column align="center" prop="vehicleRecycleAmount" label="赛车回收" />
        <el-table-column align="center" prop="clubAmount" label="俱乐部产出" />
        <el-table-column align="center" prop="rankingAmount" label="排行榜产出" />
        <el-table-column align="center" prop="privatePlacement" label="私募产出" />
        <el-table-column align="center" prop="lpAmount" label="lp产出" />
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
    import crudStatistical from "@/api/record/statistical/statistical.js"
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
    title: 'statistical',
    url: 'api/statistical',
    sort: 'id,desc',
    crudMethod: {
      ...crudStatistical
    }
  })
  const defaultForm = {
    id: null,
    vehicleAmount: null,
    emptyAmount: null,
    vehicleRecycleAmount: null,
    gmtCreate: null,
    clubAmount: null,
    rankingAmount: null,
    privatePlacement: null,
    lpAmount: null
  }
  export default {
    name: 'Statistical',
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
          add: [ 'statistical:add'],
          edit: [ 'statistical:edit'],
          del: [ 'statistical:del']
        },
        rules: {},
        queryTypeOptions: []
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
