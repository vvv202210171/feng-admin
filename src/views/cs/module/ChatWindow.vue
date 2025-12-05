<template>
    <div class="chat-window">
        <div class="chat-header">
            <h3>{{ (user.nickName || user.username) + '-' + user.member }} - 聊天</h3>
        </div>
        <div class="chat-messages">
            <div v-for="(msg, index) in userMessages" :key="index"
                :class="['message', msg.senderType === 'user' ? 'user-message' : 'cs-message']">
                <div class="message-info">
                    <!-- 显示头像 -->
                    <img :src="getImg(msg)" class="avatar" alt="头像" />
                    <span class="nickname">{{ msg.senderType === 'user' ? user.nickName || user.username :
                        customerService.name }}</span>
                </div>
                <div class="message-content">
                    <span>{{ msg.content.text }}</span>
                </div>
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
    props: ['user', 'messages', 'customerService'],
    data() {
        return {
            newMessage: '', // 输入的消息
        };
    },
    computed: {
        userMessages() {
            return this.messages.filter(v =>
                v.senderType === 'user' ? (v.fromUser.member === this.user.member) : (this.user.member === v.to.member)
            );
        }
    },
    methods: {
        getImg(msg) {
            if (msg.senderType === 'user') {
                return this.user.avatar ? this.imgUrl(this.user.avatar) : require('@/assets/user.jpg');
            }
            return this.customerService.avatar ? this.imgUrl(this.customerService.avatar) : require('@/assets/user.jpg');
        },
        sendMessage() {
            if (this.newMessage.trim()) {
                const message = {
                    msgType: 'text',
                    content: { text: this.newMessage },
                    senderType: 'user', // 假设发送的消息是用户的
                };

                this.newMessage = ''; // 清空输入框
                this.$emit('send-message', message); // 发送消息到父组件或后端
            }
        },
    },
};

</script>

<style lang="less">
.chat-window {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #fff;

    .chat-header {
        padding: 10px;
        background-color: #f1f1f1;
    }

    .chat-messages {
        flex: 1;
        padding: 10px;
        overflow-y: auto;
        background-color: #f3f3f6;

        .message {
            display: flex;
            margin-bottom: 10px;
            flex-direction: column;
            padding: 5px;
        }

        .message-info {
            display: flex;
            align-items: center;
            margin-right: 10px;
        }

        .avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 10px;
        }

        .nickname {
            font-weight: bold;
            margin-right: 5px;
        }

        .user-message {
            align-self: flex-start;
            background-color: #e1f7d5;
            border-radius: 15px;
            padding: 8px;
            max-width: 70%;
        }

        .cs-message {
            align-self: flex-end;
            background-color: #d0e8ff;
            border-radius: 15px;
            padding: 8px;
            max-width: 70%;
            justify-self: end;

            .message-info {
                flex-direction: row-reverse;
            }
        }

        .message-content {
            display: inline-block;
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
    }


}
</style>