<template>
    <div class="chat-client">

        <!-- 左侧用户列表 -->

        <user-list @select-user="selectUser" :onlineUsers="userDataList" />



        <!-- 右侧聊天窗口 -->

        <chat-window v-if="selectedUser" :user="selectedUser" :customerService="customerService"
            @send-message="sendMessage" :messages="messages" />

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
            messages: [],
            selectedUser: null, // 当前选中的用户
            userDataList: [],
        };
    },
    methods: {
        // 选择用户，显示聊天窗口
        selectUser(user) {
            console.log(user, this.customerService)
            this.selectedUser = user;
            console.log(this.messages)
        },

        // 初始化 WebSocket 连接
        initWebsocket(customService) {
            // 设置 WebSocket 连接成功后的回调
            WebSocketService.setOnOpenCallback(() => {
                this.sendInit(customService); // 连接成功后发送初始化消息
            });
            WebSocketService.init(customService.key); // 初始化 WebSocket
            WebSocketService.addListener(this.handleReceivedMessage); // 注册消息监听
        },
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
                    from: this.customerService.id, // 客服ID
                    to: this.selectedUser.member, // 目标用户ID
                    msgType: data.msgType,
                    content: { command: "CUSTOMER2USER", text: data.text },
                };
                WebSocketService.sendMessage(msgData); // 通过 WebSocket 发送消息
            }
        },

        // 处理收到的消息
        handleReceivedMessage(message) {

            switch (message.chatType) {
                case 'cs': // 客服
                    switch (message.content.command) {
                        case "INIT":
                            const arr = JSON.parse(message.content.text);
                            // 确保 arr 存在并且长度大于 0
                            if (arr && arr.length > 0) {
                                this.messages = arr.map(v => {
                                    let sendType = v.senderType == 'user';
                                    return {
                                        senderType: v.senderType,
                                        fromUser: { member: sendType ? v.member : v.customerServiceId },
                                        to: sendType ? { customerServiceId: v.customerServiceId } : { member: v.member },
                                        chatType: message.chatType,
                                        createdAt: v.createdAt,
                                        msgType: v.messageType,
                                        content: { text: v.message }
                                    }
                                });

                                message.content.command = "SEND";
                                WebSocketService.sendMessage(message);
                            }
                            break;

                        case "USER2CUSTOMER":
                            // 用户发送给客服的消息
                            commit('ADD_MESSAGE', { chatType: 'cs', message: processedMessage });
                            break;

                        case "CUSTOMER2USER":
                            // 客服发送给用户的消息
                            commit('ADD_MESSAGE', { chatType: 'cs', message: processedMessage });
                            break;

                        default:
                            console.warn('未知的命令类型:', message.content.command);
                            break;
                    }
                    break;
                // 其他 chatType 处理
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
