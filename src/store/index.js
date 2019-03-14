import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state = {
    cornerstone:{},
    point:{},
    ctdata:{},
    viewport:{
        windowWidth:400,
        windowCenter:40
    }
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
    SET_CTDATA(state, payload) {
        state.ctdata = payload
    },
    SET_VIEWPORT(state, payload) {
        state.viewport = payload
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