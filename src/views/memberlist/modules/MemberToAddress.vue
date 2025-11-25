<template>
  <a-modal
    title="地址本修改"
    :width="1200"
    :visible="visible"
    :confirmLoading="loading"
    @ok="$emit('ok')"
    @cancel="$emit('cancel')"
  >
    <a-table
      ref="table"
      size="default"
      row-key="autoid"
      :columns="columns"
      :data-source="addressData"
      :scroll="{ x: 1000 }"
      :pagination="false"
    >
      <template slot="address" slot-scope="text, record">
        <div v-if="editRow === record.autoid">
          <a-input v-model="editCache.address" style="width: 100%" />
        </div>
        <div v-else>{{ record.address }}</div>
      </template>

      <template slot="title" slot-scope="text, record" v-if="record">
        <div v-if="editRow === record.autoid">
          <a-input v-model="editCache.title" style="width: 100%" />
        </div>
        <div v-else>{{ record.title }}</div>
      </template>

      <template slot="tag" slot-scope="text, record" v-if="record">
        <div v-if="editRow === record.autoid">
          <a-input v-model="editCache.tag" style="width: 100%" />
        </div>
        <div v-else>{{ record.tag }}</div>
      </template>

      <template slot="action" slot-scope="text, record" v-if="record">
        <span v-if="editRow === record.autoid">
          <a @click="save(record)">保存</a>
          <a-divider type="vertical" />
          <a @click="cancelEdit">取消</a>
        </span>
        <span v-else>
          <a @click="startEdit(record)">编辑</a>
        </span>
      </template>
    </a-table>
    <a-spin :spinning="loading"> </a-spin>
  </a-modal>
</template>

<script>
import { loadAddressData, updateAddressData } from '@/api/members'

export default {
  props: {
    visible: Boolean,
    loading: Boolean,
    member: String
  },
  data() {
    return {
      columns: [
        { dataIndex: 'coin', title: '币种', width: 80 },
        { dataIndex: 'address', title: '地址', width: 180, scopedSlots: { customRender: 'address' } },
        { dataIndex: 'title', title: '标题', width: 80, scopedSlots: { customRender: 'title' } },
        { dataIndex: 'tag', title: '标签', width: 120, scopedSlots: { customRender: 'tag' } },
        { dataIndex: 'writedate', title: '创建时间', width: 120 },
        { title: '操作', key: 'action', width: 80, scopedSlots: { customRender: 'action' } }
      ],
      addressData: [],
      editRow: null,
      editCache: {}
    }
  },
  methods: {
    async loadAddressData() {
      const ret = await loadAddressData({ member: this.member })
      this.addressData = ret.data || []
    },
    startEdit(record) {
      this.editRow = record.autoid
      this.editCache = { ...record } // 复制一份数据用于编辑
    },
    cancelEdit() {
      this.editRow = null
      this.editCache = {}
    },
    async save(record) {
      const payload = {
        autoid: record.autoid,
        address: this.editCache.address,
        title: this.editCache.title,
        tag: this.editCache.tag
      }
      await updateAddressData(payload)
      this.$message.success('保存成功')
      this.editRow = null
      this.editCache = {}
      this.loadAddressData()
    }
  },
  watch: {
    visible(val) {
      if (val) this.loadAddressData()
    }
  }
}
</script>
