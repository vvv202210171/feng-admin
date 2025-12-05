const state = {
    messages: {
        cs: [],    // 客服消息
        group: [], // 群聊消息
        room: [],  // 房间消息
    },
};

const mutations = {
    ADD_MESSAGE(state, { chatType, message }) {
        state.messages[chatType].push(message); // 向聊天记录中添加新消息
    },
};

const actions = {
    // 通过 WebSocket 接收到消息后，存储到 Vuex
    receiveMessage({ commit }, data) {
        commit('ADD_MESSAGE', message);
    },
};

const getters = {
    getMessages: (state) => state.messages,
};

export default {
    state,
    mutations,
    actions,
    getters,
};
