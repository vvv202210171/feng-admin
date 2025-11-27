<template>
  <a-modal title="收款人银行绑定" :width="1200" :visible="visible" :confirmLoading="loading" @ok="$emit('ok')"
    @cancel="$emit('cancel')">
    <a-button type="primary" @click="addNewRow" style="margin-bottom: 20px;">新增</a-button>

    <a-table ref="table" size="default" row-key="id" :columns="columns" :data-source="addressData" :scroll="{ x: 1000 }"
      :pagination="false">


      <template slot="bankName" slot-scope="text, record" v-if="record">
        <div v-if="editRow === record.id">
          <a-input v-model="editCache.bankName" style="width: 100%" />
        </div>
        <div v-else>{{ record.bankName }}</div>
      </template>
      <template slot="accountNumber" slot-scope="text, record" v-if="record">
        <div v-if="editRow === record.id">
          <a-input v-model="editCache.accountNumber" style="width: 100%" />
        </div>
        <div v-else>{{ record.accountNumber }}</div>
      </template>

      <template slot="accountHolder" slot-scope="text, record" v-if="record">
        <div v-if="editRow === record.id">
          <a-input v-model="editCache.accountHolder" style="width: 100%" />
        </div>
        <div v-else>{{ record.accountHolder }}</div>
      </template>

      <template slot="remark" slot-scope="text, record" v-if="record">
        <div v-if="editRow === record.id">
          <a-input v-model="editCache.remark" style="width: 100%" />
        </div>
        <div v-else>{{ record.remark }}</div>
      </template>

      <template slot="status" slot-scope="text, record">
        <div v-if="editRow === record.id">
          <a-select v-model="editCache.status" style="width: 80px">
            <a-select-option :value="1">
              开启
            </a-select-option>
            <a-select-option :value="0">
              关闭
            </a-select-option>
          </a-select>
        </div>
        <div v-else>{{ record.status === 1 ? "开启" : "关闭" }}</div>
      </template>
      <template slot="action" slot-scope="text, record" v-if="record">
        <span v-if="editRow === record.id">
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
import { loadBankData, updateBankData } from '@/api/wallet'

export default {
  props: {
    visible: Boolean,
    loading: Boolean,
    member: String
  },
  data() {
    return {
      columns: [
        { dataIndex: 'id', title: 'ID', width: 120 },
        { dataIndex: 'bankName', title: '银行名称', width: 120, scopedSlots: { customRender: 'bankName' } },
        { dataIndex: 'accountNumber', title: '收款账户', width: 180, scopedSlots: { customRender: 'accountNumber' } },
        { dataIndex: 'accountHolder', title: '收款人姓名', width: 120, scopedSlots: { customRender: 'accountHolder' } },
        { dataIndex: 'status', title: '状态', width: 80, scopedSlots: { customRender: 'status' } },
        { dataIndex: 'remark', title: '备注', width: 180, scopedSlots: { customRender: 'remark' } },

        { title: '操作', key: 'action', width: 150, scopedSlots: { customRender: 'action' } }
      ],
      addressData: [],
      editRow: null,
      editCache: {}
    }
  },
  methods: {
    // 添加新行
    addNewRow() {
      const newRow = {
        id: null, // id 设置为 null，表示是新增行
        bankName: '',
        accountNumber: '',
        accountHolder: '',
        remark: '',
        status: 1 // 默认状态为启用
      }
      this.addressData.unshift(newRow) // 在数据开头添加新行
      this.startEdit(newRow) // 开始编辑这行数据
    },
    async loadBankData() {
      const ret = await loadBankData()
      this.addressData = ret.data || []
    },
    startEdit(record) {
      this.editRow = record.id
      this.editCache = { ...record } // 复制一份数据用于编辑
    },
    cancelEdit() {
      this.editRow = null
      this.editCache = {}
    },
    async save(record) {
      await updateBankData(this.editCache)
      this.$message.success('保存成功')
      this.editRow = null
      this.editCache = {}
      this.loadBankData()
    }
  },
  watch: {
    visible(val) {
      if (val) this.loadBankData()
    }
  }
}
</script>
