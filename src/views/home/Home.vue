<template>
  <div>
    <a-page-header
      class="home-page-header"
      :title="langDateStr"
      :sub-title="langDateSub"
    />
    <!-- :breadcrumb="{ routes }" -->
    <!-- sub-title="This is a subtitle" -->
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <chart-card
          :loading="loading"
          :title="'待处理任务/实名审核'"
        >
          <a-statistic :value="taskInfo.realyname" />
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <chart-card
          :loading="loading"
          :title="'待处理任务/提币审核'"
        >
          <a-statistic :value="taskInfo.coinout" />
        </chart-card>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card
          :loading="loading"
          :title="'用户总数'"
          :total="statisticsInfo.users || 0"
        >
          <div>
            <mini-area />
          </div>
          <!-- <template slot="footer">{{ $t('dashboard.analysis.day-visits') }}<span> {{ '1234' | NumberFormat }}</span></template> -->
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card
          :loading="loading"
          :title="'总充币数'"
          :total="statisticsInfo.inaccount || 0"
        >
          <div>
            <mini-bar />
          </div>
          <!-- <template slot="footer">{{ $t('dashboard.analysis.conversion-rate') }} <span>60%</span></template> -->
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card
          :loading="loading"
          :title="'总提币数'"
          :total="statisticsInfo.outaccount || 0"
        >
          <div>
            <mini-bar />
          </div>
          <!-- <template slot="footer">
            <trend flag="down" style="margin-right: 16px;">
              <span slot="term">{{ $t('dashboard.analysis.week') }}</span>
              12%
            </trend>
            <trend flag="up">
              <span slot="term">{{ $t('dashboard.analysis.day') }}</span>
              80%
            </trend>
          </template> -->
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card
          :loading="loading"
          :title="'服务器CPU使用率'"
          :total="statisticsInfo.cpus"
        >
          <div>
            <mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="78" height="8px" />
          </div>
          <!-- <template slot="footer">{{ $t('dashboard.analysis.conversion-rate') }} <span>60%</span></template> -->
        </chart-card>
      </a-col>
    </a-row>


    <div class="antd-pro-pages-dashboard-analysis-twoColLayout" :class="!isMobile && 'desktop'">
      <a-row :gutter="24" type="flex" :style="{ marginTop: '24px' }">
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card :loading="loading" :bordered="false" :title="'资产预警（异常账户预警，以实际数据为准）'" :style="{ height: '100%' }">
            <div class="ant-table-wrapper">
              <a-table
                :row-key="(record, inx) => { return inx }"
                size="small"
                :columns="warningTradTable.columns"
                :dataSource="warningTradTable.source.map((record, index) => ({ ...record, key: index }))"
                :pagination="{ pageSize: 10 }"
              >
                <!-- <span slot="range" slot-scope="text, record">
                  <trend :flag="record.status === 0 ? 'up' : 'down'">
                    {{ text }}%
                  </trend>
                </span> -->
              </a-table>
            </div>
          </a-card>
        </a-col>
        <!--  -->
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card :loading="loading" :bordered="false" :title="'机器人预警信息'" :style="{ height: '100%' }">
            <div class="ant-table-wrapper">
              <a-table
                :row-key="(record, inx) => { return inx }"
                size="small"
                :columns="warningRobotTable.columns"
                :dataSource="warningRobotTable.source.map((record, index) => ({ ...record, key: index }))"
                :pagination="{ pageSize: 10 }"
              >
              </a-table>
            </div>
          </a-card>
        </a-col>
       
      </a-row>
    </div>
  </div>
</template>

<script>
import { getStatistics, getCpuInfo, warningTrad, warningRobot } from '@/api/manage'
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  Bar,
  Trend,
  NumberInfo,
  MiniSmoothArea
} from '@/components'
import { baseMixin } from '@/store/app-mixin'

const searchData = []
for (let i = 0; i < 50; i += 1) {
  searchData.push({
    index: i + 1,
    keyword: `搜索关键词-${i}`,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor((Math.random() * 10) % 2)
  })
}
const dateFilter = (date) => {
  if (date < 10) {
    return '0' + date
  } else {
    return date
  }
}

