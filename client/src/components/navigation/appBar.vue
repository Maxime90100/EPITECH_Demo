<script>
import vuetify from "@/plugins/vuetify";
import {mapMutations, mapState} from "vuex";

export default {
  computed:{
    ...mapState(['currentTheme'])
  },
  methods:{
    ...mapMutations(['setTheme']),
    toggleTheme(){
      vuetify.theme.global.name.value = vuetify.theme.global.current.value.dark ? 'lightTheme' : 'darkTheme';
      this.setTheme(vuetify.theme.global.current.value);
    }
  }
}
</script>

<template>
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
      </template>
    </v-app-bar>
</template>

<style scoped>

</style>