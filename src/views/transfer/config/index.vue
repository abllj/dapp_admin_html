<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
    <!-- 搜索 -->
    <el-input v-model="query.currency" clearable placeholder="输入币种" style="width: 150px;" class="filter-item"
      @keyup.enter.native="crud.toQuery" />
    <el-select v-model="query.status" clearable size="small" placeholder="状态" class="filter-item" style="width: 120px">
      <el-option v-for="item in dict.ON_OFF" :key="item.id" :label="item.label" :value="item.value" />
    </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title"
        width="600px">
        <el-form ref="form" :model="form" :inline="true" :rules="rules" size="small" label-width="95px">
         <el-form-item label="币种" prop="currency">
           <el-input v-model="form.currency" />
         </el-form-item>
         <el-form-item label="币种名称" prop="currencyName">
           <el-input v-model="form.currencyName" />
         </el-form-item>
         <el-form-item label="手续费" prop="fee">
           <el-input v-model="form.fee" />
         </el-form-item>
         <el-form-item label="手续费币种" prop="feeCurrency">
           <el-input v-model="form.feeCurrency" />
         </el-form-item>
         <el-form-item label="是否百分比"prop="isPercentage">
           <el-select v-model="form.isPercentage" filterable placeholder="请选择" style="width: 172px;">
             <el-option v-for="item in dict.yes_no" :key="item.id" :label="item.label" :value="item.value" />
           </el-select>
         </el-form-item>
         <el-form-item label="每天次数" prop="limitNumDay">
           <el-input v-model="form.limitNumDay" />
         </el-form-item>
         <el-form-item label="最小提币量" prop="minAmount">
           <el-input v-model="form.minAmount" />
         </el-form-item>
         <el-form-item label="最大提币量" prop="maxAmount">
           <el-input v-model="form.maxAmount" />
         </el-form-item>

         <el-form-item label="开始时间" prop="startDate">
           <el-time-picker v-model="form.startDate" :picker-options="{
               selectableRange: '00:00:00 - 23:59:59',
             }"
             placeholder="选择时间" value-format="HH:mm:ss" style="width: 172px;">
           </el-time-picker>
         </el-form-item>
         <el-form-item label="结束时间" prop="endDate">
           <el-time-picker v-model="form.endDate" :picker-options="{
               selectableRange: '00:00:00 - 23:59:59',
             }"
             placeholder="选择时间" value-format="HH:mm:ss" style="width: 172px;">
           </el-time-picker>
         </el-form-item>
         <el-form-item label="状态" prop="status">
           <el-select v-model="form.status" filterable placeholder="请选择" style="width: 172px;">
             <el-option v-for="item in dict.ON_OFF" :key="item.id" :label="item.label" :value="item.value" />
           </el-select>
         </el-form-item>
         <el-form-item label="备注说明">
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
        <el-table-column align="center" prop="currency" label="币种" />
        <el-table-column align="center" prop="currencyName" label="名称" />
        <el-table-column align="center" prop="fee" label="手续费" />
        <el-table-column align="center" prop="feeCurrency" label="手续费币种" />
       <el-table-column align="center" prop="isPercentage" label="是否百分比" >
         <template slot-scope="scope">
             {{ dict.label.yes_no[scope.row.isPercentage] }}
           </template>
         </el-table-column>
       <el-table-column align="center" prop="status" label="状态">
         <template slot-scope="scope">
           {{ dict.label.ON_OFF[scope.row.status] }}
         </template>
       </el-table-column>
        <el-table-column align="center" prop="minAmount" label="最小划转量" />
        <el-table-column align="center" prop="maxAmount" label="最大划转量" />
        <el-table-column align="center" prop="limitNumDay" label="每天次数" />
        <el-table-column align="center" prop="startDate" label="开始时间" />
        <el-table-column align="center" prop="endDate" label="结束时间" />
        <el-table-column align="center" prop="remark" label="备注说明"  show-overflow-tooltip />
        <el-table-column align="center" width="135" prop="gmtCreate" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtCreate) }}</span>
          </template>
        </el-table-column>
        <el-table-column  v-if="checkPer(['admin','AppVersion:edit','AppVersion:del'])" label="操作" width="150px"
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
  import crudTransferConfig from '@/api/transfer/config/Config'
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
    title: '划转配置',
    url: 'api/TransferConfig',
    sort: 'id,desc',
    crudMethod: { ...crudTransferConfig
    }
  })
  const defaultForm = {
    id: null,
    currency: null,
    currencyName: null,
    fee: null,
    feeCurrency: null,
    isPercentage: null,
    status: null,
    minAmount: null,
    maxAmount: null,
    limitNumDay: null,
    startDate: null,
    endDate: null,
    remark: null,
    gmtCreate: null,
    gmtUpdated: null
  }
  export default {
    name: 'TransferConfig',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation

    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
     dicts: ['ON_OFF','yes_no'],
    data() {
      return {

        permission: {
          add: ['admin', 'TransferConfig:add'],
          edit: ['admin', 'TransferConfig:edit'],
          del: ['admin', 'TransferConfig:del']
        },
        rules: {
          currency: [{
            required: true,
            message: '币种不能为空',
            trigger: 'blur'
          }],
          currencyName: [{
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }],
          fee: [{
            required: true,
            message: '手续费不能为空',
            trigger: 'blur'
          }],
          feeCurrency: [{
            required: true,
            message: '手续费币种不能为空',
            trigger: 'blur'
          }],
          isPercentage: [{
            required: true,
            message: '描述不能为空',
            trigger: 'blur'
          }],
          status: [{
            required: true,
            message: '状态不能为空',
            trigger: 'blur'
          }],
          minAmount: [{
            required: true,
            message: '最小金额不能为空',
            trigger: 'blur'
          }],
          maxAmount: [{
            required: true,
            message: '最大不能为空',
            trigger: 'blur'
          }],
          limitNumDay: [{
            required: true,
            message: '划转次数不能为空',
            trigger: 'blur'
          }],
          startDate: [{
            required: true,
            message: '开始时间不能为空',
            trigger: 'blur'
          }],
          endDate: [{
            required: true,
            message: '结束时间不能为空',
            trigger: 'blur'
          }]
          
        },
        queryTypeOptions: [{
            key: 'currency',
            display_name: '币种'
          },
          {
            key: 'currencyName',
            display_name: '名称'
          },
          {
            key: 'status',
            display_name: '状态'
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
