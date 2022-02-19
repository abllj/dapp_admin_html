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
        <el-select v-model="query.platform" clearable size="small" placeholder="平台" class="filter-item" style="width: 120px">
          <el-option v-for="item in dict.quant_platform" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="query.status" clearable size="small" placeholder="状态" class="filter-item" style="width: 120px">
          <el-option v-for="item in dict.yes_no" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
   <date-range-picker v-model="query.gmtCreate" class="date-item" />
   
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
     
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
        @selection-change="crud.selectionChangeHandler">
        <el-table-column align="center" prop="robotId" label="机器人ID" />
        <el-table-column align="center" prop="platform" label="平台">
          <template slot-scope="scope">
            {{ dict.label.quant_platform[scope.row.platform] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="uid" label="用户ID" />
        <el-table-column align="center" prop="marketName" label="交易市场名称" />
        <el-table-column align="center" prop="money" label="补仓数量" />
        <el-table-column align="center" prop="status" label="是否补仓">
          <template slot-scope="scope">
            {{ dict.label.yes_no[scope.row.status] }}
          </template>
        </el-table-column>
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
     import crudOneKeyOrder from '@/api/robot/oneKeyOrder/OneKeyOrder.js'
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
    title: '一键补仓',
    url: 'api/OneKeyOrder',
    sort: 'id,desc',
    crudMethod: { ...crudOneKeyOrder
    }
  })
  const defaultForm = {
    id: null,
    robotId: null,
    platform: null,
    uid: null,
    marketName: null,
    money: null,
    status: null,
    gmtCreate: null,
    gmtUpdated: null
  }
  export default {
    name: 'OneKeyOrder',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
           DateRangePicker,
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['quant_platform', 'yes_no'],
    data() {
      return {

        permission: {
          add: [ 'OneKeyOrder:add'],
          edit: [ 'OneKeyOrder:edit'],
          del: [ 'OneKeyOrder:del']
        },
        rules: {},
        queryTypeOptions: [{
            key: 'robotId',
            display_name: '机器人ID'
          },

          {
            key: 'uid',
            display_name: 'UID'
          },
          {
            key: 'marketName',
            display_name: '交易对'
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
