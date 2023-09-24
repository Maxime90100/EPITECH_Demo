import { createRouter, createWebHistory } from 'vue-router';
import home from "@/views/home.vue";
import map from "@/views/map.vue";
import sensors from "@/views/sensors.vue";
import io from "socket.io-client";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: home,
    },
    {
        path: '/map',
        name: 'Map',
        component: map,
    },
    {
        path: '/sensors',
        name: 'Sensors',
        component: sensors
    },
    {
        path: '/:catchAll(.*)',
        redirect: '/',
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
