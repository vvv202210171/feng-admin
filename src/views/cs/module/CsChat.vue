<template>
    <div class="chat-client">

        <!-- 左侧用户列表 -->
        <user-list @select-user="selectUser" :onlineUsers="userDataList" />

        <!-- 右侧聊天窗口 -->
        <chat-window :user="selectedUser" :customerService="customerService" @send-message="sendMessage"
            v-if="selectedUser && Object.keys(selectedUser).length > 0" :messages="userMsgList" />
    </div>
</template>

<script>
import UserList from './UserList.vue';
import ChatWindow from './ChatWindow.vue';
import { loadaUserList } from '@/api/cs';
import WebSocketService from '@/utils/Websocket'; // 导入 WebSocket 服务

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
            messages: [], // 存储所有消息
            chatVis: false, // 控制聊天窗口显示
            selectedUser: {}, // 当前选中的用户
            userDataList: [], // 存储用户列表
        };
    },
    computed: {
        userMsgList() {
            return this.messages.filter(v =>
                v.senderType === 'user' ? v.fromUser.member === this.selectedUser.member : v.to.member === this.selectedUser.member
            );
        }
    },
    destroyed() {
        this.closeWebSocket();
    },
    methods: {
        // 选择用户，显示聊天窗口
        selectUser(user) {
            this.selectedUser = user;

        },

        // 关闭 WebSocket 连接
        closeWebSocket() {
            if (WebSocketService.websocket) {
                WebSocketService.websocket.close();
                WebSocketService.websocket = null; // 清空 WebSocket 对象
            }
        },

        // 初始化 WebSocket 连接
        initWebsocket(customService) {
            this.closeWebSocket(); // 先关闭已有连接

            // 设置 WebSocket 连接成功后的回调
            WebSocketService.setOnOpenCallback(() => {
                this.sendInit(customService); // 连接成功后发送初始化消息
            });

            WebSocketService.init(customService.key); // 初始化 WebSocket
            WebSocketService.addListener(this.handleReceivedMessage); // 注册消息监听
        },

        // 发送初始化消息
        sendInit(customerService) {
            const msgData = {
                chatType: 'cs',
                from: customerService.id, // 客服ID
                content: { command: "INIT" },
            };
            WebSocketService.sendMessage(msgData); // 通过 WebSocket 发送消息
        },

        // 发送消息
        sendMessage(data) {
            if (this.selectedUser) {
                const msgData = {
                    chatType: 'cs',
                    fromUser: { member: this.customerService.id }, // 客服ID
                    to: { member: this.selectedUser.member }, // 目标用户ID
                    msgType: data.msgType,
                    content: { command: "CUSTOMER2USER", text: data.text },
                };
                WebSocketService.sendMessage(msgData); // 通过 WebSocket 发送消息
            }
        },

        // 处理收到的消息
        handleReceivedMessage(message) {
            switch (message.chatType) {
                case 'cs':
                    switch (message.content.command) {
                        case "INIT":
                            const arr = JSON.parse(message.content.text);
                            if (arr && arr.length > 0) {
                                // 更新 messages 数组，使用 Vue.set 来保持响应式
                                this.messages = arr.map(v => {
                                    let sendType = v.senderType === 'user';
                                    return {
                                        senderType: v.senderType,
                                        fromUser: { member: sendType ? v.member : v.customerServiceId },
                                        to: sendType ? { customerServiceId: v.customerServiceId } : { member: v.member },
                                        chatType: message.chatType,
                                        createdAt: v.createdAt,
                                        msgType: v.messageType,
                                        content: { text: v.message }
                                    };
                                });
                            }
                            break;

                        case "USER2CUSTOMER":
                            message.senderType = "user";
                            this.$set(this.messages, this.messages.length, message);  // 使用 Vue.set 来添加新消息
                            break;

                        case "CUSTOMER2USER":
                            this.$set(this.messages, this.messages.length, message);  // 使用 Vue.set 来添加新消息
                            break;

                        case "ERR":
                            console.error(message);
                            break;

                        default:
                            console.warn('未知的命令类型:', message.content.command);
                            break;
                    }
                    break;

                default:
                    console.warn('未知的 chatType:', message.chatType);
                    break;
            }
        },

        // 加载用户列表
        async loadUserList(id) {
            const ret = await loadaUserList({ id });
            this.userDataList = ret.data;
        },
    },

    created() {
        this.loadUserList(this.customerService.id); // 加载用户列表
        this.initWebsocket(this.customerService); // 初始化 WebSocket 连接
    },
};
</script>

<style scoped>
.chat-client {
    width: 500px;
    display: flex;
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
