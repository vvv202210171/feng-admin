<template>
  <div class="user-list">
    <h2>在线用户</h2>
    <ul>
      <li v-for="user in onlineUsers" :key="user.id" @click="selectUser(user)">

        <!-- 显示用户头像 -->
        <img :src="userAvartar(user)" alt="avatar" class="user-avatar" />

        {{ (user.nickName || user.username) + ' - ' + user.member }}
        <a-badge dot v-if="user.isNew">
        </a-badge>

      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    onlineUsers: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    // 选择用户并打开聊天窗口
    selectUser(user) {
      this.$emit('select-user', user);  // 将选中的用户传递给父组件
    },
    userAvartar(user) {
      if (!user.avatar || user.avatar == '--') {
        return require('@/assets/user.jpg');
      }
      return this.imgUrl(user.avatar)
    }
  },
};
</script>

<style scoped>
.user-list {
  width: 250px;
  padding: 10px;
  background-color: #f7f7f7;
  border-right: 1px solid #ddd;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  /* 确保头像和文字对齐 */
}

li:hover {
  background-color: #f1f1f1;
}

/* 用户头像样式 */
.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  /* 圆形头像 */
  margin-right: 10px;
  /* 头像与文本之间的间距 */
}
</style>