export default {
  name: 'Home',
  mixins: [baseMixin],
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea
  },
  data () {
    return {
      loading: true,
      langDateStr: '',
      langDateSub: '',
      searchData,
      taskInfo: {
        realyname: '',
        coinout: ''
      },
      statisticsInfo: {
        users: '0',
        inaccount: '0',
        outaccount: '0',
        cpus: '0'
      },
      warningTradTable: {
        source: [],
        columns: [
          { title: '会员', dataIndex: 'member', width: 120 },
          { title: '币种', dataIndex: 'coin', width: 80 },
          { title: '可用', dataIndex: 'usable', width: 120 },
          { title: '冻结', dataIndex: 'disable', width: 120 },
          { title: '其他', dataIndex: 'other', width: 120 }
        ]
      },
      warningRobotTable: {
        source: [],
        columns: [
          { title: '时间', dataIndex: 'writedate', width: 150 },
          { title: '信息', dataIndex: 'contents' }
        ]
      },
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      }
    }
  },
  computed: {
    searchTableColumns () {
      return [{
        dataIndex: 'index',
        title: this.$t('dashboard.analysis.table.rank'),
        width: 90
      }, {
        dataIndex: 'keyword',
        title: this.$t('dashboard.analysis.table.search-keyword')
      }, {
        dataIndex: 'count',
        title: this.$t('dashboard.analysis.table.users')
      }, {
        dataIndex: 'range',
        title: this.$t('dashboard.analysis.table.weekly-range'),
        align: 'right',
        sorter: (a, b) => a.range - b.range,
        scopedSlots: { customRender: 'range' }
      }]
    }
  },
  created () {
    this.getLangDate()
  },
  mounted () {
    getStatistics()
      .then(res => {
        console.log(res)
        if (res.code === '0') {
          const {
            users,
            inaccount,
            outaccount,
            coinout,
            realyname
          } = res.data[0] // 取第一条

          this.taskInfo.realyname = realyname
          this.taskInfo.coinout = coinout
          this.statisticsInfo.users = users
          this.statisticsInfo.inaccount = inaccount
          this.statisticsInfo.outaccount = outaccount
        }
      })
    getCpuInfo()
      .then(res => {
        console.log(res)
        if (res.code === '0') {
          const { cpus } = res.data[0]
          this.statisticsInfo.cpus = cpus
        }
      })
    warningTrad()
      .then(res => {
        if (res.code === 0) {
          this.warningTradTable.source = res.data
        }
      })
    warningRobot()
      .then(res => {
        if (res.code === 0) {
          this.warningRobotTable.source = res.data
        }
      })
    this.$nextTick(() => {
      setTimeout(() => {
        this.loading = !this.loading
      }, 1000)
    })
  },
  methods: {
    getLangDate () {
      const ts = this
      // setTimeout('getLangDate()',1000) ${timeValue}
      this.langDateStr = `你好！ 欢迎使用后台管理系统。`
      // this.langDateSub = `当前时间为：${newDate} ${week}`

      setInterval(function () {
        const dateObj = new Date() // 表示当前系统时间的Date对象
        const year = dateObj.getFullYear()
        const month = dateObj.getMonth() + 1
        const date = dateObj.getDate()
        const day = dateObj.getDay()
        const weeks = [ '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ]
        const week = weeks[day] // 根据星期值，从数组中获取对应的星期字符串
        const hour = dateObj.getHours()
        const minute = dateObj.getMinutes()
        const second = dateObj.getSeconds()
        const timeValue = '' + ((hour >= 12) ? (hour >= 18) ? '晚上' : '下午' : '上午') // 当前时间属于上午、晚上还是下午
        const newDate = `${year}年${dateFilter(month)}月${dateFilter(date)}日 ${dateFilter(hour)}:${dateFilter(minute)}:${dateFilter(second)}`

        ts.langDateSub = `当前时间为：${newDate} ${timeValue} ${week}`
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.home-page-header {
  padding-left: 0;
  padding-top: 0;
}
.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

.antd-pro-pages-dashboard-analysis-twoColLayout {
  position: relative;
  display: flex;
  display: block;
  flex-flow: row wrap;
}

.antd-pro-pages-dashboard-analysis-salesCard {
  height: calc(100% - 24px);
  :deep(.ant-card-head) {
    position: relative;
  }
}

.dashboard-analysis-iconGroup {
  i {
    margin-left: 16px;
    color: rgba(0,0,0,.45);
    cursor: pointer;
    transition: color .32s;
    color: black;
  }
}
.analysis-salesTypeRadio {
  position: absolute;
  right: 54px;
  bottom: 12px;
}
</style>
