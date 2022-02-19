<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.marketName" clearable placeholder="交易对名称" style="width: 150px;" class="filter-item"
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
        width="800px">
        <el-form ref="form" :model="form" :inline="true" :rules="rules" size="small" label-width="120px">
          <el-form-item label="交易币种" prop="stock">
            <el-input v-model="form.stock" />
          </el-form-item>
          <el-form-item label="计价币种" prop="money">
            <el-input v-model="form.money" />
          </el-form-item>
          <el-form-item label="平台标识" prop="platform">
            <el-select v-model="form.platform" filterable placeholder="请选择" style="width: 172px;">
              <el-option v-for="item in dict.quant_platform" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="交易对" prop="market">
            <el-input v-model="form.market" />
          </el-form-item>
          <el-form-item label="分类" prop="category">
            <el-select v-model="form.category" filterable placeholder="请选择" style="width: 172px;">
              <el-option v-for="item in dict.market_category" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type" filterable placeholder="请选择" style="width: 172px;">
              <el-option v-for="item in dict.market_type" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="最小交易额(U)" prop="minMoney">
            <el-input v-model="form.minMoney" />
          </el-form-item>
          <el-form-item label="代币精度" prop="marketPrecision">
            <el-input v-model="form.marketPrecision" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" filterable placeholder="请选择" style="width: 172px;">
              <el-option v-for="item in dict.ON_OFF" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="form.sort" type="number" />
          </el-form-item>
          <el-form-item label="交易对图标" prop="marketIcon" style="width: 650px;">
            <oss-upload v-model="form.marketIcon" style="width: 400px;" />
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
        <el-table-column align="center" prop="marketIcon" label="交易对图标">
          <template slot-scope="scope">
            <!--   <a :href="scope.row.marketIcon" style="color: #42b983" target="_blank"> -->
          <!--  <img :src="scope.row.marketIcon" alt="点击打开" class="el-avatar"> --><!-- </a> -->
            <el-image class="el-avatar" :src="scope.row.marketIcon" :preview-src-list="srcList" >
            </el-image>

          </template>
        </el-table-column>
        <el-table-column align="center" prop="marketName" label="交易对名称" />
        <el-table-column align="center" prop="market" label="交易对" />
        <el-table-column align="center" prop="platform" label="平台标识">
          <template slot-scope="scope">
            {{ dict.label.quant_platform[scope.row.platform] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="category" label="分类" >
          <template slot-scope="scope">
              {{ dict.label.market_category[scope.row.category] }}
            </template>
          </el-table-column>
        <el-table-column align="center" prop="type" label="类型" >
          <template slot-scope="scope">
              {{ dict.label.market_type[scope.row.type] }}
            </template>
          </el-table-column>
        <el-table-column align="center" prop="stock" label="交易币种" />
        <el-table-column align="center" prop="money" label="计算币种" />
        <el-table-column align="center" prop="minMoney" label="最小交易额" />
        <el-table-column align="center" prop="marketPrecision" label="代币精度" />
        <el-table-column align="center" width="135" prop="gmtCreate" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtCreate) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="sort" label="排序" />
        <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
            {{ dict.label.ON_OFF[scope.row.status] }}
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
  import crudSpotMarket from '@/api/third/market/SpotMarket'
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
  import DateRangePicker from "@/components/DateRangePicker"

  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: '交易对管理',
    url: 'api/SpotMarket',
    sort: 'id,desc',
    crudMethod: { ...crudSpotMarket
    }
  })
  const defaultForm = {
    id: null,
    platform: null,
    marketName: null,
    market: null,
    marketIcon: null,
    category: null,
    type: null,
    stock: null,
    money: null,
    minMoney: 10,
    gmtUpdated: null,
    gmtCreate: null,
    sort: null,
    status: null,
    marketPrecision:1
  }
  export default {
    name: 'SpotMarket',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
      ossUpload,
      DateRangePicker,

    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['quant_platform', 'ON_OFF', 'market_type', 'market_category'],
    data() {
      return {
        srcList: [

        ],
        permission: {
          add: ['admin', 'SpotMarket:add'],
          edit: ['admin', 'SpotMarket:edit'],
          del: ['admin', 'SpotMarket:del']
        },
        rules: {
          platform: [{
            required: true,
            message: '平台不能为空',
            trigger: 'blur'
          }],
          market: [{
            required: true,
            message: '交易对不能为空',
            trigger: 'blur'
          }],
          category: [{
            required: true,
            message: '分类不能为空',
            trigger: 'blur'
          }],
          type: [{
            required: true,
            message: '类型不能为空',
            trigger: 'blur'
          }],
          stock: [{
            required: true,
            message: '交易币种不能为空',
            trigger: 'blur'
          }],
          money: [{
            required: true,
            message: '计价币种不能为空',
            trigger: 'blur'
          }],
          minMoney: [{
            required: true,
            message: '最小交易额不能为空',
            trigger: 'blur'
          }],
          sort: [{
            required: true,
            message: '排序不能为空',
            trigger: 'blur'
          }],
          status: [{
            required: true,
            message: '状态不能为空',
            trigger: 'blur'
          }],
          marketPrecision:[{
            required: true,
            message: '代币精度不能为空',
            trigger: 'blur'
          }]

        },
        queryTypeOptions: [{
            key: 'platform',
            display_name: '平台标识'
          },
          {
            key: 'marketName',
            display_name: '交易对名称'
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
