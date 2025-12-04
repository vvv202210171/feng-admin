const state = {
    messages: [],
};

const mutations = {
    ADD_MESSAGE(state, message) {
        state.messages.push(message); // 向聊天记录中添加新消息
    },
};

const actions = {
    // 通过 WebSocket 接收到消息后，存储到 Vuex
    receiveMessage({ commit }, message) {
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
