import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import geographieModule from "@/store/geographie.module";
import popupModule from "@/store/popup.module";
import blogModule from "@/store/blog.module";

const store = new Vuex.Store({
    state: {
        currentTheme: null,
        user: null
    },
    mutations: {
        setTheme(state, theme) {
            state.currentTheme = theme;
            localStorage.setItem('theme', theme.dark ? 'darkTheme' : 'lightTheme');
        },
        setUser(state, user) {
            state.user = user;
        },
        clearUser(state){
            state.user = null;
        }
    },
    actions: {

    },
    getters: {

    },
    modules: {
        geographieModule,
        popupModule,
        blogModule
    },
    plugins: [createPersistedState()],
});

export default store;
