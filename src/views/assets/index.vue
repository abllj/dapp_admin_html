<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.uid" clearable placeholder="输入UID" style="width: 180px;" class="filter-item"
          @keyup.enter.native="crud.toQuery" />

        <el-select v-model="query.currency" clearable size="small" placeholder="选择币种" class="filter-item" style="width: 130px">
          <el-option v-for="item in dict.currency_type" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
       <date-range-picker v-model="query.gmtCreate" class="date-item" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title"
        width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="UID"  prop="uid">
            <el-input v-model="form.uid" style="width: 370px;" :disabled="this.disabledValue" />
          </el-form-item>
          <el-form-item label="币种" prop="currency">
            <el-select v-model="form.currency" filterable placeholder="请选择"  :disabled="this.disabledValue">
              <el-option v-for="item in dict.currency_type" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="余额" prop="balance">
            <el-input v-model="form.balance" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="冻结资产" prop="frozenBalance">
            <el-input v-model="form.frozenBalance" style="width: 370px;" />
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
        <el-table-column align="center"  prop="uid" label="UID" />
        <el-table-column align="center" prop="currency" label="币种">
          <template slot-scope="scope">
            {{ dict.label.currency_type[scope.row.currency] }}
          </template>
        </el-table-column>
        <el-table-column align="center"  prop="balance" label="余额" />
        <el-table-column align="center"  prop="frozenBalance" label="冻结资产" />
        <el-table-column align="center" width="135"  prop="gmtCreate" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtCreate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','MemberWallet:edit','MemberWallet:del']" label="操作" width="150px" align="center">
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
  import crudMemberWallet from '@/api/assets/MemberWallet'
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
    title: '会员资产',
    url: 'api/MemberWallet',
    sort: 'id,desc',
    crudMethod: { ...crudMemberWallet
    }
  })
  const defaultForm = {
    id: null,
    uid: null,
    currency: "USDT",
    balance: 0,
    frozenBalance: 0,
    version: null,
    gmtCreate: null,
    gmtUpdated: null
  }
  export default {
    name: 'MemberWallet',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
      DateRangePicker

    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['currency_type'],
    data() {
      return {
        disabledValue: true,
        permission: {
          add: ['admin', 'MemberWallet:add'],
          edit: ['admin', 'MemberWallet:edit'],
             del: [ '','MemberWalletLog:del']
        },
        rules: {
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
          balance: [{
            required: true,
            message: '可用资产不能为空',
            trigger: 'blur'
          }],
          frozenBalance: [{
            required: true,
            message: '冻结资产不能为空',
            trigger: 'blur'
          }],

        },
        queryTypeOptions: [{
            key: 'uid',
            display_name: 'UID'
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
      [CRUD.HOOK.afterToCU](crud, form) {
        if(form.id==null){
           this.disabledValue=false;
        }else{
          this.disabledValue=true;
        }


      },
    }
  }
</script>

<style scoped>

</style>
