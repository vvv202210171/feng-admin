<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- :model="queryParam" -->
      <a-form name="configSearch" layout="inline" autocomplete="off" style="margin-bottom: 14px">
        <a-form-item label="交易对">
          <span>{{ queryParam.maincoin }}/{{ queryParam.tradcoin }}</span>
        </a-form-item>
        <a-form-item label="时间">
          <a-date-picker v-model="queryParam.startdate" show-time @change="startChange" />~<a-date-picker
            v-model="queryParam.enddate"
            show-time
            @change="endChange"
          />
        </a-form-item>
        <a-form-item>
          <a-button html-type="submit" type="primary" @click="doSearch"> 查询 </a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="plus" :disabled="!$verify('107043')" @click="handleAdd"> 新建规则 </a-button>
        </a-form-item>
        <div style="float: right">
          <a-form-item>
            <a-button @click="showHistory"> 查看历史行情 </a-button>
          </a-form-item>
          <a-form-item>
            <a-button @click="toggleView">
              {{ isChartView ? '切换为表格' : '切换为图表' }}
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="danger" :disabled="selectedRowKeys.length === 0" @click="handleBatchDelete">
              批量删除
            </a-button>
            <div style="float: right">
              <a-button type="primary" @click="saveData" v-show="isChartView"> 一键保存 </a-button>
            </div>
          </a-form-item>
        </div>
      </a-form>
      <div v-show="!isChartView">
        <a-table
          ref="table"
          size="default"
          row-key="autoid"
          :loading="loading"
          :columns="columns"
          :data-source="loadData"
          :scroll="{ x: 980 }"
          :pagination="pagination"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange
          }"
        >
          <span slot="action" slot-scope="text, record">
            <template>
              <a :disabled="!$verify('107044')" @click="handleEdit(record)">编辑</a>
              <!-- <a-divider type="vertical" />
            <a @click="handleDel(record)">删除</a> -->
            </template>
          </span>

          <span slot="xdate" slot-scope="text, record">
            <template>
              {{ record.xdate }}
            </template>
          </span>
          <span slot="yprice" slot-scope="text, record">
            <template>
              <a-input-number
                id="inputNumber"
                :value="record.yprice"
                :min="0"
                @change="(value) => onChangeYprice(value, record)"
              />
            </template>
          </span>
        </a-table>
      </div>
      <div v-show="isChartView">
        <!-- 折线图容器 -->
        <div ref="lineChart" style="width: 100%; height: 600px" />
      </div>
      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
      <ControlFormEdit
        ref="createModalEdit"
        :visible="visibleEdit"
        :model="mdl2"
        @cancel="handleCancel2"
        @ok="handleOk2"
      />
      <show-history
        :visibleKline="visibleKline"
        @cancel="visibleKline = false"
        :maincoin="queryParam.maincoin"
        :tradcoin="queryParam.tradcoin"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable } from '@/components'
