<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.uid" clearable placeholder="UID" style="width: 150px;" class="filter-item"
          @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.platform" clearable size="small" placeholder="平台" class="filter-item" style="width: 120px">
          <el-option v-for="item in dict.quant_platform" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="query.status" clearable size="small" placeholder="状态" class="filter-item" style="width: 120px">
          <el-option v-for="item in dict.ON_OFF" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
        <date-range-picker v-model="query.gmtCreate" class="date-item" />

        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title"
        width="550px">
        <el-form ref="form" :model="form" :inline="true" :rules="rules" size="small" label-width="100px">
          <el-form-item label="uid" prop="uid">
            <el-input v-model="form.uid" style="width: 130px;" :disabled="this.disabledValue" />
          </el-form-item>
          <el-form-item label="平台" prop="platform">
            <el-select v-model="form.platform" filterable placeholder="请选择" style="width: 130px;">
              <el-option v-for="item in dict.quant_platform" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="APIKEY" prop="apiKey" >
            <el-input v-model="form.apiKey" style="width: 370px;"  />
          </el-form-item>
          <el-form-item label="SECRET" prop="secretKey">
            <el-input v-model="form.secretKey" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="passphrase" prop="passphrase" v-if="form.platform=='okex'">
            <el-input v-model="form.passphrase" style="width: 370px;" />
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" filterable placeholder="请选择">
              <el-option v-for="item in dict.ON_OFF" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
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
        <el-table-column align="center" prop="uid" label="uid" />
        <el-table-column align="center" prop="platform" label="平台">
          <template slot-scope="scope">
            {{ dict.label.quant_platform[scope.row.platform] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="apiKey" label="APIKEY" show-overflow-tooltip />
        <el-table-column align="center" prop="secretKey" label="SECRET" show-overflow-tooltip />
        <el-table-column align="center" prop="passphrase" label="passphrase" show-overflow-tooltip />
        <el-table-column align="center" width="135" prop="gmtCreate" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtCreate) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
            {{ dict.label.ON_OFF[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column v-if="checkPer(['admin','quantThirdApi:edit'])" label="操作" width="150px"
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
  import crudQuantThirdApi from '@/api/third/api/quantThirdApi'
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
    title: '第三方API',
    url: 'api/quantThirdApi',
    sort: 'id,desc',
    crudMethod: { ...crudQuantThirdApi
    }
  })
  const defaultForm = {
    id: null,
    uid: null,
    platform: 'huobi',
    apiKey: null,
    secretKey: null,
    passphrase: null,
    gmtCreate: null,
    gmtUpdated: null,
    status: 1
  }
  export default {
    name: 'QuantThirdApi',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
      DateRangePicker,
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['quant_platform', 'ON_OFF'],
    data() {
      return {

        permission: {
          add: ['admin','quantThirdApi:add'],
          edit: ['admin','quantThirdApi:edit'],
          del: ['quantThirdApi:del']
        },
        rules: {
          uid: [{
            required: true,
            message: 'uid不能为空',
            trigger: 'blur'
          }],
          platform: [{
            required: true,
            message: '平台不能为空',
            trigger: 'blur'
          }],
          apiKey: [{
            required: true,
            message: 'apiKey不能为空',
            trigger: 'blur'
          }],
          secretKey: [{
            required: true,
            message: 'secretKey不能为空',
            trigger: 'blur'
          }],
          status: [{
            required: true,
            message: 'passphrase不能为空',
            trigger: 'blur'
          }],

        },
        queryTypeOptions: [{
          key: 'uid',
          display_name: 'uid'
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
      [CRUD.HOOK.afterToCU](crud, form) {
        if (form.id == null) {
          this.disabledValue = false;
        } else {
          this.disabledValue = true;
        }

      },
    }
  }
</script>

<style scoped>

</style>
