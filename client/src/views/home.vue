<script>
import textSlider from "@/components/animations/text/textSlider.vue";
import {mapState} from "vuex";
export default {
  components:{
    textSlider
  },
  computed: {
    ...mapState(['currentTheme']),
    imagePath(){
      return this.currentTheme.dark ? "src/assets/images/structure_dark.png" : "src/assets/images/structure_light.png";
    }
  }
}
</script>

<template>
  <div>
    <textSlider
        style="margin-top: 20px"
          :first="{text:'Maxime',color:'#004479'}"
          :second="{text:'Développeur',color:'#004479'}"
          :third="{text:'Motivé',color:'#b00000'}"
      />
    <v-img
        :src="imagePath"
        alt="Structure du projet"
        height="60vh"
        class="ma-2"
    />
  </div>
</template>

<style scoped>

</style>