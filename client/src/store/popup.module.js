export default {
    namespaced: true,
    state: {
        error: null,
        success: null,
        info: null,
        warning: null
    },
    mutations: {
        setError(state, error) {
            state.error = error;
            window.scrollTo({top: 0, behavior: "smooth"});
        },
        clearError(state) {
            state.error = null;
        },
        setSuccess(state, success){
            state.success = success;
            window.scrollTo({top: 0, behavior: "smooth"});
        },
        clearSuccess(state) {
            state.success = null;
        },
        setInfo(state, info){
            state.info = info;
            window.scrollTo({top: 0, behavior: "smooth"});
        },
        clearInfo(state) {
            state.info = null;
        },
        setWarning(state, warning){
            state.warning = warning;
            window.scrollTo({top: 0, behavior: "smooth"});
        },
        clearWarning(state) {
            state.warning = null;
        }
    }
}
