<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.title" clearable placeholder="请输入标题" style="width: 200px;" class="filter-item"
          @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in dict.material_type" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="query.groupType" clearable size="small" placeholder="分组" class="filter-item" style="width: 100px">
          <el-option v-for="item in groupTypes" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <date-range-picker v-model="query.gmtCreate" class="date-item" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title"
        width="800px">
        <el-form ref="form" :model="form" :inline="true" :rules="rules" size="small" label-width="80px">
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type" filterable placeholder="请选择" style="width: 172px;">
              <el-option v-for="item in dict.material_type" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="分组" prop="groupType">
            <el-select v-model="form.groupType" filterable placeholder="请选择" style="width: 172px;">
              <el-option v-for="item in groupTypes" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="点赞" prop="likeNum">
            <el-input type="number" v-model="form.likeNum" />
          </el-form-item>
          <el-form-item label="查看" prop="lookNum">
            <el-input type="number" v-model="form.lookNum" />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input type="number" v-model="form.sort" style="width: 110px;" />
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="地址" prop="url" style="width: 650px;">
            <oss-upload v-model="form.url" v-if="form.type==1" />
            <file-upload v-model="form.url" :value="form.url" v-else-if="form.type!=1" style="width: 300px;" />
          </el-form-item>
     <!--     <el-form-item label="内容" prop="content" v-if="form.type==1" style="width: 800px;">
            <mavon-editor ref="md" :style="'height: 450px ;width: 650px'" v-model="form.content" @imgAdd="imgAdd" />
          </el-form-item> -->
          <el-form-item label="内容" prop="content" v-if="form.type==1" style="width: 800px;">
             <editor v-model="form.content" />
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
        <el-table-column align="center" prop="type" label="类型">
          <template slot-scope="scope">
            {{ dict.label.material_type[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="135" prop="groupType" label="分组">
          <template slot-scope="scope" v-if="groupTypes[scope.row.groupType]">
            <span>{{ groupTypes[scope.row.groupType].name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="title" label="标题" />
        <el-table-column align="center" prop="content" label="详情" />
        <el-table-column align="center" prop="url" label="地址" show-overflow-tooltip />
        <el-table-column align="center" prop="sort" label="排序" />
        <el-table-column align="center" prop="likeNum" label="点赞" />
        <el-table-column align="center" prop="lookNum" label="查看" />
        <el-table-column align="center" width="135" prop="gmtCreate" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtCreate) }}</span>
          </template>
        </el-table-column>

        <el-table-column v-permission="['admin','Material:edit','Material:del']" label="操作" width="150px" align="center">
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
  import crudMaterial from '@/api/material/Material'
  import CRUD, {
    crud,
    form,
    header,
    presenter
  } from '@crud/crud'
   import editor from '@/views/components/Editor.vue'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import DateRangePicker from "@/components/DateRangePicker"
  import ossUpload from '@/components/oss-upload/image.vue'
  import {
    upload
  } from '@/utils/upload'
  import fileUpload from '@/components/file-upload/index.vue'
  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: '资料管理',
    url: 'api/Material',
    sort: 'id,desc',
    crudMethod: { ...crudMaterial
    }
  })
  const defaultForm = {
    id: null,
    type: 1,
    groupType: null,
    title: null,
    content: '',
    url: null,
    sort: 1,
    isDel: null,
    likeNum: 0,
    lookNum: 0,
    gmtCreate: null,
    gmtUpdated: null
  }
  export default {
    name: 'Material',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
      ossUpload,
      DateRangePicker,
      fileUpload,
      editor

    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['material_type'],

    data() {
      return {
        groupTypes: {},

        permission: {
          add: ['admin', 'Material:add'],
          edit: ['admin', 'Material:edit'],
          del: ['admin', 'Material:del']
        },
        rules: {
          title: [{
            required: true,
            message: '标题不能为空',
            trigger: 'blur'
          }],
          url: [{
            required: true,
            message: '地址不能为空',
            trigger: 'blur'
          }],
          sort: [{
            required: true,
            message: '排序不能为空',
            trigger: 'blur'
          }],
          likeNum: [{
            required: true,
            message: '点赞不能为空',
            trigger: 'blur'
          }],
          lookNum: [{
            required: true,
            message: '查看不能为空',
            trigger: 'blur'
          }],
          type: [{
            required: true,
            message: '类型不能为空',
            trigger: 'blur'
          }],
          groupType: [{
            required: true,
            message: '分组不能为空',
            trigger: 'blur'
          }],
        },
        queryTypeOptions: [{
            key: 'type',
            display_name: '类型'
          },
          {
            key: 'groupType',
            display_name: '分组类型'
          },
          {
            key: 'title',
            display_name: '标题'
          }
        ]
      }
    },

    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        const query = this.query
        this.crud.params = [];
        if (query.type && query.value) {
          this.crud.params[query.type] = query.value
        };
        crudMaterial.queryAll().then(res => {
          res.forEach(d => {
            this.groupTypes[d.id] = d;
          })
        })
        return true
      }, // 新增与编辑前做的操作
      [CRUD.HOOK.afterToCU](crud, form) {},
      imgAdd(pos, $file) {
        upload("/api/oss/ossUploadImage", $file).then(data => {
          this.$refs.md.$img2Url(pos, data.data)
        })
      },
    }
  }
</script>

<style scoped>

</style>
