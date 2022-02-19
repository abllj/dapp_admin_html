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
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
        @selection-change="crud.selectionChangeHandler">
       
        <el-table-column align="center"   prop="uid" label="用户ID" />
        <el-table-column align="center" width="150"  prop="account" label="账户" />
        <el-table-column align="center"   prop="grade" label="用户等级" />
        <el-table-column align="center"   prop="generation" label="第几代" />
        <el-table-column align="center"  prop="maxGeneration" label="最大代数" />
        <el-table-column align="center"  prop="inviteCount" label="直推人数" />
        <el-table-column align="center"   prop="teamCount" label="团队人数" />
        <el-table-column align="center"   prop="regDate" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.regDate) }}</span>
          </template>
        </el-table-column>

      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
  import crudMemberRelation from '@/api/member/MemberRelation'
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
    title: '会员关系管理',
    url: 'api/MemberRelation',
    sort: 'id,desc',
    crudMethod: { ...crudMemberRelation
    }
  })
  const defaultForm = {
    id: null,
    parentId: null,
    memberId: null,
    generation: null,
    gmtCreate: null
  }
  export default {
    name: 'MemberRelation',
    components: {
      pagination,
      crudOperation,
      rrOperation,
      udOperation,
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    data() {
      return {

        permission: {
          add: [ 'MemberRelation:add'],
          edit: [ 'MemberRelation:edit'],
          del: [ 'MemberRelation:del']
        },
        rules: {},
        queryTypeOptions: [{
            key: 'parentId',
            display_name: '上级UID'
          },
          {
            key: 'memberId',
            display_name: '下级UID'
          }
        ]
      }
    },
    watch: {},
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        const query = this.query
         this.crud.params=[];
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
