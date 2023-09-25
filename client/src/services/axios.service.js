import axios from 'axios'

const API = axios.create({
    baseURL: process.env.SERVER_URL
});

API.interceptors.request.use(
    config => {
        return {
            ...config,
            headers: {}
        }
    },
    error => {
        return Promise.reject(error)
    }
)

API.interceptors.response.use(
    res => {
        return res
    },
    error => {
        return Promise.reject(error)
    }
)

function handleError(serviceName, err) {
    console.error(err);
    if (err.response) {
        return {
            data: {
                error: 1,
                data: err.response.data
            }

        };
    }
    else if (err.request) {
        return {
            data: {
                error: 1,
                data: 'Le serveur est injoignable ou l\'URL demandée n\'existe pas'
            }
        };
    }
    else {
        return {
            data: {
                error: 1,
                data: 'Erreur inconnue'
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

