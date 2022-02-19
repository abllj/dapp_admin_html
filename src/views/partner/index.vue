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
        <date-range-picker v-model="query.gmtCreate" class="date-item" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title"
        width="600px">
        <el-form ref="form" :model="form" :inline="true" :rules="rules" size="small" label-width="80px">
          <el-form-item label="UID" prop="uid">
            <el-input v-model="form.uid" />
          </el-form-item>
          <el-form-item label="点卡金额" prop="salingAmount">
            <el-input v-model="form.salingAmount" />
          </el-form-item>
      <!--    <el-form-item label="已售点卡" prop="saledAmount">
            <el-input v-model="form.saledAmount" />
          </el-form-item> -->
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
         <el-table-column align="center" prop="id" label="ID" />
        <el-table-column align="center" prop="uid" label="所属用户" />
        <el-table-column align="center" prop="salingAmount" label="点卡金额" />
        <el-table-column align="center" prop="saledAmount" label="已售点卡" />
        <el-table-column align="center" width="135" prop="gmtCreate" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtCreate) }}</span>
          </template>
        </el-table-column>
<!--        <el-table-column v-if="checkPer(['admin','PartnerPoint:edit','PartnerPoint:del'])" label="操作" width="150px"
          align="center">
          <template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission" />
          </template>
        </el-table-column> -->
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
  import crudPartnerPoint from '@/api/partner/PartnerPoint.js'
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
    title: '合伙人仓位额度',
    url: 'api/PartnerPoint',
    sort: 'id,desc',
    crudMethod: { ...crudPartnerPoint
    }
  })
  const defaultForm = {
    id: null,
    uid: null,
    salingAmount: 0,
    saledAmount: 0,
    version: null,
    gmtCreate: null,
    gmtUpdated: null
  }
  export default {
    name: 'PartnerPoint',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
      DateRangePicker
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    data() {
      return {

        permission: {
          add: ['admin', 'PartnerPoint:add'],
          edit: [ 'PartnerPoint:edit'],
          del: [ 'PartnerPoint:del']
        },
        rules: {
          uid: [{
            required: true,
            message: '所属用户不能为空',
            trigger: 'blur'
          }],
          salingAmount: [{
            required: true,
            message: '可售点卡不能为空',
            trigger: 'blur'
          }],
          saledAmount: [{
            required: true,
            message: '已售点卡不能为空',
            trigger: 'blur'
          }],
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
        }]
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
