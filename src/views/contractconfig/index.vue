<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.title" clearable placeholder="输入标题搜索内容" style="width: 150px;" class="filter-item"
          @keyup.enter.native="crud.toQuery" />
        <date-range-picker v-model="query.gmtCreate" class="date-item" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
        :title="crud.status.title" width="800px">
        <el-form ref="form" :model="form" :inline="true" :rules="rules" size="small" label-width="80px">
          <el-form-item label="链类型">
            <el-input v-model="form.chain" />
          </el-form-item>
          <el-form-item label="合约地址">
            <el-input v-model="form.contractAddress" />
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="form.contractName" />
          </el-form-item>
          <el-form-item label="abi文本">
            <el-input v-model="form.abiText"  type="textarea" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="合约状态">
            <el-select v-model="form.status" filterable placeholder="请选择">
              <el-option v-for="item in dict.ON_OFF" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="合约精度">
            <el-input v-model="form.decimals" />
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
        <el-table-column align="center" prop="id" label="主键ID" width="70"/>
        <el-table-column align="center" prop="chain" label="链类型" />
        <el-table-column align="center" prop="contractAddress" label="合约地址" show-overflow-tooltip/>
        <el-table-column align="center" prop="contractName" label="名称" />
        <el-table-column align="center" prop="abiText" label="abi文本" show-overflow-tooltip/>
        <el-table-column align="center" prop="name" label="备注" />
        <el-table-column align="center" prop="status" label="合约状态">
          <template slot-scope="scope">
            {{ dict.label.ON_OFF[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="decimals" label="合约精度" />
        <el-table-column align="center" width="135" prop="gmtCreate" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtCreate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPer(['admin','contractConfig:edit','contractConfig:del'])" label="操作" width="150px"
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
    import crudContractConfig from "@/api/contractconfig/contractConfig.js"
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
    title: 'contractConfig',
    url: 'api/contractConfig',
    sort: 'id,desc',
    crudMethod: {
      ...crudContractConfig
    }
  })
  const defaultForm = {
    id: null,
    chain: null,
    contractAddress: null,
    contractName: null,
    abiText: null,
    name: null,
    status: null,
    decimals: null,
    gmtCreate: null,
    gmtUpdated: null
  }
  export default {
    name: 'ContractConfig',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
      DateRangePicker
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['ON_OFF'],
    data() {
      return {

        permission: {
          add: ['admin', 'contractConfig:add'],
          edit: ['admin', 'contractConfig:edit'],
          del: ['admin', 'contractConfig:del']
        },
        rules: {}
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
