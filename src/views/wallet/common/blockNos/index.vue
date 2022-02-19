<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.currency" clearable placeholder="输入公链" style="width: 150px;" class="filter-item"
          @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title"
        width="600px">
        <el-form ref="form" :model="form" :inline="true" :rules="rules" size="small" label-width="95px">

          <el-form-item label="当前区块" prop="chainNo">
            <el-input v-model="form.chainNo"  />
          </el-form-item>
          <el-form-item label="最新区块号" prop="newestBlockNo">
            <el-input v-model="form.newestBlockNo"  />
          </el-form-item>
          <el-form-item label="同步状态" prop="syncStatus">
            <el-input v-model="form.syncStatus" />
          </el-form-item>
          <el-form-item label="归集状态" prop="gatherStatus">
            <el-input v-model="form.gatherStatus"  />
          </el-form-item>
          <el-form-item label="公链" prop="currency">
            <el-input v-model="form.currency"  />
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
        <el-table-column align="center" prop="currency" label="公链" />
        <el-table-column align="center" prop="chainNo" label="当前区块" />
        <el-table-column align="center" prop="newestBlockNo" label="最新区块号" />
        <el-table-column align="center" prop="syncStatus" label="同步状态" />
        <el-table-column align="center" prop="gatherStatus" label="归集状态" />
        <el-table-column align="center" width="135" prop="gmtCreate" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtCreate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','walletBlockNos:edit','walletBlockNos:del']" label="操作" width="150px"
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
  import crudBlockNos from '@/api/wallet/common/blockNos/walletBlockNos'
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




  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: '区块管理',
    url: 'api/BlockNos',
    sort: 'id,desc',
    crudMethod: { ...crudBlockNos
    }
  })
  const defaultForm = {
    id: null,
    currency: null,
    chainNo: null,
    newestBlockNo: null,
    syncStatus: null,
    gatherStatus: null,
    gmtCreate: null,
    gmtUpdated: null
  }
  export default {
    name: 'WalletBlockNos',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    data() {
      return {

        permission: {
          add: ['admin', 'walletBlockNos:add'],
          edit: ['admin', 'walletBlockNos:edit'],
          del: [ 'admin','walletBlockNos:del']
        },
        rules: {
          currency: [{
            required: true,
            message: '公链不能为空',
            trigger: 'blur'
          }],
          chainNo: [{
            required: true,
            message: '当前区块不能为空',
            trigger: 'blur'
          }],
          newestBlockNo: [{
            required: true,
            message: '最新区块不能为空',
            trigger: 'blur'
          }],
          syncStatus: [{
            required: true,
            message: '同步状态不能为空',
            trigger: 'blur'
          }],
          gatherStatus: [{
            required: true,
            message: '归集状态不能为空',
            trigger: 'blur'
          }],

        },
        queryTypeOptions: [

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
