import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

export const store = new Vuex.Store({

    state: {
        mq: false
    },

    getters: {
        // device based
        getMQ: state => state.mq

    },

    mutations: {
        // device based
        SET_MQ (state, mq) { state.mq = !state.mq; }

    },

    actions: {
        // device based
        setMQ ({ commit }, mq) {
            commit('SET_MQ', mq);
        }
    },

    modules: {
        // meta
    }
});
