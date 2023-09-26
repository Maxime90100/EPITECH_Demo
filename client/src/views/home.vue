<script>
import textSlider from "@/components/animations/text/textSlider.vue";
export default {
  components:{
    textSlider
  },
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
  </div>
</template>

<style scoped>

</style>