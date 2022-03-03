<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
  import {
    statisticalMemberGrade
  } from '@/api/dashboard/statistical.js'
const animationDuration = 600

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    }
  },
  data() {
    return {
      chart: null,

    }
  },
  mounted() {
      statisticalMemberGrade().then(res => {
       let indexData=[];
       let dataValue=[];
        for (let v of res) {
          indexData.push(v.gradeName);
          dataValue.push(v.gradeCount);
        }
        this.initChart(indexData,dataValue)
      }),

    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart(index,dataValue) {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
        left: 10,
        right: 10,
        bottom: 20,
        top: 20,
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: index,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '人数',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: dataValue,
          animationDuration
        }]
      })
    }
  }
}
</script>
