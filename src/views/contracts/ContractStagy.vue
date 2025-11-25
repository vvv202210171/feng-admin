<template>
  <div>
    <a-form layout="horizontal">
      <div class="box">
        <div class="left">
          <a-form-item>
            <a-radio-group v-model="form.type" button-style="solid" @change="changeType">
              <a-radio-button value="follow"> 跟随策略 </a-radio-button>
              <!-- <a-radio-button value="custom"> 自定义策略 </a-radio-button> -->
            </a-radio-group>
          </a-form-item>
        </div>
        <div class="right">
          <a-form-item>
            <a-button type="primary" style="right: 30px" @click="submitForm">提交</a-button>
          </a-form-item>
        </div>
      </div>
      <div v-if="form.type == 'custom'">
        <div class="box">
          <div class="left">
            <a-form-item label="日期" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
              <a-date-picker v-model="kdate" @change="changeKDate" />
            </a-form-item>
          </div>
          <div class="middle">
            <a-form-item label="周期" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
              <a-radio-group v-model="minute" @change="changeMinute" button-style="solid">
                <a-radio-button v-for="period in periods" :key="period" :value="period"
                  >{{ period }}分钟</a-radio-button
                >
              </a-radio-group>
            </a-form-item>
          </div>
          <div class="right limit-price">
            <a-form-item label="最高限价" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
              <a-input-number id="inputNumber" v-model="maxPrice" :min="0" :max="100" @pressEnter="changeMaxPrice" />
            </a-form-item>
          </div>
        </div>

        <div class="box" :gutter="12">
          <a-form-item
            label="允许价格浮动比例"
            :label-col="{ span: 11 }"
            :wrapper-col="{ span: 13 }"
            style="min-width: 500px"
          >
            <a-input-number
              :min="0"
              :max="50"
              :formatter="(value) => `${value}%`"
              :parser="(value) => value.replace('%', '')"
              v-model="floatingRatio"
            />
          </a-form-item>
          <a-button type="primary" @click="drawMockKlineChart">生成K线图</a-button>
        </div>
        <a-row :gutter="24">
          <div id="chart_container" class="charts chart-bar" style="width: 100%; height: 500px"></div>
        </a-row>
        <a-row :gutter="24">
          <div id="mock_chart_container" class="charts chart-bar" style="width: 100%; height: 500px"></div>
        </a-row>
      </div>

      <template v-if="form.type == 'follow'">
        <a-form-item label="主币种" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <a-input placeholder="input placeholder" disabled v-model="form.maincoin" />
        </a-form-item>
        <a-form-item label="交易币种" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <a-input placeholder="价格比例将决定于kline的走势" v-model="form.tradcoin" disabled />
        </a-form-item>
        <a-form-item label="跟随价格比例" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <a-input placeholder="请输入跟随价格比例" v-model="form.rate" />
        </a-form-item>
        <a-form-item label="跟随交易对" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <a-select placeholder="请选择交易对" v-model="form.targetId">
            <a-select-option :value="item.autoid" v-for="item in marketList" :key="item.autoid">
              {{ item.instantId }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </template>
    </a-form>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import moment from 'moment'
import { getStray, getMainMarketList, editStrategy, getStrategyKline } from '@/api/contract'

export default {
  data() {
    return {
      form: {
        autoid: '',
        maincoin: '',
        tradcoin: '',
        type: 'follow',
        rate: '',
        targetId: null
      },
      marketList: [],

      // 自定义策略参数
      coinPair: undefined, // 货币对id
      curveChart: undefined, // 曲线图
      klineChart: undefined, // K线图
      kdate: moment(), // 当前日期
      minute: 15, // 当前周期分钟
      maxPrice: 20, // 最高限价
      minPrice: 0, // 最低限价价
      floatingRatio: 5, // 允许价格浮动比例
      KPoints: [], // 最小周期数据点
      points: [], // 最小周期数据点
      periods: [1, 5, 15, 60, 240], // 可选时间周期(分钟),元素必须是整数且能被1440整除,最少设置一个元素
      scaleInterval: 60, // 时间刻度间隔
      symbolSize: 8 // 曲线控制点图形最大直径
      // 自定义策略参数
    }
  },
  computed: {
    // 数据源长度
    dataLength() {
      return Math.round(1440 / this.periods[0])
    },
    // 最高价与最低价的中间值
    averagePrice() {
      return (this.maxPrice + this.minPrice) / 2
    },
    // 曲线图配置参数
    chartOption() {
      return {
        tooltip: {
          triggerOn: 'none',
          formatter: this.toolTipFormatter
        },
        grid: {
          top: '10%',
          bottom: '15%',
          left: '5%',
          right: '5%'
        },
        xAxis: {
          min: 0,
          max: this.dataLength,
          type: 'value',
          axisLine: { onZero: false },
          interval: Math.round(this.scaleInterval / this.periods[0]),
          axisLabel: {
            formatter: this.xAxisFormatter
          }
        },
        yAxis: {
          min: 0,
          max: this.maxPrice,
          type: 'value',
          axisLine: { onZero: false }
        },
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'none'
          },
          {
            type: 'slider',
            yAxisIndex: 0,
            filterMode: 'none'
          }
        ],
        series: [
          {
            id: 'curveChart',
            type: 'line',
            symbolSize: 8,
            data: this.currentPoints
          }
        ]
      }
    },
    // 曲线图控制点配置参数
    dragOption() {
      return {
        graphic: this.currentPoints.map((point, i) => {
          const position = this.curveChart.convertToPixel('grid', point)
          return {
            type: 'circle',
            position: position,
            shape: {
              cx: 0,
              cy: 0,
              r: this.symbolSize / 2
            },
            invisible: true,
            draggable: true,
            ondrag: (e) => this.ondrag(point, position[0], e.offsetY),
            ondragend: (e) => this.ondragend(point, position[0], e.offsetY),
            onmousemove: () => this.showTooltip(i),
            onmouseout: () => this.hideTooltip(i),
            z: 100
          }
        })
      }
    },
    // K线图配置参数
    klineChartOption() {
      return {
        grid: {
          top: '10%',
          bottom: '15%',
          left: '5%',
          right: '5%'
        },
        xAxis: {
          min: 0,
          max: this.dataLength,
          type: 'value',
          axisLine: { onZero: false },
          interval: Math.round(this.scaleInterval / this.periods[0]),
          axisLabel: {
            formatter: this.xAxisFormatter
          }
        },
        yAxis: {
          min: 0,
          max: this.maxPrice,
          type: 'value',
          axisLine: { onZero: false }
        },
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'none'
          },
          {
            type: 'slider',
            yAxisIndex: 0,
            filterMode: 'none'
          }
        ],
        series: [
          {
            id: 'klineChart',
            type: 'candlestick',
            data: this.KPoints
          }
        ]
      }
    },
    // 当前图表周期数据
    currentPoints() {
      return this.points.filter((point) => (point[0] * this.periods[0]) % this.minute === 0)
    }
  },
  methods: {
    changeType(e) {},
    async getStray() {
      try {
        const { data } = await getStray({ autoid: this.form.autoid })
        if (!data) {
          return
        }
        this.form.targetId = data.targetId + ''
        this.form.rate = data.rate
      } catch (error) {
        console.error(error)
      }
    },
    async loadMainMarketList() {
      try {
        const { data } = await getMainMarketList()
        this.marketList = data
        this.getStray()
      } catch (error) {
        console.error(error)
      }
    },
    async submitForm() {
      const { code } = await editStrategy({
        type: this.form.type,
        selfId: this.form.autoid,
        targetId: this.form.targetId,
        rate: this.form.rate,
        kdate: this.kdate.format('yyyy-MM-DD'),
        kline: this.points.slice(0, this.dataLength), // 移除最后一个点
        pricePencent: this.floatingRatio
      })
      if (code === 0) {
        this.$message.success('操作成功')
      }
    },
    changeKDate(kdate, kdateStr) {},
    // 切换周期
    changeMinute(e) {
      this.drawCurveChart()
      console.log(this.periods)
    },
    // 修改最高限价
    async changeMaxPrice(e) {
      this.initKline()
    },
    // 获取并初始化数据点
    async getOrInitKline() {
      this.points.length = 0
      const { data } = await getStrategyKline(this.form.autoid, this.kdate.format('yyyy-MM-DD'))
      if (data && data.length === 1440) {
        let i = 0
        let j = 0
        for (; i < data.length; i++) {
          if (i % this.periods[0] === 0) {
            this.points.push([j++, data[i][1]])
          }
        }
        this.points.push([j, data[i - 1][1]])
      } else {
        for (let i = 0; i <= this.dataLength; i++) {
          this.points.push([i, this.averagePrice])
        }
      }
    },
    // 更新曲线图控制点位置
    updatePosition(e) {
      this.curveChart.setOption({
        graphic: this.currentPoints.map((item) => {
          return { position: this.curveChart.convertToPixel('grid', item) }
        })
      })
    },
    // 显示提示
    showTooltip(dataIndex) {
      this.curveChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: dataIndex
      })
    },
    // 隐藏提示
    hideTooltip(dataIndex) {
      this.curveChart.dispatchAction({
        type: 'hideTip',
        seriesIndex: 0,
        dataIndex: dataIndex
      })
    },
    // 移动曲线点事件
    ondrag(point, offsetX, offsetY) {
      point[1] = this.curveChart.convertFromPixel('grid', [offsetX, offsetY])[1]
      if (point[1] > this.maxPrice) {
        point[1] = this.maxPrice
      }
      if (point[1] < this.minPrice) {
        point[1] = this.minPrice
      }
      this.curveChart.setOption({ series: [{ id: 'curveChart', data: this.currentPoints }] })
    },
    // 结束移动曲线点事件
    ondragend(point, offsetX, offsetY) {
      point[1] = this.curveChart.convertFromPixel('grid', [offsetX, offsetY])[1]
      this.updatePosition()
      const index = this.currentPoints.indexOf(point)
      if (index > 0) {
        let fromPoint = this.currentPoints[index - 1]
        const toPoint = point
        for (let i = fromPoint[0]; i <= toPoint[0] - 2; i++) {
          fromPoint = this.points[i]
          const ck = (toPoint[1] - fromPoint[1]) / (toPoint[0] - fromPoint[0])
          this.points[i + 1][1] =
            fromPoint[1] + (Math.random() - 0.5 + ck) * 2 * (fromPoint[1] * (this.floatingRatio / 100))
          if (this.points[i + 1][1] > this.maxPrice) {
            this.points[i + 1][1] = this.maxPrice
          }
          if (this.points[i + 1][1] < this.minPrice) {
            this.points[i + 1][1] = this.minPrice
          }
        }
      }
      if (index < this.currentPoints.length - 1) {
        let fromPoint = point
        const toPoint = this.currentPoints[index + 1]
        for (let i = fromPoint[0]; i <= toPoint[0] - 2; i++) {
          fromPoint = this.points[i]
          const ck = (toPoint[1] - fromPoint[1]) / (toPoint[0] - fromPoint[0])
          this.points[i + 1][1] =
            fromPoint[1] + (Math.random() - 0.5 + ck) * 2 * (fromPoint[1] * (this.floatingRatio / 100))
          if (this.points[i + 1][1] > this.maxPrice) {
            this.points[i + 1][1] = this.maxPrice
          }
          if (this.points[i + 1][1] < this.minPrice) {
            this.points[i + 1][1] = this.minPrice
          }
        }
      }
    },
    // 获取刻度时间
    getScaleTime(index) {
      const totalMinute = index * this.periods[0]
      const hour = Math.round(totalMinute / this.scaleInterval)
      const minute = totalMinute % this.scaleInterval
      return String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0')
    },
    // 提示弹窗文本格式化
    toolTipFormatter(params) {
      const pointIndex = Math.round(this.minute / this.periods[0]) * params.dataIndex
      return `时间: ${this.kdate.format('yyyy-MM-DD')} ${this.getScaleTime(pointIndex)}<br>价格: ${params.data[1]}`
    },
    // x轴刻度文本格式化
    xAxisFormatter(value) {
      return this.getScaleTime(value)
    },
    // 绘制曲线图
    drawCurveChart() {
      this.curveChart.clear()
      this.curveChart.setOption(this.chartOption)
      this.curveChart.setOption(this.dragOption)
    },
    // 绘制K线图
    drawMockKlineChart() {
      this.KPoints.length = 0
      for (let i = 0; i < this.currentPoints.length - 1; i++) {
        const openPrice = this.currentPoints[i][1]
        const closePrice = this.currentPoints[i + 1][1]
        let upperPrice = openPrice
        let lowerPrice = openPrice
        for (let j = this.currentPoints[i][0] + 1; j <= this.currentPoints[i + 1][0]; j++) {
          if (this.points[j][1] > upperPrice) {
            upperPrice = this.points[j][1]
          }
          if (this.points[j][1] < lowerPrice) {
            lowerPrice = this.points[j][1]
          }
        }
        this.KPoints.push([(i * this.minute) / this.periods[0], openPrice, closePrice, lowerPrice, upperPrice])
      }
      this.klineChart.clear()
      this.klineChart.setOption(this.klineChartOption)
    },
    async initKline() {
      if (this.$route.query) {
        this.form.autoid = this.$route.query.autoid
        this.coinPair = this.$route.query.autoid
        this.form.maincoin = this.$route.query.maincoin
        this.form.tradcoin = this.$route.query.tradcoin
        this.loadMainMarketList()
      }
      await this.getOrInitKline()
      this.curveChart = echarts.init(document.getElementById('chart_container'))
      this.klineChart = echarts.init(document.getElementById('mock_chart_container'))
      window.addEventListener('resize', this.updatePosition)
      this.curveChart.on('dataZoom', this.updatePosition)
      this.drawCurveChart()
      this.drawMockKlineChart()
    }
  },
  async mounted() {
    if (this.$route.query) {
      this.form.autoid = this.$route.query.autoid
      this.coinPair = this.$route.query.autoid
      this.form.maincoin = this.$route.query.maincoin
      this.form.tradcoin = this.$route.query.tradcoin
      this.loadMainMarketList()
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.updatePosition)
  },
  watch: {
    'form.type': {
      immediate: true,
      handler(n, o) {
        if (n === 'custom') {
          this.initKline()
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 20px;

  .middle {
    min-width: 500px;
  }

  .limit-price {
    min-width: 200px;
  }
}
</style>
