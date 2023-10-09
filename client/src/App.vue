<script>
import bottomNavigation from "@/components/navigation/bottomNaviguation.vue";
import appBar from "@/components/navigation/appBar.vue";
import {mapMutations, mapState} from "vuex";
import {useTheme} from "vuetify";
export default {
  components:{
    bottomNavigation,
    appBar
  },
  beforeMount() {
    const theme = useTheme().global.current.value;
    this.setTheme(theme);
  },
  computed:{
    ...mapState(['currentTheme'])
  },
  data(){
    return{
      navigationItems:[
        {name:'Accueil',icon:'mdi-home',color:'primary',href:'/'},
        {name:'Carte',icon:'mdi-map',color:'primary',href:'/map'},
        {name:'Capteurs',icon:'mdi-sun-thermometer-outline',color:'primary',href:'/sensors'},
        {name:'Blog',icon:'mdi-post-outline',color:'primary',href:'/blog'},
      ]
    }
  },
  methods:{
    ...mapMutations(['setTheme'])
  },
  beforeUnmount() {
    this.$socket.disconnect();
  }
}
</script>

<template>
  <div id="app">
    <v-app>
      <appBar/>
      <v-main>
        <router-view/>
      </v-main>
      <bottomNavigation :items="navigationItems"/>
    </v-app>
  </div>
</template>

<style scoped>

</style>
