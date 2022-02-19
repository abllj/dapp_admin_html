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
        <el-select v-model="query.rechargeType" clearable size="small" placeholder="充值类型" class="filter-item" style="width: 120px">
          <el-option v-for="item in dict.recharge_type" :key="item.id" :label="item.label" :value="item.value" />
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
          <el-form-item label="UID" prop="memberId">
            <el-input v-model="form.memberId" style="width: 185px;"  />
          </el-form-item>
          <el-form-item label="币种" prop="currency">
            <el-select v-model="form.currency" filterable placeholder="请选择">
              <el-option v-for="item in dict.currency_type" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="充值类型" prop="rechargeType" >
            <el-select v-model="form.rechargeType" filterable placeholder="请选择" disabled>
              <el-option v-for="item in dict.recharge_type" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="充币数量" prop="amount">
            <el-input v-model="form.amount" style="width: 185px;" />
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
        <el-table-column align="center" prop="memberId" label="UID"  width="105px"/>
        <el-table-column align="center" prop="chainType" label="公链" width="105px"/>
        <el-table-column align="center" prop="rechargeType" label="充值类型" width="105px">
          <template slot-scope="scope">
            {{ dict.label.recharge_type[scope.row.rechargeType] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="currency" label="币种" width="105px">
          <template slot-scope="scope">
            {{ dict.label.currency_type[scope.row.currency] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="amount" label="充币数量"width="105px" />
        <el-table-column align="center" prop="address" label="充币地址" >
        <template slot-scope="scope"   >
           <a :href="'https://tronscan.io/#/address/'+scope.row.address" target="_blank" v-if="crud.data[scope.$index].rechargeType == 0 && crud.data[scope.$index].chainType == 'TRX'">{{scope.row.address}}</a>
          <a :href="'https://cn.etherscan.com/address/'+scope.row.address" target="_blank" v-if="crud.data[scope.$index].rechargeType == 0 && crud.data[scope.$index].chainType == 'ETH'">{{scope.row.address}}</a>
          <span v-else-if="crud.data[scope.$index].rechargeType == 1">{{scope.row.address}}</span>
        </template>
        </el-table-column>
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
  import crudRecharge from '@/api/recharge/Recharge'
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
    title: '充值管理',
    url: 'api/Recharge',
    sort: 'id,desc',
    crudMethod: { ...crudRecharge
    }
  })
  const defaultForm = {
    id: null,
    memberId: null,
    chainType: null,
    rechargeType: 1,
    currency: 'USDT',
    amount: 0,
    address: null,
    status: null,
    gmtCreate: null,
    gmtUpdated: null
  }
  export default {
    name: 'Recharge',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
      DateRangePicker
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['recharge_type', 'currency_type'],
    data() {
      return {

        permission: {
          add: ['admin', 'Recharge:add'],
          edit: [ 'Recharge:edit'],
          del: [ 'Recharge:del']
        },
        rules: {
          memberId: [{
            required: true,
            message: 'UID不能为空',
            trigger: 'blur'
          }],
          currency: [{
            required: true,
            message: '币种不能为空',
            trigger: 'blur'
          }],
          amount: [{
            required: true,
            message: '数量不能为空',
            trigger: 'blur'
          }],

        },
        queryTypeOptions: [{
            key: 'memberId',
            display_name: 'UID'
          },
          {
            key: 'chainType',
            display_name: '公链'
          },
          {
            key: 'address',
            display_name: '地址'
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
      [CRUD.HOOK.afterToCU](crud, form) {

      },
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
