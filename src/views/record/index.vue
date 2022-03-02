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
        <el-select v-model="query.recordType" clearable size="small" placeholder="类型" class="filter-item" style="width: 120px">
          <el-option v-for="item in dict.record_type" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
        <date-range-picker v-model="query.gmtCreate" class="date-item" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />

      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
        @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column align="center" prop="id" label="id" width="50"/>
        <el-table-column align="center" prop="uid" label="UID" />
        <el-table-column align="center" prop="fromUid" label="FROMUID" />
        <el-table-column align="center" prop="amount" label="金额" />
        <el-table-column align="center" prop="currency" label="币种" />

        <el-table-column align="center" prop="recordType" label="类型">
          <template slot-scope="scope">
            {{ dict.label.record_type[scope.row.recordType] }}
          </template>
        </el-table-column>
<el-table-column align="center" prop="comment" label="描述" />
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
    import crudReleaseRecord from "@/api/record/releaseRecord.js"
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
    title: 'record',
    url: 'api/releaseRecord',
    sort: 'id,desc',
    crudMethod: {
      ...crudReleaseRecord
    }
  })
  const defaultForm = {
    id: null,
    uid: null,
    fromUid: null,
    userChangeId: null,
    fromUserChangeId: null,
    amount: null,
    beforeAmount: null,
    afterAmount: null,
    rate: null,
    currency: null,
    comment: null,
    recordType: null,
    partnerNum: null,
    inviteStatus: null,
    teamStatus: null,
    gmtCreate: null,
    gmtUpdated: null
  }
  export default {
    name: 'ReleaseRecord',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
      DateRangePicker
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['record_type'],
    data() {
      return {

        permission: {
          add: [ 'releaseRecord:add'],
          edit: [ 'releaseRecord:edit'],
          del: [ 'releaseRecord:del']
        },
        rules: {
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
            key: 'uid',
            display_name: 'UID'
          },
          {
            key: 'fromUid',
            display_name: 'FROMUID'
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
