<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 150px;" class="filter-item"
          @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-select v-model="query.chain" clearable size="small" placeholder="公链" class="filter-item" style="width: 100px">
          <el-option v-for="item in dict.chain_type" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="query.canRecharge" clearable size="small" placeholder="是否可充值" class="filter-item" style="width: 100px">
          <el-option v-for="item in dict.yes_no" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>

        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title"
        width="600px">
        <el-form ref="form" :model="form" :inline="true" :rules="rules" size="small" label-width="95px">
          <el-form-item label="公链" prop="chain">
            <el-select v-model="form.chain" filterable placeholder="请选择" style="width: 172px;">
              <el-option v-for="item in dict.chain_type" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="代币精度" prop="currencyDecimal">
            <el-input v-model="form.currencyDecimal" />
          </el-form-item>
          <el-form-item label="币种" prop="currency">
            <el-input v-model="form.currency"  />
          </el-form-item>
          <el-form-item label="货币名称" prop="currencyName">
            <el-input v-model="form.currencyName"  />
          </el-form-item>
          <el-form-item label="最小充值额" prop="minRecharge">
            <el-input v-model="form.minRecharge" />
          </el-form-item>
            <el-form-item label="是否可充值" prop="canRecharge">
              <el-select v-model="form.canRecharge" filterable placeholder="请选择" style="width: 172px;">
                <el-option v-for="item in dict.yes_no" :key="item.id" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          <el-form-item label="合约" prop="tokenAddr">
            <el-input v-model="form.tokenAddr" style="width: 370px;" />
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
        <el-table-column align="center" prop="currency" label="币种"  width="130px" />
        <el-table-column align="center" prop="currencyName" label="货币名称" width="130px"/>
        <el-table-column align="center" prop="minRecharge" label="最小充值额" width="130px"/>
        <el-table-column align="center" prop="chain" label="公链" width="130px">
          <template slot-scope="scope">
            {{ dict.label.chain_type[scope.row.chain] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="canRecharge" label="是否可充值" width="130px">
        <template slot-scope="scope">
            {{ dict.label.yes_no[scope.row.canRecharge] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="tokenAddr" label="合约" />
        <el-table-column align="center" prop="currencyDecimal" label="代币精度" width="130px"/>
        <el-table-column v-permission="['admin','walletCurrency:edit','walletCurrency:del']" label="操作" width="150px"
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
  import crudCurrency from '@/api/wallet/common/currency/walletCurrency'
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
    title: '币种管理',
    url: 'api/Currency',
    sort: 'id,desc',
    crudMethod: { ...crudCurrency
    }
  })
  const defaultForm = {
    id: null,
    currency: null,
    currencyName: null,
    minRecharge: 1,
    chain: 2,
    canRecharge: 1,
    tokenAddr: null,
    currencyDecimal: '1e18'
  }
  export default {
    name: 'WalletCurrency',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['chain_type','yes_no'],
    data() {
      return {

        permission: {
          add: ['admin', 'walletCurrency:add'],
          edit: ['admin', 'walletCurrency:edit'],
          del: ['admin', 'walletCurrency:del']
        },
        rules: {
          currency: [{
            required: true,
            message: '币种不能为空',
            trigger: 'blur'
          }],
          currencyName: [{
            required: true,
            message: '货币名称不能为空',
            trigger: 'blur'
          }],
          minRecharge: [{
            required: true,
            message: '最小充值额不能为空',
            trigger: 'blur'
          }],
          chain: [{
            required: true,
            message: '公链不能为空',
            trigger: 'blur'
          }],
          canRecharge: [{
            required: true,
            message: '是否可充值不能为空',
            trigger: 'blur'
          }],
          tokenAddr: [{
            required: true,
            message: '合约地址不能为空',
            trigger: 'blur'
          }],
          currencyDecimal: [{
            required: true,
            message: '代币精度不能为空',
            trigger: 'blur'
          }]
        },
        queryTypeOptions: [{
            key: 'currency',
            display_name: '币种'
          },
          {
            key: 'currencyName',
            display_name: '货币名称'
          },
          {
            key: 'tokenAddr',
            display_name: '合约地址'
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
