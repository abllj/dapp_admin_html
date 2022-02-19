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
        <el-select v-model="query.currency" clearable size="small" placeholder="币种" class="filter-item" style="width: 100px">
          <el-option v-for="item in dict.currency_type" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="query.status" clearable size="small" placeholder="状态" class="filter-item" style="width: 120px">
          <el-option v-for="item in dict.withdraw_status" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
           <date-range-picker v-model="query.gmtCreate" class="date-item" />

        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title"
        width="650px">
        <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="100px">
           <el-form-item label="UID" prop="uid" >
             <el-input v-model="form.uid" disabled/>
           </el-form-item>
           <el-form-item label="公链" prop="chainType" >
             <el-input v-model="form.chainType" disabled/>
           </el-form-item>
          <el-form-item label="申请数量" prop="amount" >
            <el-input v-model="form.amount"  disabled/>
          </el-form-item>
          <el-form-item label="实际提币数量" prop="realAmount">
            <el-input v-model="form.realAmount" disabled />
          </el-form-item>
          <el-form-item label="币种" prop="currency">
            <el-input v-model="form.currency" disabled />
          </el-form-item>
          <el-form-item label="手续费" prop="fee">
            <el-input v-model="form.fee" disabled />
          </el-form-item>
          <el-form-item label="手续费币种" prop="feeCurrency">
            <el-input v-model="form.feeCurrency" disabled />
          </el-form-item>
          <el-form-item label="状态" prop="status" >
            <el-select v-model="form.status" filterable placeholder="请选择"  >
              <el-option v-for="item in dict.withdraw_status" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="提币地址" prop="withdrawAddress"  >
            <el-input v-model="form.withdrawAddress" disabled  style="width: 300px;"/>
          </el-form-item>
          <el-form-item label="提币地址" prop="withdrawAddress"  >
            <vue-qr  text="form.withdrawAddress"  :size="180"></vue-qr>
          </el-form-item>
          <el-form-item label="处理说明" show-overflow-tooltip prop="remark">
            <el-input v-model="form.remark" />
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
        <el-table-column align="center" prop="uid" label="UID" fixed width="80px" />
        <el-table-column align="center" prop="chainType" label="公链" width="80px" />
        <el-table-column align="center" prop="currency" label="币种" width="80px">
          <template slot-scope="scope">
            {{ dict.label.currency_type[scope.row.currency] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="amount" label="申请数量" width="80px" />
        <el-table-column align="center" prop="fee" label="手续费" width="80px" />
        <el-table-column align="center" prop="feeCurrency" label="手续费币种" width="80px" />
        <el-table-column align="center" prop="realAmount" label="实际数量" width="80px" />
        <el-table-column align="center" prop="withdrawAddress" label="提币地址" show-overflow-tooltip>
             <template slot-scope="scope">
            <a :href="'https://tronscan.io/#/address/'+scope.row.withdrawAddress" target="_blank" v-if="crud.data[scope.$index].chainType == 'TRC20'">{{scope.row.withdrawAddress}}</a>
            <a :href="'https://cn.etherscan.com/address/'+scope.row.withdrawAddress" target="_blank" v-else-if="crud.data[scope.$index].chainType == 'ERC20'">{{scope.row.withdrawAddress}}</a>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="status" label="状态" width="80px">
          <template slot-scope="scope">
            {{ dict.label.withdraw_status[scope.row.status] }}
          </template>
        </el-table-column>

        <el-table-column align="center" prop="remark" label="处理说明" show-overflow-tooltip width="80px" />
        <!--       <el-table-column align="center" prop="motionHash" label="转账HASH" /> -->
        <el-table-column align="center" prop="adminName" label="操作人" width="80px" />
        <el-table-column align="center" width="135" prop="gmtCreate" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtCreate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPer(['admin','AppVersion:edit'])" label="操作" width="80px" align="center">
          <template slot-scope="scope" >
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
  import crudWithdraw from '@/api/withdraw/Withdraw'
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
  import vueQr from 'vue-qr'
  import DateRangePicker from "@/components/DateRangePicker"


  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: '提币管理',
    url: 'api/Withdraw',
    sort: 'id,desc',
    crudMethod: { ...crudWithdraw
    }
  })
  const defaultForm = {
    id: null,
    uid: null,
    chainType: null,
    currency: null,
    amount: null,
    fee: null,
    feeCurrency: null,
    realAmount: null,
    withdrawAddress: null,
    adminName: null,
    status: null,
    remark: null,
    motionHash: null,
    gmtCreate: null,
    gmtUpdated: null
  }

  export default {
    name: 'Withdraw',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
        vueQr,
           DateRangePicker,
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['withdraw_status', 'currency_type'],
    data() {
      return {
       imageUrl: require("@/assets/images/logo.png"),
        permission: {
          add: [ 'Withdraw:add'],
          edit: ['admin', 'Withdraw:edit'],
          del: [ 'Withdraw:del']
        },
        rules: {

          status: [{
            required: true,
            message: '状态不能为空',
            trigger: 'blur'
          }],
          remark: [{
            required: true,
            message: '描述不能为空',
            trigger: 'blur'
          }],
        },
        queryTypeOptions: [{
            key: 'uid',
            display_name: 'UID'
          },
          {
            key: 'chainType',
            display_name: '公链'
          },
          {
            key: 'withdrawAddress',
            display_name: '地址'
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



</style>
