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
      <el-select v-model="query.chain" clearable size="small" placeholder="公链" class="filter-item" style="width: 100px">
        <el-option v-for="item in dict.chain_type" :key="item.id" :label="item.label" :value="item.value" />
      </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title"
        width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="公链" prop="chain">
            <el-select v-model="form.chain" filterable placeholder="请选择" style="width: 172px;">
              <el-option v-for="item in dict.chain_type" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="配置名" prop="configName" >
            <el-input v-model="form.configName" style="width: 370px;"  :disabled="this.disabledValue"/>
          </el-form-item>
          <el-form-item label="配置值" prop="configValue">
            <el-input v-model="form.configValue" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="配置描述" prop="configRemark">
            <el-input v-model="form.configRemark" style="width: 370px;" />
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
        <el-table-column align="center" prop="configName" label="配置名" show-overflow-tooltip />
        <el-table-column align="center" prop="configValue" label="配置值" show-overflow-tooltip />
        <el-table-column align="center" prop="configRemark" label="配置描述" />
        <el-table-column align="center" width="135" prop="gmtCreate" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtCreate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','walletConfig:edit']" label="操作" width="80px" align="center">
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
  import crudConfig from '@/api/wallet/common/config/walletConfig'
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
    title: '波场配置',
    url: 'api/wallet/Config',
    sort: 'id,desc',
    crudMethod: { ...crudConfig,
    },
     query: { chain: 2 }
  })
  const defaultForm = {
    id: null,
    chain:2,
    configName: null,
    configValue: null,
    configRemark: null,
    status: null,
    createdBy: null,
    gmtCreate: null,
    updatedBy: null,
    gmtUpdated: null
  }
  export default {
    name: 'WalletConfig',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,

    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
     dicts: ['chain_type'],
    data() {
      return {
         disabledValue: true,
        permission: {
          add: [ 'admin','walletConfig:add'],
          edit: [ 'admin','walletConfig:edit'],
          del: [ 'walletConfig:del']
        },
        rules: {

chain: [{
            required: true,
            message: '公链不能为空',
            trigger: 'blur'
          }],
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

        },
        queryTypeOptions: [{
            key: 'configName',
            display_name: '配置名'
          },
          {
            key: 'configValue',
            display_name: '配置值'
          },
          {
            key: 'configRemark',
            display_name: '描述'
          },
        ],

      }
    },
    watch: {},
    methods: {

      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
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
