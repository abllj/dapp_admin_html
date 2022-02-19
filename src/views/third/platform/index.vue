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
        <el-select v-model="query.status" clearable size="small" placeholder="状态" class="filter-item" style="width: 120px">
          <el-option v-for="item in dict.platform_status" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title"
        width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="平台名称" prop="platform">
            <el-input v-model="form.platform" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="class" prop="invokeClass">
            <el-input v-model="form.invokeClass" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="显示名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" filterable placeholder="请选择">
              <el-option v-for="item in dict.platform_status" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="图标" prop="icon" style="width: 100px;">
            <oss-upload v-model="form.icon" style="width: 100px;" />
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
        <el-table-column align="center" prop="icon" label="图标" />
        <el-table-column align="center" prop="platform" label="平台名称" />
        <el-table-column align="center" prop="invokeClass" label="class" />
        <el-table-column align="center" prop="name" label="显示名称" />
        <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
            {{ dict.label.platform_status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column v-if="checkPer(['admin','quantThirdApi:edit','quantThirdApi:del'])" label="操作" width="150px"
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
  import crudThirdPlatform from '@/api/third/platform/ThirdPlatform'
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
  import ossUpload from '@/components/oss-upload/image.vue'
  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: '第三方平台',
    url: 'api/ThirdPlatform',
    sort: 'id,desc',
    crudMethod: { ...crudThirdPlatform
    }
  })
  const defaultForm = {
    id: null,
    platform: null,
    invokeClass: null,
    name: null,
    icon: null,
    status: null
  }
  export default {
    name: 'ThirdPlatform',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
      ossUpload
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['platform_status'],
    data() {
      return {

        permission: {
          add: ['admin', 'ThirdPlatform:add'],
          edit: ['admin', 'ThirdPlatform:edit'],
          del: ['admin', 'ThirdPlatform:del']
        },
        rules: {
          platform: [{
            required: true,
            message: '平台名称不能为空',
            trigger: 'blur'
          }],
          invokeClass: [{
            required: true,
            message: 'class不能为空',
            trigger: 'blur'
          }],
          name: [{
            required: true,
            message: '显示名称不能为空',
            trigger: 'blur'
          }],
          status: [{
            required: true,
            message: '状态名称不能为空',
            trigger: 'blur'
          }]
        },
        queryTypeOptions: [{
            key: 'platform',
            display_name: '平台名称'
          },
          {
            key: 'name',
            display_name: '显示名称'
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
