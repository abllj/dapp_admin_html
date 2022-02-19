<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
 <!-- <div style="padding-left: 12px; padding-right: 16px;"> -->
        <div class="el-card is-always-shadow" >
          <div class="el-card__header ">
            <div class="all-right" >
              <div class="all-right">
                <div class="card-panel"  @click="handleSetLineChartData('peoples',member.record)">
                  <div class="card-panel-icon-wrapper icon-people">
                    <svg-icon icon-class="peoples" class-name="card-panel-icon" />
                  </div>
                </div>
                <span>会员总数</span>
              </div>
              <span class="el-tag  el-tag--small ">全平台</span>
            </div>
          </div>
          <div class="el-card__body">
            <div class="card-panel-description">
              <div class="card-panel-text">
                <count-to :start-val="0" :end-val="member.total" :duration="600" class="card-panel-num" />
              </div>
            </div>
            <div class="el-divider el-divider--horizontal">
            </div>
            <div class="day">
              <span>今日总数</span>
              <count-to :start-val="0" :end-val="member.day" :duration="600" class="card-panel-num float-right" />
            </div>
          </div>
        </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="el-card is-always-shadow" >
          <div class="el-card__header ">
           <div class="all-right" >
             <div class="all-right">
               <div class="card-panel" @click="handleSetLineChartData('recharge',recharge.record)">
                  <div class="card-panel-icon-wrapper icon-recharge">
                    <svg-icon icon-class="recharge" class-name="card-panel-icon" />
                  </div>
                </div>
                <span>充值总数</span>
              </div>
              <span class="el-tag  el-tag--small ">全平台</span>
            </div>
          </div>
          <div class="el-card__body">
            <div class="card-panel-description">
              <div class="card-panel-text">
                <count-to :start-val="0" :end-val="recharge.total" :duration="600" class="card-panel-num" />
              </div>
            </div>
            <div class="el-divider el-divider--horizontal">
            </div>
            <div class="day">
              <span>今日总数</span>
              <count-to :start-val="0" :end-val="recharge.day" :duration="600" class="card-panel-num float-right" />
            </div>
          </div>
        </div>
    </el-col>

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="el-card is-always-shadow" >
          <div class="el-card__header ">
            <div class="all-right" >
              <div class="all-right">       <div class="card-panel"  @click="handleSetLineChartData('withdraw',withdraw.record)">
                  <div class="card-panel-icon-wrapper icon-money">
                    <svg-icon icon-class="withdraw" class-name="card-panel-icon" />
                  </div>
                </div>
                <span>提币总数</span>
              </div>
              <span class="el-tag  el-tag--small ">全平台</span>
            </div>
          </div>
          <div class="el-card__body">
            <div class="card-panel-description">
              <div class="card-panel-text">
                <count-to :start-val="0" :end-val="withdraw.total" :duration="600" class="card-panel-num" />
              </div>
            </div>
            <div class="el-divider el-divider--horizontal">
            </div>
            <div class="day">
              <span>今日总数</span>
              <count-to :start-val="0" :end-val="withdraw.day" :duration="600" class="card-panel-num float-right" />
            </div>
          </div>
        </div>
      </div>
    </el-col>

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">

        <div class="el-card is-always-shadow" >
          <div class="el-card__header ">
          <!--  <div class="acea-row row-between-wrapper" style="display: flex;align-items: center;justify-content: space-between;">
              <div style="display: flex;align-items: center;justify-content: space-between;">
                -->
                <div class="all-right" >
                  <div class="all-right">
                <div class="card-panel"  @click="handleSetLineChartData('revenue',revenue.record)">
                  <div class="card-panel-icon-wrapper icon-revenue">
                    <svg-icon icon-class="revenue" class-name="card-panel-icon" />
                  </div>
                </div>
                <span>收益总数</span>
              </div>
              <span class="el-tag  el-tag--small ">全平台</span>
            </div>
          </div>
          <div class="el-card__body">
            <div class="card-panel-description">
              <div class="card-panel-text">
                <count-to :start-val="0" :end-val="revenue.total" :duration="600" class="card-panel-num" />
              </div>
            </div>
            <div class="el-divider el-divider--horizontal">
            </div>
            <div class="day">
              <span>今日总数</span>
              <count-to :start-val="0" :end-val="revenue.day" :duration="600" class="card-panel-num float-right" />
            </div>
          </div>
        </div>

    </el-col>

  </el-row>
</template>
<script>
  import CountTo from 'vue-count-to'
  import {
    statisticalWithdraw
  } from '@/api/dashboard/statistical.js'
  import {
    statisticalMember
  } from '@/api/dashboard/statistical.js'
  import {
    statisticalRecharge
  } from '@/api/dashboard/statistical.js'
  import {
    statisticalRobotRevenue
  } from '@/api/dashboard/statistical.js'
  export default {
    components: {
      CountTo
    },
    data() {
      return {
        count: {
          todayPrice: 0,
          todayCount: 0,
          proPrice: 0,
          proCount: 0,
          monthPrice: 0,
          monthCount: 0,
          lastWeekCount: 0,
          lastWeekPrice: 0,
          userCount: 0,
          orderCount: 0,
          priceCount: 0,
          goodsCount: 0
        },
        withdraw: {
          total: 0,
          day: 0,
          record: []
        },
        member: {
          total: 0,
          day: 0,
          record: [

          ]
        },
        recharge: {
          total: 0,
          day: 0,
          record: []
        },
        revenue: {
          total: 0,
          day: 0,
          record: []
        },

      }
    },
    methods: {
      handleSetLineChartData(type,record) {
        this.$emit('handleSetLineChartData', type,record)
      }
    },
    mounted() {
      statisticalWithdraw().then(res => {
        this.withdraw = res;
      });
      statisticalMember().then(res => {
        this.member = res;
      });
      statisticalRecharge().then(res => {
        this.recharge = res;
      });
      statisticalRobotRevenue().then(res => {
        this.revenue = res;
      });
    }
  }
</script>

<style lang="scss" scoped>
  .panel-group {
    // margin-top: 18px;

    .card-panel-col {
      margin-bottom: 15px;
    }

    .day {
      font-size: 13px;
    }

    .float-right {
      margin-right: 27px;
      float: right;
    }
    .all-right{
      display: flex;align-items: center;justify-content: space-between;
    }


    .card-panel {
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .icon-people {
          background: #40c9c6;
        }

        .icon-recharge {
          background: #f4516c;
        }

        .icon-withdraw {
          background: #08a4f8;
        }

        .icon-revenue {
          background: #3468F7;
        }

        .icon-money {
          background: #f4516c;
        }
      }

      .icon-people {
        color: #40c9c6;
      }

      .icon-recharge {
        color: #f4516c;
      }

      .icon-revenue {
        color: #3468F7;
      }

      .icon-withdraw {
        color: #08a4f8;
      }

      .icon-money {
        color: #f4516c;
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 0px 0 0 0px;
        padding: 0px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 40px;
      }
    }

    .card-panel-description {
      font-weight: bold;
      margin: 0px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 1);
        font-size: 16px;
        margin-bottom: 0px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }

  @media (max-width:550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }
</style>
