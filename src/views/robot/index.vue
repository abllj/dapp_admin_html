<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
     <el-input v-model="query.name" clearable placeholder="输入搜索内容" style="width: 150px;" class="filter-item"
       @keyup.enter.native="crud.toQuery" />
       <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 100px">
         <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
       </el-select>
        <el-select v-model="query.platform" clearable size="small" placeholder="平台" class="filter-item" style="width: 120px">
          <el-option v-for="item in dict.quant_platform" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
       <el-select v-model="query.marketId" clearable size="small" placeholder="交易对" class="filter-item" style="width: 150px">
          <el-option v-for="item in spotMarkets" :key="item.id" :label="item.marketName" :value="item.id" />
        </el-select>
        <el-select v-model="query.type" clearable size="small" placeholder="类型" class="filter-item" style="width: 120px">
          <el-option v-for="item in dict.market_type" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="query.recycleStatus" clearable size="small" placeholder="交易策略" class="filter-item" style="width: 120px">
          <el-option v-for="item in dict.robot_recycle" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="query.status" clearable size="small" placeholder="状态" class="filter-item" style="width: 120px">
          <el-option v-for="item in dict.ON_OFF" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
           <date-range-picker v-model="query.gmtCreate" class="date-item" />

        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title"
        width="600px">
        <el-form ref="form" :model="form" :inline="true" :rules="rules" size="small" label-width="80px">
          <el-form-item label="UID">
            <el-input v-model="form.uid" disabled />
          </el-form-item>
          <el-form-item label="平台">
            <el-select v-model="form.platform" filterable placeholder="请选择"  disabled>
              <el-option v-for="item in dict.quant_platform" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="交易对">
            <el-select v-model="form.marketId" filterable placeholder="请选择"  disabled style="width: 172px;">
                <el-option v-for="item in spotMarkets" :key="item.id" :label="item.marketName" :value="item.id" />
              </el-select>
          </el-form-item>
          <el-form-item label="交易策略">
            <el-select v-model="form.recycleStatus" filterable placeholder="请选择" >
              <el-option v-for="item in dict.robot_recycle" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="form.status" filterable placeholder="请选择"  style="width: 172px;">
              <el-option v-for="item in dict.ON_OFF" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="停止补仓">
            <el-select v-model="form.stopStatus" filterable placeholder="请选择"  >
              <el-option v-for="item in dict.yes_no" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
        @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column align="center" prop="id" label="机器人ID" show-overflow-tooltip/>
        <el-table-column align="center" prop="uid" label="UID" fixed/>
         <el-table-column align="center" prop="cdkeyId" label="仓位ID" />
        <el-table-column align="center" prop="platform" label="平台">
          <template slot-scope="scope">
            {{ dict.label.quant_platform[scope.row.platform] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="type" label="类型">
          <template slot-scope="scope">
            {{ dict.label.market_type[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="marketId" label="交易市场" >
         <template slot-scope="scope">
                <span  >{{ spotMarkets[scope.row.marketId].marketName}}</span>
          </template>
        </el-table-column>
   <!--     <el-table-column align="center" prop="valuesStr" label="机器人运行时变量" show-overflow-tooltip/> -->
        <el-table-column align="center" prop="recycleStatus" label="交易策略" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ dict.label.robot_recycle[scope.row.recycleStatus] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="showMsg" label="机器人信息" show-overflow-tooltip/>
        <el-table-column align="center" prop="revenue" label="更新收益" />
        <el-table-column align="center" prop="gridRevenue" label="网格收益" />

        <el-table-column align="center" prop="isClean" label="清仓卖出" >
          <template slot-scope="scope">
            {{ dict.label.yes_no[scope.row.isClean] }}
          </template>
          </el-table-column>
        <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
            {{ dict.label.ON_OFF[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="135" prop="gmtCreate" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtCreate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPer(['admin','quantRobot:edit'])" label="操作" width="80px" align="center">
          <template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission" />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
  import crudRobot from '@/api/robot/Robot.js'
   import spotMarket from '@/api/third/market/SpotMarket'
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
    title: '机器人列表',
    url: 'api/Robot',
    sort: 'id,desc',
    crudMethod: { ...crudRobot
    }
  })
  const defaultForm = {
    id: null,
    uid: null,
    platform: null,
    type: null,
    marketId: null,
    valuesStr: null,
    recycleStatus: null,
    showMsg: null,
    revenue: null,
    isClean: null,
    status: null,
    gmtCreate: null,
    gmtUpdated: null,
  }
  export default {
    name: 'QuantRobot',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
      DateRangePicker,

    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['quant_platform', 'market_type', 'robot_recycle', 'ON_OFF','yes_no'],
    data() {
      return {
    spotMarkets: {},
        permission: {
          add: ['quantRobot:add'],
          edit: ['admin', 'quantRobot:edit'],
          del: ['quantRobot:del']
        },
        rules: {},
        queryTypeOptions: [{
            key: 'uid',
            display_name: 'UID'
          },
          {
            key: 'cdkeyId',
            display_name: '仓位ID'
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
      spotMarket.queryMarketAll().then(res => {
            res.forEach(d => {
              this.spotMarkets[d.id]=d;
            })
        })
        return true
      }, // 新增与编辑前做的操作
      [CRUD.HOOK.afterToCU](crud, form) {},
    }
  }
</script>

<style scoped>

</style>
