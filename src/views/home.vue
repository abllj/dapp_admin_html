<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <panel-group @handleSetLineChartData="handleSetLineChartData(arguments)" />
     <!--  <panel-group-t /> -->
      <!-- padding:16px 16px 0;margin-bottom:10px;-->
      <el-row style="background:#fff;">
        <div class="el-card__header">
          <div class="acea-row row-middle">
            <span class="el-avatar el-avatar--small el-avatar--icon el-avatar--circle" style="color: rgb(24, 144, 255); background: rgb(230, 247, 255); font-size: 13px;">
              <i class="el-icon-s-operation"></i>
            </span>
            <span class="ivu-pl-8">统计</span>
          </div>
        </div>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
           <span v-if="lineChartData.type=='peoples'">会员统计</span>
           <span v-if="lineChartData.type=='recharge'">充值统计</span>
           <span v-if="lineChartData.type=='withdraw'">提币统计</span>
           <span v-if="lineChartData.type=='revenue'">收益统计</span>
            <line-chart :chart-data="lineChartData" />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
           <span >会员等级</span>
            <bar-chart />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {
    statisticalMember
  } from '@/api/dashboard/statistical.js'
  import PanelGroup from './dashboard/PanelGroup'
    import PanelGroupT from './dashboard/PanelGroupT'
  import LineChart from './dashboard/LineChart'
  import BarChart from './dashboard/BarChart'
  import {
    parseTime
  } from '@/utils/index.js'
  export default {
    name: 'Dashboard',
    components: {
      PanelGroup,
      PanelGroupT,
      LineChart,
      BarChart
    },
    data() {
      return {
        lineChartData: {
          indexData: [],
          type: '',
          actualData: []
        },
      }
    },
    methods: {
      handleSetLineChartData(type) {
        let ipArr = [];
        let actualData = [];
        for (let aaa of type[1]) {
          ipArr.push(parseTime(aaa.gmtCreate, '{m}-{d}'))
          actualData.push(aaa.amount)
        }
        this.lineChartData = {
          indexData: ipArr,
          type: type[0],
          actualData: actualData
        }
      }
    },
    mounted() {
      statisticalMember().then(res => {
        let ipArr = [];
        let actualData = [];
        for (let aaa of res.record) {
          ipArr.push(parseTime(aaa.gmtCreate, '{m}-{d}'))
          actualData.push(aaa.amount)
        }
        //本来是直接申明一个大对象现在不用了动态获取
        /*      this.$set(this.lineChartData,"",{
                indexData: ipArr,
                expectedData: actualData,
                actualData: actualData
              }) */
        this.lineChartData = {
          indexData: ipArr,
          type: 'peoples',
          actualData: actualData
        }
      });
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 20px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      padding: 15px 16px 0;
    }
  }
  .acea-row.row-middle {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    -webkit-box-align: center;
  }

  .ivu-pl-8 {
    margin-left: 8px;
    font-size: 14px;
  }

  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
