import './assets/css/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import store from "@/store";
import io from "socket.io-client";
import VueCookies from "vue-cookies";

const app = createApp(App);

app.use(vuetify);
app.use(router);
app.use(store);
app.use(VueCookies);

const socket = io.connect(process.env.SERVER_URL, {
    transports: ['websocket', 'polling'],
});

socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
});

store.commit('setTheme', vuetify.theme.global.current.value);
app.config.globalProperties.$socket = socket;

app.mount('#app');
