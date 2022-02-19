<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.configName" clearable placeholder="输入配置名" style="width: 180px;" class="filter-item"
          @keyup.enter.native="crud.toQuery" />

        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title"
        width="600px">
        <el-form ref="form" :model="form" :inline="true" :rules="rules" size="small" label-width="80px">
          <el-form-item label="配置名" prop="configName" >
            <el-input v-model="form.configName"  style="width: 300px;" :disabled="form.id!=null"/>
          </el-form-item>
          <el-form-item label="配置值" prop="configValue" >
           <!-- <el-select v-model="form.configValue" filterable placeholder="请选择" style="width: 172px;" v-if="form.isPullDown==1">
              <el-option v-for="item in dict.yes_no" :key="item.id" :label="item.label" :value="'' + item.value" />
            </el-select> -->
            <el-input v-model="form.configValue" v-show="form.isPullDown!=1" />
          </el-form-item>
          <el-form-item label="配置描述" prop="configRemark">
            <el-input v-model="form.configRemark"  />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" filterable placeholder="请选择" style="width: 172px;">
              <el-option v-for="item in dict.yes_no" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        <!--  <el-form-item label="下拉框" prop="isPullDown">
            <el-select v-model="form.isPullDown" filterable placeholder="请选择" style="width: 172px;">
              <el-option v-for="item in dict.yes_no" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
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
        <el-table-column align="center" prop="configName" label="配置名" />
       <el-table-column align="center" prop="configValue" label="配置值" >
         <template slot-scope="scope">
<!--           <span v-if="crud.data[scope.$index].isPullDown ==1" >{{ dict.label.yes_no[scope.row.configValue] }}</span>
           <span v-else-if="crud.data[scope.$index].isPullDown !=1" >{{ scope.row.configValue }}</span> -->
           <span >{{ scope.row.configValue }}</span>
         </template>
       </el-table-column>
        <el-table-column align="center" prop="configRemark" label="配置描述" />
        <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
            {{ dict.label.yes_no[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="135" prop="gmtCreate" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtCreate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPer(['admin','Config:edit','Config:del'])" label="操作" width="150px" align="center">
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
  import crudConfig from "@/api/appConfig/config/Config"
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
    title: '系统配置',
    url: 'api/app/Config',
    sort: 'id,desc',
    crudMethod: { ...crudConfig
    }
  })
  const defaultForm = {
    id: null,
    configName: null,
    configValue: null,
    configRemark: null,
    status: 1,
    isPullDown:0,
    gmtCreate: null,
    gmtUpdated: null
  }
  export default {
    name: 'AppConfig',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
      DateRangePicker
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['yes_no'],
    data() {
      return {

        permission: {
          add: ['admin', 'AppConfig:add'],
          edit: ['admin', 'AppConfig:edit'],
          del: ['admin', 'AppConfig:del']
        },
        rules: {

          configName: [{
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }],
          configValue: [{
            required: true,
            message: '值不能为空',
            trigger: 'blur'
          }],
          configRemark: [{
            required: true,
            message: '描述不能为空',
            trigger: 'blur'
          }],
     status: [{
            required: true,
            message: '状态不能为空',
            trigger: 'blur'
          }],
          isPullDown: [{
                 required: true,
                 message: '是否下拉框不能为空',
                 trigger: 'blur'
               }],

        },

        queryTypeOptions: [{
          key: 'configName',
          display_name: '配置名'
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
