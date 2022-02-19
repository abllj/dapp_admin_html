<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
          <el-select v-model="query.chain" clearable size="small" placeholder="公链" class="filter-item" style="width: 100px">
            <el-option v-for="item in dict.chain_type" :key="item.id" :label="item.label" :value="item.value" />
          </el-select>
        <el-select v-model="query.status" clearable size="small" placeholder="是否执行" class="filter-item" style="width: 100px">
          <el-option v-for="item in dict.yes_no" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="query.taskType" clearable size="small" placeholder="类型" class="filter-item" style="width: 110px">
          <el-option v-for="item in dict.task_type" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
           <date-range-picker v-model="query.gmtCreate" class="date-item" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title"
        width="650px">
        <el-form ref="form" :model="form" :inline="true" :rules="rules" size="small" label-width="100px">
          <el-form-item label="公链" prop="chain">
            <el-select v-model="form.chain" filterable placeholder="请选择" style="width: 172px;">
              <el-option v-for="item in dict.chain_type" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="类型" prop="taskType">
            <el-select v-model="form.taskType" filterable placeholder="请选择" style="width: 172px;">
              <el-option v-for="item in dict.task_type" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="开始区块号" prop="beginNo" v-show="form.taskType==0">
            <el-input v-model="form.beginNo" />
          </el-form-item>
          <el-form-item label="结束区块号" prop="endNo" v-show="form.taskType==0">
            <el-input v-model="form.endNo" />
          </el-form-item>
          <el-form-item label="描述" prop="remark">
            <el-input :rows="5" v-model="form.remark" type="textarea" style="width: 300px;" />
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
        <el-table-column align="center" prop="chain" label="公链">
          <template slot-scope="scope">
            {{ dict.label.chain_type[scope.row.chain] }}
          </template>
        </el-table-column>

        <el-table-column align="center" prop="taskType" label="类型">
          <template slot-scope="scope">
            {{ dict.label.task_type[scope.row.taskType] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="remark" label="描述" show-overflow-tooltip />
        <el-table-column align="center" prop="beginNo" label="开始区块号" />
        <el-table-column align="center" prop="endNo" label="结束区块号" />
        <el-table-column align="center" prop="status" label="是否执行">
          <template slot-scope="scope">
            {{ dict.label.yes_no[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="135" prop="gmtCreate" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtCreate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','walletCollectTask:edit']" label="操作" width="80px"
          align="center">
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
  import crudCollectTask from '@/api/wallet/common/collectTask/walletCollectTask'
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
    title: '定时管理',
    url: 'api/CollectTask',
    sort: 'id,desc',
    crudMethod: { ...crudCollectTask
    }
  })
  const defaultForm = {
    id: null,
    chain: 2,
    taskType: 0,
    remark: null,
    beginNo: 0,
    endNo: 0,
    status: 0,
    gmtCreate: null,
    gmtUpdated: null
  }
  export default {
    name: 'WalletCollectTask',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
      DateRangePicker
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['yes_no', 'task_type','chain_type'],
    data() {
      return {

        permission: {
          add: ['admin', 'walletCollectTask:add'],
          edit: ['admin', 'walletCollectTask:edit'],
          del: [ 'walletCollectTask:del']
        },
        rules: {
        chain: [{
          required: true,
          message: '公链不能为空',
          trigger: 'blur'
        }],
          taskType: [{
            required: true,
            message: '类型不能为空',
            trigger: 'blur'
          }],
          remark: [{
            required: true,
            message: '描述不能为空',
            trigger: 'blur'
          }],
          beginNo: [{
            required: true,
            message: '开始区块不能为空',
            trigger: 'blur'
          }],
          endNo: [{
            required: true,
            message: '结束区块不能为空',
            trigger: 'blur'
          }],
          beginNo: [{
            required: true,
            message: '描述不能为空',
            trigger: 'blur'
          }],
        },
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
