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
        <el-table-column align="center" prop="uid" label="用户ID" width="80px" />
        <el-table-column align="center" prop="platform" label="平台" width="80px">
          <template slot-scope="scope">
            {{ dict.label.quant_platform[scope.row.platform] }}
          </template>
        </el-table-column>
    <el-table-column align="center" prop="type" label="类型">
      <template slot-scope="scope">
        {{ dict.label.market_type[scope.row.type] }}
      </template>
    </el-table-column>
        <el-table-column align="center" prop="robotId" label="机器人ID" show-overflow-tooltip />
        <el-table-column align="center" prop="content" label="日志内容" show-overflow-tooltip />
        <el-table-column align="center" prop="comment" label="错误日志" show-overflow-tooltip />
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
  import crudRobotLog from '@/api/robot/log/RobotLog.js'
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
    title: '机器人日志',
    url: 'api/RobotLog',
    sort: 'id,desc',
    crudMethod: { ...crudRobotLog
    }
  })
  const defaultForm = {
    id: null,
    uid: null,
    platform: null,
    type: null,
    robotId: null,
    content: null,
    comment: null,
    gmtCreate: null
  }
  export default {
    name: 'RobotLog',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
DateRangePicker
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['quant_platform', 'market_type'],
    data() {
      return {

        permission: {
          add: ['RobotLog:add'],
          edit: ['RobotLog:edit'],
          del: [ 'RobotLog:del']
        },
        rules: {},
        queryTypeOptions: [{
            key: 'uid',
            display_name: 'UID'
          },
          {
            key: 'robotId',
            display_name: '机器人ID'
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
