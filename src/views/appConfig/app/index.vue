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
        width="500px">
        <el-form ref="form" :model="form"  :rules="rules" size="small" label-width="80px">
          <el-form-item label="系统" prop="client">
            <el-select v-model="form.client" filterable placeholder="请选择">
              <el-option v-for="item in dict.app_type" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="Code" prop="code">
            <el-input v-model="form.code" style="width: 350px;" />
          </el-form-item>
          <el-form-item label="version" prop="version">
            <el-input v-model="form.version" style="width: 350px;" />
          </el-form-item>
          <el-form-item label="URL" prop="url">
          <oss-upload v-model="form.url"  :value="form.url"   style="width: 300px;"/>
          </el-form-item>
          <el-form-item label="描述" prop="describe">
             <el-input :rows="5" v-model="form.describe" type="textarea" style="width: 350px;" />
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
        <el-table-column align="center" prop="client" label="系统">
          <template slot-scope="scope">
            {{ dict.label.app_type[scope.row.client] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="code" label="Code" />
        <el-table-column align="center" prop="version" label="version" />
        <el-table-column align="center" prop="url" label="URL" show-overflow-tooltip />
        <el-table-column align="center" prop="describe" label="描述" />
        <el-table-column align="center" width="135" prop="gmtCreate" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtCreate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPer(['admin','AppVersion:edit','AppVersion:del'])" label="操作" width="150px" align="center">
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
  import crudAppVersion from "@/api/appConfig/app/AppVersion"
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
 import ossUpload from '@/components/oss-upload/app.vue'
  import DateRangePicker from "@/components/DateRangePicker"

  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: 'APP管理',
    url: 'api/AppVersion',
    sort: 'id,desc',
    crudMethod: { ...crudAppVersion
    }
  })
  const defaultForm = {
    id: null,
    client: 'android',
    code: null,
    version: null,
    url: null,
    describe: null,
    gmtCreate: null,
    gmtUpdated: null
  }
  export default {
    name: 'AppVersion',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
      ossUpload,
      DateRangePicker,
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['app_type'],
    data() {
      return {

        permission: {
          add: ['admin', 'AppVersion:add'],
          edit: ['admin', 'AppVersion:edit'],
          del: ['admin', 'AppVersion:del']
        },
        rules: {
          client: [{
            required: true,
            message: '系统',
            trigger: 'blur'
          }],
          code: [{
            required: true,
            message: 'Code不能为空',
            trigger: 'blur'
          }],
          version: [{
            required: true,
            message: 'version不能为空',
            trigger: 'blur'
          }],
          url: [{
            required: true,
            message: 'URL不能为空',
            trigger: 'blur'
          }],
          describe: [{
            required: true,
            message: '描述不能为空',
            trigger: 'blur'
          }]
        },
        queryTypeOptions: [{
            key: 'code',
            display_name: 'Code'
          },
          {
            key: 'describe',
            display_name: '描述'
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
