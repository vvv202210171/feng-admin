<template>
    <div class="chat-client">
        <!-- 左侧用户列表 -->
        <user-list @select-user="selectUser" :onlineUsers="userDataList" />

        <!-- 右侧聊天窗口 -->
        <chat-window v-if="selectedUser" :user="selectedUser" @send-message="sendMessage" />
    </div>
</template>

<script>
import UserList from './UserList.vue';
import ChatWindow from './ChatWindow.vue';
import { loadaUserList } from '@/api/cs'

export default {
    props: {
        customerService: {
            type: Object,
            default: () => { },
        },
    },
    components: {
        UserList,
        ChatWindow,
    },
    data() {
        return {
            selectedUser: null, // 当前选中的用户
            userDataList: []
        };
    },
    methods: {
        // 选择用户，显示聊天窗口
        selectUser(user) {
            this.selectedUser = user;
        },
        // 发送消息
        sendMessage(message) {
            // 通过 WebSocket 或其他方式发送消息
            console.log(`发送消息给 ${this.selectedUser.name}: ${message}`);
        },
        async loadUserList(id) {
            const ret = await loadaUserList({ id });
            this.userDataList = ret.data
        }
    },
    watch: {
        // 监听 prop 变化
        customerService: {
            handler(val) {
                // 当 customerService 发生变化时调用 loadUserList
                if (val && val.id) {
                    this.loadUserList(val.id);
                }
            },
            immediate: true, // 初始时就调用一次
        },
    }
};
</script>

<style scoped>
.chat-client {
    width: 500px;
    display: flex;
    height: 100vh;
}

/* 左侧用户列表 */
.chat-client>.user-list {
    width: 250px;
}

/* 右侧聊天窗口 */
.chat-client>.chat-window {
    flex: 1;
    display: flex;
    flex-direction: column;
}
</style>
