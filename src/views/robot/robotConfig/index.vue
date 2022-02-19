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
        <el-select v-model="query.parentId" clearable size="small" placeholder="平台" class="filter-item" style="width: 120px">
          <el-option v-for="item in platforms" :key="item.id" :label="item.content" :value="item.id" />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title"
        width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="平台" prop="parentId">
            <el-select v-model="form.parentId" filterable placeholder="请选择" style="width: 172px;">
              <el-option v-for="item in this.platforms" :key="item.id" :label="item.content" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="字典名称" prop="configName">
            <el-input v-model="form.configName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="描述" prop="content">
            <el-input v-model="form.content" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="字典值" prop="configValue"   v-if="form.parentId!=0" >
            <el-input v-model="form.configValue" style="width: 370px;"   />
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
        <el-table-column align="center" prop="configName" label="字典名称" />
        <el-table-column align="center" prop="content" label="描述" />
        <el-table-column align="center" prop="configValue" label="字典值" />
        <el-table-column align="center" width="135" prop="gmtCreate" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtCreate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','RobotConfig:edit','RobotConfig:del']" label="操作" width="150px" align="center">
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
  import crudRobotConfig from '@/api/robot/robotConfig/RobotConfig.js'
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
    title: '机器人配置',
    url: 'api/RobotConfig',
    sort: 'id,desc',
    crudMethod: { ...crudRobotConfig
    },
      query: { parentId: 1 }
  })
  const defaultForm = {
    id: null,
    parentId: 0,
    configName: null,
    content: null,
    configValue: null,
    gmtCreate: null,
    gmtUpdated: null
  }
  export default {
    name: 'RobotConfig',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    data() {
      return {
        platforms: {
          0:{
            id:0,
            content:'顶级父类'
          }
        },
        permission: {
          add: ['admin', 'RobotConfig:add'],
          edit: ['admin', 'RobotConfig:edit'],
          del: ['admin', 'RobotConfig:del']
        },
        rules: {
          parentId: [{
            required: true,
            message: '字典类型不能为空',
            trigger: 'blur'
          }],
          configName: [{
            required: true,
            message: '字典名称不能为空',
            trigger: 'blur'
          }],
          content: [{
            required: true,
            message: '描述不能为空',
            trigger: 'blur'
          }],
          configValue: [{
            required: true,
            message: '字典值不能为空',
            trigger: 'blur'
          }],
        },
        queryTypeOptions: [{
            key: 'configName',
            display_name: '字典名称'
          },
          {
            key: 'content',
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
        };
        crudRobotConfig.queryAll().then(res => {
          res.forEach(d => {
            this.platforms[d.id] = d;
          })
        })
        return true
      }, // 新增与编辑前做的操作
      [CRUD.HOOK.afterToCU](crud, form) {
      },
    }
  }
</script>

<style scoped>

</style>
