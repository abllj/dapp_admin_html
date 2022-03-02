<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
        :title="crud.status.title" width="700px">
        <el-form ref="form" :model="form" :inline="true" :rules="rules" size="small" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="form.type" filterable placeholder="请选择" style="width: 172px;">
              <el-option v-for="item in dict.box_type" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="价格">
            <el-input v-model="form.price" />
          </el-form-item>
          <el-form-item label="币种">
            <el-input v-model="form.currency" />
          </el-form-item>
          <el-form-item label="状态" >
            <el-select v-model="form.status" filterable placeholder="请选择" style="width: 172px;">
              <el-option v-for="item in dict.ON_OFF" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="概率配置">
            <el-input v-model="form.chacnce" />
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
        <el-table-column align="center" prop="id" label="ID" width="80"/>
        <el-table-column align="center" prop="name" label="名称" width="135" />
        <el-table-column align="center" prop="type" label="类型">
          <template slot-scope="scope">
            {{ dict.label.box_type[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="price" label="价格" />
        <el-table-column align="center" prop="currency" label="币种" />
        <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
            {{ dict.label.ON_OFF[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="chacnce" label="概率配置" show-overflow-tooltip/>
        <el-table-column align="center" width="135" prop="gmtCreate" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtCreate) }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="checkPer(['admin','blindBox:edit','blindBox:del'])" label="操作" width="150px"
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
  import crudBlindBox from "@/api/blindbox/blindBox"
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
    title: '盲盒配置',
    url: 'api/blindBox',
    sort: 'id,desc',
    crudMethod: {
      ...crudBlindBox
    }
  })
  const defaultForm = {
    id: null,
    name: null,
    type: null,
    price: null,
    currency: null,
    status: null,
    gmtCreate: null,
    gmtUpdated: null,
    chacnce: null
  }
  export default {
    name: 'BlindBox',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
      DateRangePicker
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['box_type', 'ON_OFF'],
    data() {
      return {

        permission: {
          add: ['admin', 'blindBox:add'],
          edit: ['admin', 'blindBox:edit'],
          del: [ 'blindBox:del']
        },
        rules: {}
      }
    },
    watch: {},
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
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
