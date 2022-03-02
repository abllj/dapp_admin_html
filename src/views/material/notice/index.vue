<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.title" clearable placeholder="输入名称搜索内容" style="width: 150px;" class="filter-item"
          @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.noticeType" clearable placeholder="公告类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in dict.notice_type" :key="item.id" :label="item.label" :value="item.value" />
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
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" style="width: 650px;" />
          </el-form-item>
          <el-form-item label="类型" prop="noticeType">
            <el-select v-model="form.noticeType" filterable placeholder="请选择" style="width: 140px;">
              <el-option v-for="item in dict.notice_type" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="form.sort" type="number" style="width: 132px;" />
          </el-form-item>
          <el-form-item label="创建时间" prop="gmtCreate" v-if="form.noticeType==2">
            <el-date-picker v-model="form.gmtCreate" type="datetime" style="width: 190px;" />
          </el-form-item>
          <el-form-item label="内容" prop="content" v-if="form.noticeType==2" style="width: 800px;">
             <editor v-model="form.content" />
           </el-form-item>
          <el-form-item label="图片" prop="content" style="width: 650px;" v-if="form.noticeType==1">
            <oss-upload v-model="form.content" style="width: 450px;" />
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
        <el-table-column align="center" prop="title" label="标题" />
        <el-table-column align="center" prop="content" label="内容" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-image class="el-avatar" :src="scope.row.content" v-if="crud.data[scope.$index].noticeType == 1"
            :preview-src-list="srcList" @click="look(scope.row.content)" />
            <span v-else-if="crud.data[scope.$index].noticeType !=1" >{{ scope.row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="noticeType" label="类型">
          <template slot-scope="scope">
            {{ dict.label.notice_type[scope.row.noticeType] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="sort" label="排序" />

        <el-table-column align="center" width="135" prop="gmtCreate" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtCreate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPer(['admin','Notice:edit','Notice:del'])" label="操作" width="150px" align="center">
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
  import crudNotice from '@/api/material/notice/Notice'
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
  import ossUpload from '@/components/oss-upload/image.vue'
  import {
    upload
  } from '@/utils/upload'
  import DateRangePicker from "@/components/DateRangePicker"

  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: '公告管理',
    url: 'api/Notice',
    sort: 'id,desc',
    crudMethod: { ...crudNotice
    }
  })
  const defaultForm = {
    id: null,
    title: null,
    content: null,
    noticeType: 1,
    sort: 1,
    status: null,
    isDeleted: null,
    gmtCreate: new Date,
    gmtUpdated: null
  }
  export default {
    name: 'Notice',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
      ossUpload,
      DateRangePicker,
      editor
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['notice_type'],
    data() {
      return {
        srcList: [

        ],
        permission: {
          add: ['admin', 'Notice:add'],
          edit: ['admin', 'Notice:edit'],
          del: ['admin', 'Notice:del']
        },
        rules: {

          title: [{
            required: true,
            message: '标题不能为空',
            trigger: 'blur'
          }],
          content: [{
            required: true,
            message: '内容不能为空',
            trigger: 'blur'
          }],
          noticeType: [{
            required: true,
            message: '类型不能为空',
            trigger: 'blur'
          }],
          sort: [{
            required: true,
            message: '排序不能为空',
            trigger: 'blur'
          }],
        },
        queryTypeOptions: [{
            key: 'title',
            display_name: '标题'
          },
          {
            key: 'noticeType',
            display_name: '类型'
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
      look(url) {
        this.srcList.push(url);
      }


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
