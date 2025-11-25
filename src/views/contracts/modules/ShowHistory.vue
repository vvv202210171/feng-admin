<template>
  <a-modal title="历史行情" :visible="visibleKline" :footer="null" @cancel="handleClose" width="600px">
    <a-form name="Search" layout="inline" autocomplete="off" style="margin-bottom: 14px">
      <a-form-item label="时间">
        <a-date-picker
          v-model="queryParam.startdate"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          show-time
          @change="startChange"
        />~<a-date-picker
          v-model="queryParam.enddate"
          show-time
          valueFormat="YYYY-MM-DD HH:mm:ss"
          @change="endChange"
        />
      </a-form-item>
      <a-form-item>
        <a-button html-type="submit" type="primary" @click="doSearch"> 查询 </a-button>
      </a-form-item>
    </a-form>
    <a-form layout="inline" autocomplete="off" style="margin-bottom: 14px">
      <a-form-item label="最大值">
        <span>{{ max }}</span>
      </a-form-item>
      <a-form-item label="最小值">
        {{ min }}
      </a-form-item>
    </a-form>
    <!-- 表格 -->
    <a-table :data-source="dataSource" :columns="columns" :pagination="false" bordered />
  </a-modal>
</template>
<script>
import moment from 'moment'
import { getHistoryList } from '@/api/contract'
export default {
  props: {
    visibleKline: Boolean, // 由外部控制显示状态
    maincoin: String,
    tradcoin: String
  },
  data() {
    return {
      dataSource: [], // 传入表格数据
      queryParam: {
        startdate: '',
        enddate: '',
        maincoin: '',
        tradcoin: ''
      },
      columns: [
        { title: '行情', dataIndex: 'closes', key: 'closes' },
        { title: '24小时(高)', dataIndex: 'height', key: 'height' },
        { title: '24小时(低)', dataIndex: 'low', key: 'low' },
        { title: '时间', dataIndex: 'writedate', key: 'address' }
      ]
    }
  },
  computed: {
    max() {
      if (this.dataSource.length === 0) {
        return 0
      }
      return this.dataSource.map((v) => v.closes).reduce((a, b) => Math.max(a, b), 0)
    },
    min() {
      if (this.dataSource.length === 0) {
        return 0
      }
      return this.dataSource.map((v) => v.closes).reduce((a, b) => Math.min(a, b), Infinity)
    }
  },
  watch: {
    visibleKline(n, o) {
      if (n === true) {
        // 获取前一天的日期（美东时间）
        const timeZoneOffset = parseInt(sessionStorage.getItem('timeZone'))
        const yesterday = moment().utcOffset(timeZoneOffset).subtract(1, 'days')
        // 获取前一天的开始时间（00:00:00）
        const startOfDay = yesterday.startOf('day').format('YYYY-MM-DD HH:mm:ss')
        // 获取前一天的结束时间（23:59:59）
        const endOfDay = yesterday.endOf('day').format('YYYY-MM-DD HH:mm:ss')
        this.queryParam.startdate = startOfDay
        this.queryParam.enddate = endOfDay
        this.queryParam.maincoin = this.maincoin
        this.queryParam.tradcoin = this.tradcoin
        this.doSearch()
      }
    }
  },
  methods: {
    async doSearch() {
      console.log(this.queryParam.enddate, typeof this.queryParam.enddate)
      const ret = await getHistoryList(this.queryParam)
      this.dataSource = ret.data
    },
    startChange(date, dateString) {
      this.queryParam.startdate = dateString
    },
    endChange(date, dateString) {
      this.queryParam.enddate = dateString
    },
    handleClose() {
      this.$emit('cancel', false) // 关闭弹窗，通知父组件
    }
  }
}
</script>
