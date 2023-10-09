<script>
import vuetify from "@/plugins/vuetify";
import {mapMutations, mapState} from "vuex";
import popup from "@/components/popup/popup.vue";
import store from "@/store";

export default {
  components:{
    popup
  },
  computed:{
    ...mapState(['currentTheme','user'])
  },
  methods:{
    ...mapMutations(['setTheme']),
    toggleTheme(){
      vuetify.theme.global.name.value = vuetify.theme.global.current.value.dark ? 'lightTheme' : 'darkTheme';
      this.setTheme(vuetify.theme.global.current.value);
    },
    async logout(){
      localStorage.removeItem('token');
      store.commit('clearUser');
      store.commit('popupModule/setSuccess','Utilisateur déconnecté')
    }
  }
}
</script>

<template>
  <div>
    <v-app-bar
        color="primary"
        density="compact"
    >
      <template v-slot:prepend>
        <v-avatar
            color="secondary"
            rounded="0"
        >
          <v-img
              src="src/assets/images/logo.jpg"
              alt="Maxime THEVENEAU"
          ></v-img>
        </v-avatar>
      </template>

      <v-app-bar-title>Demo {<b> EPITECH. </b>}</v-app-bar-title>

      <template v-slot:append>
        <v-btn
            @click="toggleTheme"
            :icon="currentTheme.dark ? 'mdi-moon-waning-crescent' : 'mdi-white-balance-sunny'"
        ></v-btn>
        <v-menu
            v-if="user"
            min-width="200px"
            rounded
        >
          <template v-slot:activator="{ props }">
            <v-btn
                icon
                v-bind="props"
            >
              <v-avatar
                  color="secondary"
              >
                <span class="text-h5">{{ user.username[0].toUpperCase() }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <div class="mx-auto text-center">
                <v-avatar
                    color="primary"
                >
                  <span class="text-h5">{{ user.username[0].toUpperCase() }}</span>
                </v-avatar>
                <h3>{{ user.username.toLowerCase() }}</h3>
                <v-divider class="my-3"></v-divider>
                <v-btn
                    @click="logout"
                    text="Déconnexion"
                    rounded
                    variant="text"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </template>
    </v-app-bar>
    <popup/>
  </div>
</template>

<style scoped>

</style>