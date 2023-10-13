import {deleteRequest, getRequest, postRequest} from "@/services/axios.service";

export default {
    namespaced: true,
    state: {
        blogs:[],
        otherBlogs:[],
        selectedBlog:null,
        newBlog:{title:null,description:null,color:'#ffffff'},
        message:null,
    },
    getters:{
        getColors(state){
            return [...new Set(state.blogs.map(blog => blog.color))];
        },
        getSelectedBlog(state) {
            const messages = state.selectedBlog ? state.selectedBlog.messages : [];
            const messagesByDate = {};

            messages.forEach((message) => {
                const date = message.createdAt.split('T')[0];
                if (!messagesByDate[date]) messagesByDate[date] = [];
                messagesByDate[date].push(message);
            });

            return Object.keys(messagesByDate).map(date => ({
                date,
                messages: messagesByDate[date],
            }));
        }
    },
    mutations: {
        setBlogs(state, blogs){state.blogs = blogs},
        clearBlogs(state){state.blogs = []},
        setOtherBlogs(state, blogs){state.otherBlogs = blogs},
        clearOtherBlogs(state){state.otherBlogs = []},
        setSelectedBlog(state, blog){state.selectedBlog = blog},
        clearSelectedBlog(state){state.selectedBlog = null},
        clearNewBlog(state){state.newBlog = {title:null,description:null,color:'#ffffff'}},
        setMessage(state, message){state.message = message},
        clearMessage(state){state.message = null},
        clearAll(state){
            state.blogs = [];
            state.otherBlogs = [];
            state.selectedBlog = null;
            state.newBlog = {title:null,description:null,color:'#ffffff'};
            state.message = null
        }
    },
    actions: {
        async syncBlogs({commit}) {
            const blogs = await getRequest('/authenticate/blog')
            commit('setBlogs',blogs);
        },
        async syncOtherBlogs({commit}) {
            const blogs = await getRequest('/authenticate/blog?other=true')
            commit('setOtherBlogs',blogs);
        },
        async addBlog({state,commit,dispatch}) {
            await postRequest('/authenticate/blog/add',{
                title:state.newBlog.title,
                description:state.newBlog.description,
                color:state.newBlog.color || '#ffffff'
            })
            commit('clearNewBlog');
            await dispatch('syncBlogs');
        },
        async deleteBlog({dispatch},id){
            await deleteRequest(`/authenticate/blog/delete/${id}`)
            await dispatch('syncBlogs');
        },
        async syncMessages({state,commit}){
            const blog = await getRequest(`/authenticate/blog/${state.selectedBlog._id}`)
            commit('setSelectedBlog',blog);
        },
        async addMessage({state,commit,dispatch}) {
            if(state.message){
                await postRequest(`/authenticate/blog/addMessage?idBlog=${state.selectedBlog._id}`,{text:state.message})
                await dispatch('syncMessages');
                commit('clearMessage');
            }
        }
    }
}
