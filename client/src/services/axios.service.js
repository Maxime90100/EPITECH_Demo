import axios from 'axios'
import store from "@/store";

const API = axios.create({
    baseURL: process.env.SERVER_URL
});

API.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        return {
            ...config,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    },
    error => {
        return Promise.reject(error)
    }
)

API.interceptors.response.use(
    res => {
        store.commit('popupModule/setSuccess',res.data.message)
        return res
    },
    error => {
        return Promise.reject(error)
    }
)

function handleError(serviceName, err) {
    if (err.response) {
        const error = err.response.data.message
        store.commit('popupModule/setError',error)
        return {
            data: {
                error: 1,
                data: err.response.data
            }

        };
    }
    else if (err.request) {
        const error = 'Le serveur est injoignable ou l\'URL demandée n\'existe pas'
        store.commit('popupModule/setError',error)
        return {
            data: {
                error: 1,
                data: error
            }
        };
    }
    else {
        const error = 'Erreur inconnue'
        store.commit('popupModule/setError',error)
        return {
            data: {
                error: 1,
                data: error
            }
        };
    }
}
async function getRequest(service, name) {
    let response = null
    try {
        response = await API.get(service)
    } catch (err) {
        response = handleError(name, err);
    }
    return response.data;
}
async function postRequest(service, data, name) {
    let response = null
    try {
        response = await API.post(service, data)
    } catch (err) {
        response = handleError(name, err);
    }
    return response.data;
}
async function patchRequest(service, data, name) {
    let response = null
    try {
        response = await API.patch(service, data)
    } catch (err) {
        response = handleError(name, err);
    }
    return response.data;
}
async function putRequest(service, data, name) {
    let response = null
    try {
        response = await API.put(service, data)
    } catch (err) {
        response = handleError(name, err);
    }
    return response.data;
}

export {
    getRequest,
    postRequest,
    patchRequest,
    putRequest
}