import CreateForm from './modules/ControlForm'
import ControlFormEdit from './modules/ControlFormEdit'
import ShowHistory from './modules/ShowHistory'
import moment from 'moment'
import * as echarts from 'echarts'
import { getCustomerDataList, delCustomData, addCustomDataRule, updateCustomerData, batchUpdate } from '@/api/contract'
const columns = [
  {
    title: 'sourceId',
    dataIndex: 'sourceId',
    width: 120
  },
  {
    title: '主币',
    dataIndex: 'maincoin'
  },
  {
    title: '交易币',
    dataIndex: 'tradcoin'
  },
  {
    title: '行情',
    dataIndex: 'yprice',
    scopedSlots: { customRender: 'yprice' }
  },
  {
    title: '最小值',
    dataIndex: 'priceMin'
  },
  {
    title: '最大值',
    dataIndex: 'priceMax'
  },
  {
    title: '时间',
    dataIndex: 'xdate',
    scopedSlots: { customRender: 'xdate' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'ContractCoin',
  components: {
    STable,
    CreateForm,
    ControlFormEdit,
    ShowHistory
  },
  data() {
    return {
      loading: false,
      columns,
      selectedRowKeys: [],
      visible: false,
      visibleKline: false,
      visibleEdit: false,
      confirmLoading: false,
      isChartView: false,
      mdl: null,
      mdl2: null,
      // 高级搜索 展开/关闭
      advanced: false,
      queryParam: {
        key: '',
        page: 1,
        pageSize: 300
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 300,
        pageSizeOptions: ['200', '300', '500', '1000', '2000'],
        showSizeChanger: true,
        onShowSizeChange: (page, pageSize) => {
          this.pagination.current = 1
          if (pageSize !== this.pagination.pageSize) {
            this.pagination.pageSize = pageSize
          }
          this.queryParam['page'] = 1
          this.queryParam['pageSize'] = pageSize
          this.getData()
        },
        onChange: (page, pageSize) => {
          this.pagination.current = page
          if (pageSize !== this.pagination.pageSize) {
            this.pagination.pageSize = pageSize
          }
          this.queryParam['page'] = page
          this.queryParam['pageSize'] = pageSize
          this.getData()
          // console.log(page, pageSize)
        }
      },
      selectedRows: []
    }
  },

  created() {
    this.queryParam.autoid = this.$route.query.autoid
    this.queryParam.maincoin = this.$route.query.maincoin
    this.queryParam.tradcoin = this.$route.query.tradcoin
    this.getData()
  },
  methods: {
    async saveData() {
      const ret = await batchUpdate(this.loadData)
      if (ret.code === 0) {
        this.$message.success('成功')
        this.getData()
      }
    },
    toggleView() {
      this.isChartView = !this.isChartView
      this.$nextTick(() => {
        if (this.isChartView) {
          this.renderChart()
        }
      })
    },
    renderChart() {
      if (this.chartInstance) {
        this.chartInstance.dispose()
        this.chartInstance = null
      }
      this.chartInstance = echarts.init(this.$refs.lineChart)
      const xData = this.loadData.map((item) => item.xdate.slice(11, 16))
      xData.reverse()
      const yData = this.loadData.map((item) => item.yprice)
      yData.reverse()
      const data = xData.map((x, i) => [x, yData[i]])
      const option = {
        title: {
          text: '行情走势图',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: xData,
          axisLabel: {
            rotate: 45,
            interval: xData.length / 25
          }
        },
        yAxis: {
          type: 'value',
          min: yData.reduce((a, b) => Math.min(a, b), Infinity), // 你根据实际值范围调整
          max: yData.reduce((a, b) => Math.max(a, b), 0) // 这样让图更“压缩”，波动就明显了
        },
        series: [
          {
            name: '收盘价',
            type: 'line',
            data: data,
            smooth: true,
            lineStyle: {
              color: '#1890ff'
            }
          }
        ]
      }
      this.chartInstance.setOption(option)

      const mychart = this.chartInstance
      const that = this
      this.chartInstance.setOption({
        graphic: data.map((item, dataIndex) => {
          const [x, y] = mychart.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, item)

          return {
            type: 'circle',
            position: [x, y],
            shape: { r: 5 },
            draggable: true,
            z: 100,
            ondrag: function () {
              // 保持原来的 x 坐标不变
              const newX = this.position[0]
              const newY = this.position[1]
              // 获取当前 x 坐标，保持不变
              const pxCoord = mychart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [newX, newY])

              // 获取新的 Y 坐标值
              const newVal = pxCoord[1]

              // 更新 data 数组中的 Y 值
              data[dataIndex][1] = newVal
              // 更新 loadData 中的数据
              that.loadData[that.loadData.length - 1 - dataIndex].yprice = newVal

              // 更新 series 折线图
              mychart.setOption({
                series: [
                  {
                    data: data.map((d) => d[1])
                  }
                ]
              })
            }
          }
        })
      })
      this.chartInstance.resize()
    },
    onChangeYprice(value, record) {
      if (value === 0 || value === '0.' || !value) {
        return
      }
      this.$set(record, 'yprice', value)
      if (value < record.priceMin) {
        record.priceMin = value
      }
      if (value > record.priceMax) {
        record.priceMax = value
      }
      this.sendPost(record)
    },
    showHistory() {
      this.visibleKline = true
    },
    // 复选框变化时触发
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 批量删除
    async handleBatchDelete() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请先选择要删除的数据')
        return
      }

      this.$confirm({
        title: '确认删除',
        content: `确定删除选中的 ${this.selectedRowKeys.length} 条记录吗？`,
        onOk: async () => {
          try {
            const res = await delCustomData({
              autoids: this.selectedRowKeys.join()
            })
            if (res.code === 0) {
              this.$message.success('删除成功')
              this.selectedRowKeys = []
              this.selectedRows = []
              this.getData()
            } else {
              this.$message.error('删除失败')
            }
          } catch (error) {
            console.error(error)
            this.$message.error('删除失败')
          }
        }
      })
    },
    startChange(date, dateString) {
      this.queryParam.startdate = dateString
    },
    endChange(date, dateString) {
      this.queryParam.enddate = dateString
    },
    handleAdd() {
      // get menu data
      this.mdl = {}
      this.mdl.autoid = this.queryParam.autoid
      this.mdl.maincoin = this.queryParam.maincoin
      this.mdl.tradcoin = this.queryParam.tradcoin
      this.mdl.type = 'rise'
      this.mdl.amplitude = 0.02
      this.visible = true
    },
    handleEdit(record) {
      // get menu data
      this.visibleEdit = true
      this.mdl2 = { ...record }
    },
    handleOk() {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          // 添加username
          values = {
            ...values
          }
          Object.keys(values).map((e) => {
            if (values[e] === undefined) {
              values[e] = ''
            }
          })
          if (values.autoid > 0) {
            const pattern = 'YYYY-MM-DD HH:mm:ss'
            values.start = moment(values.start).format(pattern)
            values.end = moment(values.end).format(pattern)
            // 修改 e.g.
            addCustomDataRule(values).then((res) => {
              if (res.code === 0) {
                this.visible = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                // this.$refs.table.refresh()
                this.getData()
              }
              this.confirmLoading = false
              // this.$message.success("修改成功")
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    async handleOk2() {
      const form = this.$refs.createModalEdit.form
      this.confirmLoading = true
      form.validateFields(async (errors, values) => {
        // 确保回调是 async
        if (!errors) {
          const ret = await this.sendPost(values) // 这里用 await 调用异步请求
          if (ret) {
            this.$message.success('修改成功')
            // 重置表单数据
            form.resetFields()
            this.visibleEdit = false
            // 刷新表格
            this.getData()
          }
        } else {
          this.confirmLoading = false
        }
      })
    },

    async sendPost(values) {
      // 处理数据
      values = { ...values }
      Object.keys(values).map((e) => {
        if (values[e] === undefined) {
          values[e] = ''
        }
      })

      if (values.autoid > 0) {
        // 发送更新请求
        const res = await updateCustomerData(values)
        if (res.code === 0) {
          return true
        }
      }
      return false
    },

    handleCancel() {
      this.visible = false
      this.confirmLoading = false
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleCancel2() {
      this.visibleEdit = false
      const form = this.$refs.createModalEdit.form
      form.resetFields() // 清理表单数据（可不做）
    },

    doSearch() {
      this.getData()
    },
    async getData() {
      this.loading = true
      const res = await getCustomerDataList(this.queryParam)
      const { code, data } = res
      if (code === 0) {
        this.loadData = data.records
        this.pagination.total = data.total
      }
      setTimeout(() => {
        this.loading = false
      }, 800)
    }
  }
}
</script>
