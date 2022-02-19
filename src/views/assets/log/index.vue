<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">

      <!-- 搜索 -->
      <el-input v-model="query.uid" size="small" clearable placeholder="输入UID" style="width: 140px" class="filter-item"
        @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.currency" clearable size="small" placeholder="选择币种" class="filter-item" style="width: 130px">
          <el-option v-for="item in dict.currency_type" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
      <el-select v-model="query.logType" clearable size="small" placeholder="选择类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in dict.walletLog" :key="item.id" :label="item.label" :value="item.value" />
      </el-select>
      <date-range-picker v-model="query.gmtCreate" class="date-item" />
      <rrOperation :crud="crud" />
    </div>
    <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
    <crudOperation :permission="permission" />

    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
      @selection-change="crud.selectionChangeHandler">
      <el-table-column align="center"  prop="uid" label="UID" />
      <el-table-column align="center"  prop="currency" label="币种">
        <template slot-scope="scope">
          {{ dict.label.currency_type[scope.row.currency] }}
        </template>
      </el-table-column>
      <el-table-column align="center"  prop="amount" label="金额" />
      <el-table-column align="center"  prop="beforeAmount" label="出账前金额" />
      <el-table-column align="center"  prop="afterAmount" label="出账后金额" />
      <el-table-column align="center"  prop="logType" label="类型">
        <template slot-scope="scope">
          {{ dict.label.walletLog[scope.row.logType] }}
        </template>
      </el-table-column>
            <el-table-column align="center"  prop="comment" label="备注" />
      <el-table-column align="center" width="135"  prop="gmtCreate" label="创建时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.gmtCreate) }}</span>
        </template>
      </el-table-column>
   <!--   <el-table-column v-permission="['admin','MemberWalletLog:edit','MemberWalletLog:del']" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission" />
        </template>
      </el-table-column> -->
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
  </div>
</template>

<script>
  import crudMemberWalletLog from '@/api/assets/log/MemberWalletLog'
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
    title: '资产日志',
    url: 'api/MemberWalletLog',
    sort: 'id,desc',
    crudMethod: { ...crudMemberWalletLog
    }
  })
  const defaultForm = {
    id: null,
    uid: null,
    currency: null,
    amount: null,
    beforeAmount: null,
    afterAmount: null,
    logType: null,
    gmtCreate: null,
    comment: null
  }
  export default {
    name: 'MemberWalletLog',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
      DateRangePicker

    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['currency_type', 'walletLog'],
    data() {
      return {

        permission: {
          add:  [ 'MemberWalletLog:add'],
          edit: [ 'MemberWalletLog:edit'],
          del:  ['MemberWalletLog:del']
        },
        rules: {},
        queryTypeOptions: [{
            key: 'uid',
            display_name: 'UID'
          },
          {
            key: 'currency',
            display_name: '币种'
          },
          {
            key: 'logType',
            display_name: '0 充值 1 提现 2 互转 3 推荐奖励 4 购买会员 5是购买信誉金套餐'
          }
        ]
      }
    },
    watch: {},
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {

      }, // 新增与编辑前做的操作
      [CRUD.HOOK.afterToCU](crud, form) {},
    }
  }
</script>

<style scoped>

</style>
