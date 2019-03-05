import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state = {
    cornerstone:{},
    point:{}
}

const getters = {
   
}

const mutations = {
    SET_CORNERSTONE(state, payload) {
        state.cornerstone = payload
    },
    SET_POINT(state, payload) {
        state.point = payload
    },
}

const actions = {

}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    modules: {
        // personal,
        // oathData
    }
})