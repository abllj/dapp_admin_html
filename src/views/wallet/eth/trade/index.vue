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
        <el-select v-model="query.status" clearable size="small" placeholder="状态" class="filter-item" style="width: 100px">
          <el-option v-for="item in dict.trade_status" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
        <date-range-picker v-model="query.gmtCreate" class="date-item" />

        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title"
        width="600px">
        <el-form ref="form" :model="form" :inline="true" :rules="rules" size="small" label-width="80px">
          <el-table-column type="selection" width="45" />
          <el-form-item label="UID" prop="uid">
            <el-input v-model="form.userId" style="width: 150px;" disabled />
          </el-form-item>
          <el-form-item label="区块号">
            <el-input v-model="form.blockNo" style="width: 150px;" disabled />
          </el-form-item>
          <el-form-item label="转入地址">
            <el-input v-model="form.fromAddr" style="width: 395px;" disabled />
          </el-form-item>
          <el-form-item label="接受地址">
            <el-input v-model="form.toAddr" style="width: 395px;" disabled />
          </el-form-item>
          <el-form-item label="币种" prop="currency">
            <el-input v-model="form.currency" style="width: 150px;" disabled />
          </el-form-item>

          <el-form-item label="数量" prop="amount">
            <el-input v-model="form.amount" style="width: 150px;" disabled />
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" filterable placeholder="请选择" style="width: 172px;">
              <el-option v-for="item in dict.trade_status" :key="item.id" :label="item.label" :value="item.value" />
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
        <el-table-column type="selection" width="45" />
        <el-table-column align="center" prop="userId" label="UID" />
        <el-table-column align="center" prop="blockNo" label="区块号" />
        <el-table-column align="center" prop="transactionHash" label="交易哈希值" show-overflow-tooltip />
        <el-table-column align="center" prop="fromAddr" label="转入地址" show-overflow-tooltip>
          <template slot-scope="scope">
            <a :href="'https://cn.etherscan.com/address/'+scope.row.fromAddr" target="_blank" style="color: #0066CC;">{{scope.row.fromAddr}}</a>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="toAddr" label="转入地址" show-overflow-tooltip>
          <template slot-scope="scope">
            <a :href="'https://cn.etherscan.com/address/'+scope.row.toAddr" target="_blank" style="color: #0066CC;">{{scope.row.fromAddr}}</a>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="currency" label="币种" />
        <el-table-column align="center" prop="amount" label="数量" />
        <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
            {{ dict.label.trade_status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="collectHash" label="归集HASH" show-overflow-tooltip>
          <template slot-scope="scope">
            <a :href="'https://cn.etherscan.com/tx/'+scope.row.collectHash" target="_blank" style="color: #0066CC;">{{scope.row.collectHash}}</a>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="comment" label="描述" show-overflow-tooltip />
        <el-table-column align="center" prop="adminName" label="审核人" />
        <el-table-column align="center" width="135" prop="gmtCreate" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtCreate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPer(['admin','EthTrade:edit'])" label="操作" width="80px" align="center">
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
  import crudEthTrade from '@/api/wallet/eth/trade/EthTrade'
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
    title: '以太坊交易',
    url: 'api/EthTrade',
    sort: 'id,desc',
    crudMethod: { ...crudEthTrade
    }
  })
  const defaultForm = {
    id: null,
    blockHash: null,
    blockNo: null,
    fromAddr: null,
    transactionHash: null,
    inputData: null,
    toAddr: null,
    token: null,
    currency: null,
    amount: null,
    tradeAmount: null,
    timestamp: null,
    userId: null,
    status: null,
    adminName: null,
    collectHash: null,
    comment: null,
    gmtCreate: null,
    gmtUpdated: null
  }
  export default {
    name: 'EthTrade',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
      DateRangePicker
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['trade_status'],
    data() {
      return {
        permission: {
          add: ['EthTrade:add'],
          edit: ['admin', 'EthTrade:edit'],
          del: ['EthTrade:del']
        },
        rules: {
          status: [{
            required: true,
            message: '状态不能为空',
            trigger: 'blur'
          }],
          amount: [{
            required: true,
            message: '数量不能为空',
            trigger: 'blur'
          }],
          uid: [{
            required: true,
            message: 'UID不能为空',
            trigger: 'blur'
          }],
          currency: [{
            required: true,
            message: '币种不能为空',
            trigger: 'blur'
          }],
        },
        queryTypeOptions: [{
            key: 'userId',
            display_name: 'UID'
          },
          {
            key: 'transactionHash',
            display_name: '交易ID'
          },
          {
            key: 'fromAddr',
            display_name: '转入地址'
          },
          {
            key: 'toAddr',
            display_name: '接受地址'
          },
          {
            key: 'collectHash',
            display_name: '归集ID'
          },
          {
            key: 'currency',
            display_name: '币种'
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
