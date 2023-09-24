import axios from 'axios'

const API = axios.create({
    baseURL: `http://127.0.0.1:3000`
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
        /*console.log("REQUEST SUCCESS")
        console.log(res)*/
        return res
    },
    error => {
        /*console.log("REQUEST FAILED")
        console.log(error)*/
        return Promise.reject(error)
    }
)

function handleError(serviceName, err) {
    if (err.response) {
        /*console.log("SERVICE ERROR:" + serviceName);
        console.log(err.response)*/
        return {
            data: {
                error: 1,
                data: err.response.data
            }

        };
    }
    else if (err.request) {
        /*console.log("NETWORK ERROR:" + serviceName);
        console.log(err.request)*/
        return {
            data: {
                error: 1,
                data: 'Le serveur est injoignable ou l\'URL demandée n\'existe pas'
            }
        };
    }
    else {
        //console.log("UNKNOWN ERROR:" + serviceName);
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

