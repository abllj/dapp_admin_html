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
        <el-select v-model="query.type" clearable size="small" placeholder="类型" class="filter-item" style="width: 120px">
          <el-option v-for="item in dict.market_type" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
           <date-range-picker v-model="query.gmtCreate" class="date-item" />

        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />

      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
        @selection-change="crud.selectionChangeHandler">
            <el-table-column align="center" prop="uid" label="UID" />
             <el-table-column align="center" prop="robotId" label="机器人ID" show-overflow-tooltip/>
          <el-table-column align="center" prop="platform" label="平台">
            <template slot-scope="scope">
              {{ dict.label.quant_platform[scope.row.platform] }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="market" label="市场" />
        <el-table-column align="center" prop="type" label="类型">
          <template slot-scope="scope">
            {{ dict.label.market_type[scope.row.type] }}
          </template>
        </el-table-column>

        <el-table-column align="center" prop="revenue" label="收益数量" show-overflow-tooltip/>
        <el-table-column align="center" prop="revenueType" label="收益类型" >
          <template slot-scope="scope">
            {{ dict.label.revenue_type[scope.row.revenueType] }}
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
    import crudRobotRevenue from '@/api/robot/revenue/RobotRevenue.js'
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
    title: '机器人收益',
    url: 'api/RobotRevenue',
    sort: 'id,desc',
    crudMethod: { ...crudRobotRevenue
    }
  })
  const defaultForm = {
    id: null,
    platform: null,
    type: null,
    uid: null,
    robotId: null,
    pid: null,
    market: null,
    stock: null,
    money: null,
    revenue: null,
    dealStatus: null,
    plusDealStatus: null,
    gmtCreate: null
  }
  export default {
    name: 'RobotRevenue',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
      DateRangePicker,
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['quant_platform','yes_no','market_type','revenue_type'],
    data() {
      return {

        permission: {
          add: [ 'RobotRevenue:add'],
          edit: ['RobotRevenue:edit'],
          del: [ 'RobotRevenue:del']
        },
        rules: {
          platform: [{
            required: true,
            message: '平台不能为空',
            trigger: 'blur'
          }],
          type: [{
            required: true,
            message: '1 现货spot不能为空',
            trigger: 'blur'
          }],
          uid: [{
            required: true,
            message: '用户ID不能为空',
            trigger: 'blur'
          }],
          robotId: [{
            required: true,
            message: '机器人ID不能为空',
            trigger: 'blur'
          }],
          pid: [{
            required: true,
            message: 'uuid不能为空',
            trigger: 'blur'
          }],
          market: [{
            required: true,
            message: '市场不能为空',
            trigger: 'blur'
          }],
          stock: [{
            required: true,
            message: 'stock不能为空',
            trigger: 'blur'
          }],
          money: [{
            required: true,
            message: 'money不能为空',
            trigger: 'blur'
          }],
          revenue: [{
            required: true,
            message: '收益数量不能为空',
            trigger: 'blur'
          }],
          dealStatus: [{
            required: true,
            message: '收益分成状态 0未处理 1已经处理不能为空',
            trigger: 'blur'
          }]
        },
        queryTypeOptions: [

          {
            key: 'uid',
            display_name: '用户ID'
          },
          {
            key: 'robotId',
            display_name: '机器人ID'
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
