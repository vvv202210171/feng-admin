<template>
    <div class="chat-window">
        <div class="chat-header">
            <h3>{{ (user.nickName || user.username) + '-' + user.member }} - 聊天</h3>
        </div>
        <div class="chat-messages">
            <div v-for="(msg, index) in messages" :key="index" :class="msg.sender">
                <span>{{ msg.text }}</span>
            </div>
        </div>
        <div class="chat-input">
            <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="输入消息..." />
            <button @click="sendMessage">发送</button>
        </div>
    </div>
</template>

<script>
export default {
    props: ['user'],
    data() {
        return {
            newMessage: '', // 输入的消息
            messages: [], // 聊天记录
        };
    },
    methods: {
        sendMessage() {
            if (this.newMessage.trim()) {
                const message = {
                    sender: '客服',
                    text: this.newMessage,
                };
                this.messages.push(message);
                this.newMessage = ''; // 清空输入框
                this.$emit('send-message', this.newMessage); // 发送消息到父组件或后端
            }
        },
    },
};
</script>

<style scoped>
.chat-window {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #fff;
}

.chat-header {
    padding: 10px;
    background-color: #f1f1f1;
}

.chat-messages {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
    background-color: #f3f3f6;
}

.chat-input {
    display: flex;
    padding: 10px;
    border-top: 1px solid #ddd;
}

.chat-input input {
    flex: 1;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.chat-input button {
    padding: 5px 10px;
    margin-left: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
}

.chat-input button:hover {
    background-color: #0056b3;
}
</style>
