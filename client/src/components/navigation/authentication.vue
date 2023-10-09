<script>
import {getRequest, postRequest} from "@/services/axios.service";
import {mapState} from "vuex";
import store from "@/store";

export default {
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      registered: true
    };
  },
  computed:{
    ...mapState(['user']),
    ...mapState('popupModule',['error'])
  },
  methods: {
    resetData(){
      this.username = '';
      this.password = '';
      this.confirmPassword = '';
    },
    async register() {
      if (this.password !== this.confirmPassword) {
        store.commit('popupModule/setError','Les mots de passe ne sont pas identiques');
        return;
      }

      try {
        const response = await postRequest('/auth/register', {
          username: this.username,
          password: this.password,
        });
        if(!response.error) this.registered = true;
        this.resetData();
      } catch (e) {}
    },
    async login() {
      try {
        const response = await postRequest('/auth/login', {
          username: this.username,
          password: this.password,
        });
        const token = response.token
        if(token){
          localStorage.setItem('token', token);
          const res = await getRequest('/authenticate?user=true');
          if(res.data) store.commit('setUser',res.data);
          this.resetData();
        }
      } catch (e) {}
    },
  },
};
</script>

<template>
  <div
      v-if="!user"
      class="container"
  >
    <div v-if="!registered">
      <h1>Créer un compte</h1>
      <form @submit.prevent="register">
        <v-text-field
            v-model="username"
            label="Nom"
            required
        ></v-text-field>
        <v-text-field
            v-model="password"
            label="Mot de passe"
            type="password"
            required
        ></v-text-field>
        <v-text-field
            v-model="confirmPassword"
            label="Confirmation du mot de passe"
            type="password"
            required
        ></v-text-field>
        <v-btn
            type="submit"
            color="primary"
            width="50%"
            text="S'enregistrer"
        />
        <v-btn
            @click="registered=true"
            width="50%"
            text="Se connecter"
        />
      </form>
    </div>

    <div v-if="registered">
      <h1>Connexion</h1>
      <form @submit.prevent="login">
        <v-text-field
            type="text"
            v-model="username"
            placeholder="Nom"
            required
        />
        <v-text-field
            type="password"
            v-model="password"
            placeholder="Mot de passe"
            required
        />
        <v-btn
            type="submit"
            color="primary"
            width="50%"
            text="Se connecter"
        />
        <v-btn
            @click="registered=false"
            width="50%"
            text="Créer un compte"
        />
      </form>
    </div>
  </div>
</template>

<style scoped>
.container{
  width: 50vw;
  margin-left: 25vw;
}
/* MODE TELEPHONE */
@media screen and (max-width: 500px) {
  .container{
    width: 90vw;
    margin-left: 5vw;
  }
}
/* MODE TABLETTE */
@media screen and (min-width: 501px) and (max-width: 1024px) {
  .container {
    width: 70vw;
    margin-left: 15vw;
  }
}
</style>
