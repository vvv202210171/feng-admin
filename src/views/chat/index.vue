<template>
    <div class="chat-page">
        <!-- 消息列表 -->
        <div class="message-list">
            <div v-for="(message, index) in messages" :key="index"
                :class="['message-item', { 'message-sent': message.sent, 'message-received': !message.sent }]">
                <div class="message-content">{{ message.text }}</div>
            </div>
        </div>

        <!-- 输入区域 -->
        <div class="chat-input">
            <input v-model="messageText" type="text" placeholder="请输入消息" />
            <button @click="sendMessage">发送</button>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'ChatPage',
    data() {
        return {
            messageText: '',
            messages: [],
        };
    },
    computed: {
        ...mapState({
            // messages: state => state.chat.messages,  // 从Vuex获取聊天消息
        }),
    },
    methods: {
        // 发送消息
        sendMessage() {
            if (this.messageText.trim() !== '') {
                // 将消息添加到Vuex状态
                this.$store.dispatch('chat/sendMessage', this.messageText);
                this.messageText = ''; // 清空输入框
            }
        },
    },
};
</script>

<style lang="less">
.chat-page {
    display: flex;
    flex-direction: column;
    width: 400px;
    margin-right: 45px;
    background-color: #007bff;
    height: 80vh;
}

.message-list {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
}

.message-item {
    margin-bottom: 10px;
    max-width: 80%;
}

.message-item .message-content {
    padding: 10px;
    border-radius: 10px;
}

.message-sent .message-content {
    background-color: #007bff;
    color: white;
    margin-left: auto;
}

.message-received .message-content {
    background-color: #f1f1f1;
}

.chat-input {
    display: flex;
    padding: 10px;
    background-color: #fff;
    border-top: 1px solid #ddd;
}

.chat-input input {
    flex: 1;
    padding: 10px;
    border-radius: 20px;
    border: 1px solid #ddd;
    margin-right: 10px;
}

.chat-input button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
}
</style>