<template>
  <a-modal
    title="资产详情"
    :width="1350"
    :visible="visible"
    :confirmLoading="loading"
    @ok="$emit('ok')"
    @cancel="$emit('cancel')"
  >
    <div class="member-info">
      <p class="member-detail" v-if="dataMem">
        <span><strong>会员：</strong>{{ dataMem.member }}</span>
        <span v-if="dataMem.email && dataMem.email != '--'"
          ><strong>邮箱：</strong>{{ dataMem.email }}</span
        >
        <span v-if="dataMem.tel && dataMem.tel != '--'"
          ><strong>电话：</strong>{{ dataMem.tel }}</span
        >
        <span style="float: right"
          ><strong>总资产折合USDT</strong>{{ memberUsdt.usdt }}</span
        >
      </p>
    </div>
    <a-table
      ref="table"
      size="default"
      row-key="coin"
      :columns="columns"
      :data-source="addressData"
      :scroll="{ x: 1000 }"
      :pagination="false"
      bordered
    >
    </a-table>
    <a-spin :spinning="loading"> </a-spin>
  </a-modal>
</template>

<script>
import {
  // getRoleList,
  getUsaccountList,
  getMemberAssets,
} from "@/api/assethub";
const columns = [
  {
    title: "币种",
    dataIndex: "coin",
    key: "coin",
    width: 150,
  },
  {
    title: "币币账户",
    width: 150,
    children: [
      {
        title: "可用余额",
        dataIndex: "usable",
      },
      {
        title: "冻结余额",
        dataIndex: "disable",
      },
      {
        title: "其他余额",
        dataIndex: "other",
      },
    ],
  },
  {
    title: "合约账户",
    width: 150,
    children: [
      {
        title: "可用余额",
        dataIndex: "contractUsable",
      },
      {
        title: "冻结余额",
        dataIndex: "contractDisable",
      },
      {
        title: "其他余额",
        dataIndex: "contractOther",
      },
    ],
  },
  {
    title: "总额",
    width: 150,
    children: [
      {
        title: "可用余额",
        dataIndex: "allUsable",
      },
      {
        title: "冻结余额",
        dataIndex: "allDisable",
      },
      {
        title: "其他余额",
        dataIndex: "allOther",
      },
    ],
  },
];

export default {
  props: {
    visible: Boolean,
    loading: Boolean,
    dataMem: Object,
  },
  data() {
    return {
      columns,
      memberUsdt: 0,
      addressData: [],
      editRow: null,
      editCache: {},
    };
  },
  methods: {
    async getUsaccountList() {
      const { data, code } = await getUsaccountList({
        key: this.dataMem.member,
        page: 1,
        pageSize: 1000,
      });
      this.addressData = data.records || [];
      const ret = await getMemberAssets({
        member: this.dataMem.member,
      });
      if (ret.code === 0) {
        this.memberUsdt = ret.data;
      }
    },
  },
  watch: {
    visible(val) {
      if (val) this.getUsaccountList();
    },
  },
};
</script>
<style scoped>
.member-info {
  margin-bottom: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.member-detail {
  font-size: 16px;
  color: #555;
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.member-detail span {
  display: flex;
  align-items: center;
}

.member-detail strong {
  color: #007bff; /* 蓝色高亮文字 */
  margin-right: 8px;
}

.member-detail span:hover {
  color: #007bff;
}

.member-detail span strong:hover {
  color: #0056b3;
}

.member-detail span:nth-child(odd) {
  color: #333; /* 会员、邮箱、电话等文字颜色 */
}
</style>
