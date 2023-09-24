import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import geographieModule from "@/store/geographie.module";
import vuetify from "@/plugins/vuetify";

const store = new Vuex.Store({
    state: {
        currentTheme: null,
    },
    mutations: {
        setTheme(state, theme) {
            state.currentTheme = theme;
            localStorage.setItem('theme', theme.dark ? 'darkTheme' : 'lightTheme');
        },
    },
    actions: {

    },
    getters: {

    },
    modules: {
        geographieModule,
    },
    plugins: [createPersistedState()],
});

export default store;
