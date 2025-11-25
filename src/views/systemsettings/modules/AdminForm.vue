<template>
  <a-modal
    :title="model && model.title ? model.title : '新增'"
    :width="920"
    :visible="visible"
    :confirmLoading="loading"
    @ok="
      () => {
        $emit('ok')
      }
    "
    @cancel="
      () => {
        $emit('cancel')
      }
    "
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.autoid > 0" label="ID">
          <a-input v-decorator="['autoid', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="用户名">
          <a-input
            autocomplete="off"
            v-decorator="['username', { rules: [{ required: true, min: 2, message: '请输入至少两个字' }] }]"
          />
        </a-form-item>
        <a-form-item label="类型">
          <a-radio-group
            v-model="issuper"
            v-decorator="['issuper', { rules: [{ required: true, message: '请选择类型' }] }]"
          >
            <a-radio :value="true" v-if="issuper1"> Super </a-radio>
            <a-radio :value="false"> 管理员 </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="登录密码" v-if="!(model && model.autoid > 0)">
          <a-input
            autocomplete="off"
            type="password"
            v-decorator="['password', { rules: [{ required: true, message: '请输入登录密码' }] }]"
          />
        </a-form-item>
        <a-form-item label="手机号码">
          <a-input
            autocomplete="off"
            v-decorator="['tel', { rules: [{ required: true, message: '请输入手机号码' }] }]"
          />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input autocomplete="off" v-decorator="['email', { rules: [{ required: true, message: '请输入邮箱' }] }]" />
        </a-form-item>
        <a-form-item label="账号备注">
          <a-input autocomplete="off" v-decorator="['remarks']" />
        </a-form-item>
        <a-form-item label="授权菜单">
          <!-- root -->
          <a-input
            style="display: none"
            autocomplete="off"
            disabled
            v-decorator="['root', { rules: [{ required: true, message: '权限不能为空' }] }]"
          ></a-input>
          <a-transfer
            v-if="version === '1.0'"
            :data-source="roles && roles.rolesArr"
            show-search
            :list-style="{
              width: 'calc(50% - 59px)',
              height: '360px'
            }"
            :filter-option="filterOption"
            :target-keys="roles && roles.targetsArr"
            :render="(item) => item.title"
            @change="handleChange"
            @search="handleSearch"
          />
          <!--  -->
          <a-tree
            v-if="version !== '1.0'"
            checkable
            :selectable="false"
            :style="{ overflowY: 'scroll', maxHeight: '480px' }"
            :tree-data="roles && roles.rolesArr"
            defaultExpandAll
            :checkedKeys="roles && roles.targetsArr"
            :default-checked-keys="[]"
            @select="onSelect"
            @check="onCheck"
          >
            <!-- <span slot="title0010" style="color: #1890ff">sss</span> -->
          </a-tree>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
// import {
//   // getAdminMenu
//   // getAdminNotMenu
// } from '@/api/systemsetting'
import config from '@/config/defaultSettings'
// 表单字段
const fields = ['autoid', 'issuper', 'username', 'tel', 'password', 'email', 'remarks', 'root']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    issuper1: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    },
    roles: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
    return {
      version: config.version, // 接口版本
      mockData: [],
      targetKeys: [],
      formData: {},
      form: this.$form.createForm(this)
    }
  },
  created() {
    // console.log('custom modal created')
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v))
    // 获取权限数据
    // this.getMock()

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
      if (this.roles && this.roles.targetsArr) {
        const arr = []
        if (this.version === '1.0') {
          this.roles.targetsArr.forEach((e) => {
            arr.push(JSON.parse(e))
          })
        } else {
          // 树形数据，区分全选和半选
          try {
            this.roles.targetsArr.checked.forEach((e) => {
              arr.push(JSON.parse(e))
            })
            this.roles.targetsArr.halfChecked.forEach((e) => {
              arr.push(JSON.parse(e))
            })
          } catch (e) {
            console.log(e)
          }
        }

        this.form.setFieldsValue({
          root: JSON.stringify(arr)
        })
      }
    })
  },
  watch: {
    roles: function (val) {
      console.log(val)
    }
  },
  methods: {
    filterOption(inputValue, option) {
      return option.description.indexOf(inputValue) > -1
    },
    handleChange(targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys)
      // this.form.setFieldsValue
      // this.targetKeys = targetKeys0
      const valueArr = []
      // 转换进input
      targetKeys.forEach((e) => {
        valueArr.push(JSON.parse(e))
      })

      this.form.setFieldsValue({
        root: JSON.stringify(valueArr)
      })
      this.$emit('transferChange', targetKeys)
    },
    handleSearch(dir, value) {
      console.log('search:', dir, value)
    },
    onSelect(selectedKeys, info) {
      console.log('selected', selectedKeys, info)
    },
    onCheck(checkedKeys, info) {
      console.log('onCheck', checkedKeys, info)
      const checkArr = [...info.halfCheckedKeys, ...checkedKeys]
      const valueArr = []
      checkArr.forEach((e) => {
        valueArr.push(JSON.parse(e))
      })
      this.form.setFieldsValue({
        root: JSON.stringify(valueArr)
      })
      this.$emit('treesChange', checkArr)
    }
  }
}
</script>
