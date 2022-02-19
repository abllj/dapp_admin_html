<template>
  <div v-if="crud.props.searchToggle">
    <el-input
      v-model="query.blurry"
      clearable
      size="small"
      placeholder="请输入你要搜索的内容"
      style="width: 200px;"
      class="filter-item"
    />
<!--    <el-date-picker
      v-model="query.gmtCreate"
      :default-time="['00:00:00','23:59:59']"
      type="daterange"
      range-separator=":"
      size="small"
      class="date-item"
      value-format="yyyy-MM-dd HH:mm:ss"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    /> -->
     <date-range-picker v-model="query.gmtCreate" class="date-item" />
    <rrOperation
      :crud="crud"
    />
  </div>
</template>

<script>
import { header } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
  import DateRangePicker from "@/components/DateRangePicker"
export default {
  components: { 
    rrOperation ,
   DateRangePicker},
  mixins: [header()]
}
</script>
