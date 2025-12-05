<template>
    <div class="chat-window" v-if="user">
        <div class="chat-header">
            <h3>{{ (user.nickName || user.username) + '-' + user.member }} - 聊天</h3>
        </div>
        <div class="chat-messages" ref="messagesContainer">
            <div v-for="(msg, index) in messages" :key="index"
                :class="['message', msg.senderType === 'user' ? 'user-message' : 'cs-message']">
                <div class="message-info">
                    <!-- 显示头像 -->
                    <img :src="getImg(msg)" class="avatar" alt="头像" />
                    <span class="nickname">{{ msg.senderType === 'user' ? (user.nickName || user.username) :
                        customerService.name }}</span>
                </div>
                <div class="message-content">
                    <img :src="imgUrl(msg.content.text)" v-if="msg.msgType == 'image'"></img>
                    <span v-else>{{ msg.content.text }}</span>
                </div>
            </div>
        </div>
        <div class="chat-input">
            <a-upload :customRequest="customRequest" :multiple="false" :fileList="[]">
                <a-icon type="plus-circle" class="icon" style="font-size: 38px;" />
            </a-upload>
            <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="输入消息..." class="ml6" />
            <button @click="sendMessage">发送</button>
        </div>
    </div>
</template>


<script>
import { uploadingImg } from "@/api/manage";
export default {
    props: ['user', 'messages', 'customerService'],
    data() {
        return {
            newMessage: '', // 输入的消息

        };
    },
    mounted() {
        this.scrollToBottom();
    },
    methods: {
        // 自定义上传逻辑
        async customRequest({ file, onSuccess, onError }, item) {
            console.log("item", item);
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await uploadingImg(formData);
                if (response.code === 0) {
                    const message = {
                        msgType: 'image',
                        text: response.data.match(/[^/]+\.png$/)[0],
                        senderType: 'user', // 假设发送的消息是用户的
                    };

                    this.$emit('send-message', message); // 发送消息到父组件或后端
                } else {
                    this.$message.error("上传失败");
                }
            } catch (error) {
                console.log(error);
                this.$message.error("上传出错");
                onError(error);
            }
        },
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
                    text: this.newMessage,
                    senderType: 'user', // 假设发送的消息是用户的
                };

                this.newMessage = ''; // 清空输入框
                this.$emit('send-message', message); // 发送消息到父组件或后端
            }
        },
        scrollToBottom() {
            // 获取消息容器
            const messagesContainer = this.$refs.messagesContainer;
            if (messagesContainer) {
                // 滚动到最底部
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        },
    },
}

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

            .icon {
                font-size: 38px;
            }

            input {
                flex: 1;
                padding: 5px;
                border: 1px solid #ddd;
                border-radius: 4px;
            }

            button {
                padding: 5px 10px;
                margin-left: 10px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
            }

            button:hover {
                background-color: #0056b3;
            }
        }


    }


}
</style>