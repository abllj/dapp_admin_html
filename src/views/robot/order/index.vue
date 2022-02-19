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
     <el-select v-model="query.side" clearable size="small" placeholder="买卖" class="filter-item" style="width: 120px">
       <el-option v-for="item in dict.order_side" :key="item.id" :label="item.label" :value="item.value" />
     </el-select>
     <el-select v-model="query.isFirst" clearable size="small" placeholder="首单尾单" class="filter-item" style="width: 120px">
       <el-option v-for="item in dict.order_first" :key="item.id" :label="item.label" :value="item.value" />
     </el-select>
           <date-range-picker v-model="query.gmtCreate" class="date-item" />

        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
        @selection-change="crud.selectionChangeHandler">
        <el-table-column align="center" prop="uid" label="UID"  fixed/>
         <el-table-column align="center" prop="robotId" label="机器人ID" show-overflow-tooltip/>
           <el-table-column align="center" prop="orderId" label="订单ID" show-overflow-tooltip/>

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
        <el-table-column align="center" prop="side" label="买卖">
          <template slot-scope="scope">
            {{ dict.label.order_side[scope.row.side] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="dealMoney" label="成交总量" />
        <el-table-column align="center" prop="dealAmount" label="成交数量" />
        <el-table-column align="center" prop="price" label="成交均价" />
        <el-table-column align="center" prop="isFirst" label="首单尾单">
          <template slot-scope="scope">
            {{ dict.label.order_first[scope.row.isFirst] }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="135" prop="gmtCreate" label="订单时间">
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
    import crudRobotOrder from '@/api/robot/order/RobotOrder.js'
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
    title: '机器人订单',
    url: 'api/RobotOrder',
    sort: 'id,desc',
    crudMethod: { ...crudRobotOrder
    }
  })
  const defaultForm = {
    id: null,
    uid: null,
    platform: null,
    type: null,
    orderId: null,
    robotId: null,
    side: null,
    market: null,
    stock: null,
    money: null,
    dealMoney: null,
    dealAmount: null,
    price: null,
    orderStatus: null,
    isFirst: null,
    pid: null,
    gmtCreate: null
  }
  export default {
    name: 'RobotOrder',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
           DateRangePicker,
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['quant_platform', 'market_type', 'order_side', 'order_first'],
    data() {
      return {

        permission: {
          add: ['RobotOrder:add'],
          edit: ['RobotOrder:edit'],
          del: [ 'RobotOrder:del']
        },
        rules: {
          uid: [{
            required: true,
            message: '用户ID不能为空',
            trigger: 'blur'
          }],
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
          orderId: [{
            required: true,
            message: '订单ID不能为空',
            trigger: 'blur'
          }],
          robotId: [{
            required: true,
            message: '量化机器人ID不能为空',
            trigger: 'blur'
          }],
          side: [{
            required: true,
            message: '1 卖 2买不能为空',
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
          dealAmount: [{
            required: true,
            message: '成交数量不能为空',
            trigger: 'blur'
          }],
          price: [{
            required: true,
            message: '成交均价不能为空',
            trigger: 'blur'
          }],
          orderStatus: [{
            required: true,
            message: '订单状态 2部分成交 1完全成交 0待成交 -1撤单不能为空',
            trigger: 'blur'
          }],
          isFirst: [{
            required: true,
            message: '是否是首单 1是 2尾单不能为空',
            trigger: 'blur'
          }],
          pid: [{
            required: true,
            message: '每次启动时候的UUID不能为空',
            trigger: 'blur'
          }],
          gmtCreate: [{
            required: true,
            message: '订单时间不能为空',
            trigger: 'blur'
          }]
        },
        queryTypeOptions: [{
            key: 'uid',
            display_name: 'UID'
          },

          {
            key: 'orderId',
            display_name: '订单ID'
          },
          {
            key: 'robotId',
            display_name: '机器人ID'
          },
          {
            key: 'market',
            display_name: '市场'
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
