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
        <el-select v-model="query.grade" clearable size="small" placeholder="选择等级" class="filter-item" style="width: 100px">
          <el-option v-for="item in dict.grade" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
           <date-range-picker v-model="query.gmtCreate" class="date-item" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title"
        width="600px">
        <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="90px">
          <el-form-item label="UID">
            <el-input v-model="form.uid"   disabled/>
          </el-form-item>
         <el-form-item label="会员账号">
           <el-input v-model="form.account"   disabled/>
         </el-form-item>
          <el-form-item label="会员密码" prop="pwd">
            <el-input v-model="form.pwd" placeholder="修改会员密码" />
          </el-form-item>
          <el-form-item label="支付密码" prop="payPwd">
            <el-input v-model="form.payPwd" placeholder="修改支付密码"  />
          </el-form-item>
          <el-form-item label="会员状态" prop="status">
            <el-select v-model="form.status" filterable placeholder="请选择" style="width: 172px;">
              <el-option v-for="item in dict.member_status" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="设置等级" prop="adminGrade">
            <el-select v-model="form.adminGrade" filterable placeholder="请选择" style="width: 172px;">
              <el-option v-for="item in dict.grade" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <!--  height="250" tooltip-effect="dark" -->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data"  size="small" style="width: 100%;"
        @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />

        <el-table-column align="center" fixed  prop="uid" label="UID" />
        <el-table-column align="center" min-width="150"  prop="account" label="会员账号" />
        <el-table-column width="150"  prop="nickName" label="会员昵称" />
        <el-table-column width="150"  prop="email" label="绑定邮箱" />
        <el-table-column width="150"  prop="phone" label="手机号" />

        <el-table-column  prop="inviteCode" label="邀请码" />
        <el-table-column show-overflow-tooltip  prop="status" label="会员状态">
          <template slot-scope="scope">
            {{ dict.label.member_status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column  prop="inviteCount" label="直推人数" />
        <el-table-column  prop="teamCount" label="团队人数" />
        <el-table-column  prop="validInviteCount" label="直推有效" />
        <el-table-column  prop="validTeamCount" label="团队有效" />

        <el-table-column  prop="adminGrade" label="设置等级">
          <template slot-scope="scope">
            {{ dict.label.grade[scope.row.adminGrade] }}
          </template>
        </el-table-column>
        <el-table-column  prop="grade" label="用户等级">
          <template slot-scope="scope">
            {{ dict.label.grade[scope.row.grade] }}
          </template>
        </el-table-column>
        <el-table-column  prop="validStatus" label="是否有效">
          <template slot-scope="scope">
            {{ dict.label.yes_no[scope.row.validStatus] }}
          </template>
        </el-table-column>
        <el-table-column  prop="isTrial" label="试用期">
          <template slot-scope="scope">
            {{ dict.label.yes_no[scope.row.isTrial] }}
          </template>
        </el-table-column>
        <el-table-column width="135"  prop="gmtCreate" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtCreate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','Member:edit','Member:del']" label="操作" width="150px" align="center">
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
  import crudMember from '@/api/member/Member'
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
    title: '会员管理',
    url: 'api/Member',
    sort: 'id,desc',
    crudMethod: { ...crudMember
    }
  })
  const defaultForm = {
    id: null,
    uid: null,
    account: null,
    password: null,
    payPassword: null,
    nickName: null,
    email: null,
    phone: null,
    avatar: null,
    inviteCode: null,
    personSign: null,
    beginTime: null,
    endTime: null,
    status: null,
    salt: null,
    inviteCount: null,
    teamCount: null,
    validInviteCount: null,
    validTeamCount: null,
    gmtCreate: null,
    adminGrade: null,
    grade: null,
    gmtUpdated: null,
    version: null,
    validStatus: null,
    isTrial: null
  }
  export default {
    name: 'Member',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
      DateRangePicker,
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['member_status', 'grade', 'yes_no'],
    data() {
      return {

        permission: {
          add: [ 'Member:add'],
          edit: ['admin', 'Member:edit'],
          del: [ 'Member:del']
        },
        rules: {



        },
        queryTypeOptions: [{
            key: 'uid',
            display_name: 'UID'
          },
          {
            key: 'account',
            display_name: '账户'
          },
          {
            key: 'email',
            display_name: '邮箱'
          },
          {
            key: 'phone',
            display_name: '手机号'
          }
        ]
      }
    },
    watch: {},
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        const query = this.query
        this.crud.params = {};
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
