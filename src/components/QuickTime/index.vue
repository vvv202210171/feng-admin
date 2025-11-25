<template>
  <div class="quick-range-picker" style="display: flex; align-items: center">
    <a-range-picker
      :value="internalValue"
      :format="format"
      :allow-clear="allowClear"
      @change="onRangeChange"
      style="margin-right: 8px"
    />
    <a-dropdown>
      <a class="ant-dropdown-link" @click.prevent> 快捷 <a-icon type="down" /> </a>
      <a-menu slot="overlay">
        <a-menu-item v-for="item in presets" :key="item.key" @click="applyPreset(item.key)">
          {{ item.label }}
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>
  
  <script>
import moment from 'moment'

export default {
  name: 'QuickTime',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    allowClear: {
      type: Boolean,
      default: true
    },
    wantString: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      internalValue: this.value && this.value.length ? this.value : null,
      presets: [
        { key: 'today', label: '今日' },
        { key: 'yesterday', label: '昨日' },
        { key: 'thisWeek', label: '本周' },
        { key: 'lastWeek', label: '上周' },
        { key: 'thisMonth', label: '本月' },
        { key: 'lastMonth', label: '上月' },
        { key: 'halfYear', label: '半年' },
        { key: 'thisYear', label: '今年' }
      ]
    }
  },
  watch: {
    value(val) {
      this.internalValue = val && val.length ? val : null
    }
  },
  methods: {
    emitValue(range) {
      this.internalValue = range
      if (!range || !range[0] || !range[1]) {
        this.$emit('input', [])
        this.$emit('change', [])
        return
      }

      // 检查是否要输出字符串
      if (this.wantString) {
        let start = range[0]
        let end = range[1]

        // 如果 format 只有年月日，则补全到 00:00:00 ~ 23:59:59
        if (this.format === 'YYYY-MM-DD') {
          start = start.clone().startOf('day')
          end = end.clone().endOf('day')
        }

        const out = [start.format('YYYY-MM-DD HH:mm:ss'), end.format('YYYY-MM-DD HH:mm:ss')]
        this.$emit('input', out)
        this.$emit('change', out)
      } else {
        this.$emit('input', range)
        this.$emit('change', range)
      }
    },
    onRangeChange(dates) {
      if (!dates || !dates.length) {
        this.emitValue([])
        return
      }
      const start = dates[0] ? dates[0].startOf('day') : null
      const end = dates[1] ? dates[1].endOf('day') : null
      this.emitValue([start, end])
    },
    // 计算周一~周日区间
    weekRangeFor(date) {
      // moment().isoWeekday(): 周一=1, 周日=7
      const monday = date.clone().isoWeekday(1).startOf('day')
      const sunday = date.clone().isoWeekday(7).endOf('day')
      return [monday, sunday]
    },
    applyPreset(key) {
      const now = moment()
      let range = [null, null]
      switch (key) {
        case 'today':
          range = [now.clone().startOf('day'), now.clone().endOf('day')]
          break
        case 'yesterday': {
          const y = now.clone().subtract(1, 'day')
          range = [y.clone().startOf('day'), y.clone().endOf('day')]
          break
        }
        case 'thisWeek':
          range = this.weekRangeFor(now)
          break
        case 'lastWeek': {
          const lastWeekRef = now.clone().subtract(1, 'week')
          range = this.weekRangeFor(lastWeekRef)
          break
        }
        case 'thisMonth':
          range = [now.clone().startOf('month').startOf('day'), now.clone().endOf('month').endOf('day')]
          break
        case 'lastMonth': {
          const lm = now.clone().subtract(1, 'month')
          range = [lm.clone().startOf('month').startOf('day'), lm.clone().endOf('month').endOf('day')]
          break
        }
        case 'halfYear': {
          const from = now.clone().subtract(6, 'month').startOf('day')
          range = [from, now.clone().endOf('day')]
          break
        }
        case 'thisYear':
          range = [now.clone().startOf('year').startOf('day'), now.clone().endOf('year').endOf('day')]
          break
      }
      this.emitValue(range)
    }
  }
}
</script>
  