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
import { loadaUserList } from '@/api/cs';
import WebSocketService from '@/utils/Websocket'; // 导入 WebSocket 服务
import { mapActions } from 'vuex';

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
            userDataList: [],
        };
    },
    methods: {
        // 选择用户，显示聊天窗口
        selectUser(user) {
            this.selectedUser = user;
        },

        // 初始化 WebSocket 连接
        initWebsocket(customService) {
            WebSocketService.init(customService.key); // 初始化 WebSocket
            WebSocketService.addListener(this.handleReceivedMessage); // 注册消息监听
        },

        // 发送消息
        sendMessage(message) {
            if (this.selectedUser) {
                const msgData = {
                    from: this.customerService.id, // 客服ID
                    to: this.selectedUser.id, // 目标用户ID
                    content: message,
                };
                WebSocketService.sendMessage(msgData); // 通过 WebSocket 发送消息
            }
        },

        // 处理收到的消息
        handleReceivedMessage(message) {
            this.$store.dispatch('chat/receiveMessage', message); // 将收到的消息存储到 Vuex
        },

        // 加载用户列表
        async loadUserList(id) {
            const ret = await loadaUserList({ id });
            this.userDataList = ret.data;
        },
    },

    watch: {
        // 监听 customerService prop 变化
        customerService: {
            handler(val) {
                if (val && val.id) {
                    this.loadUserList(val.id);
                    this.initWebsocket(val); // 初始化 WebSocket
                }
            },
            immediate: true, // 初始时就调用一次
        },
    },
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
