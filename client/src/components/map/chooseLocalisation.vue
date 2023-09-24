<script>
import {mapActions, mapState} from "vuex";
export default {
  computed:{
    ...mapState('geographieModule',['regions','regionsOnLoad','selectedRegion','selectedRegionId','departements','departementsOnLoad','selectedDepartement','selectedDepartementId','communes','communesOnLoad','selectedCommune','selectedCommuneId']),
    computedSelectedRegionId: {
      get(){return this.selectedRegionId},
      set(regionId){return this.setRegion(regionId)}
    },
    computedSelectedDepartementId: {
      get(){return this.selectedDepartementId},
      set(departementId){return this.setDepartement({regionId:this.selectedRegionId,departementId:departementId})}
    },
    computedSelectedCommuneId: {
      get(){return this.selectedCommuneId},
      set(communeId){return this.setCommune(communeId)}
    }
  },
  methods:{
    ...mapActions('geographieModule',['initializeGeographieModule','setRegion','setDepartement','setCommune','getLocalisation']),
    async setup(){
      await this.initializeGeographieModule();
    }
  },
  mounted() {
    this.setup();
  }
}
</script>

<template>
  <div>
      <v-autocomplete
          v-model="computedSelectedRegionId"
          :items="regions"
          :item-title="item => item.nom + ` (${item.code})`"
          :item-value="item => item.code"
          :append-icon="departementsOnLoad ? 'mdi-dots-horizontal' : 'mdi-close'"
          @click:append="computedSelectedRegionId = null"
          label="Choisir une région"
          density="compact"
      />

      <v-autocomplete
          v-if="departements.length > 0"
          v-model="computedSelectedDepartementId"
          :items="departements"
          :item-title="item => item.nom + ` (${item.code})`"
          :item-value="item => item.code"
          :append-icon="communesOnLoad ? 'mdi-dots-horizontal' : 'mdi-close'"
          @click:append="computedSelectedDepartementId = null"
          label="Choisir un département"
          density="compact"
      />

    <v-autocomplete
          v-if="communes.length > 0"
          v-model="computedSelectedCommuneId"
          :items="communes"
          :item-title="item => item.nom + ` (${item.code})`"
          :item-value="item => item.code"
          append-icon="mdi-close"
          @click:append="computedSelectedCommuneId = null"
          label="Choisir une commune"
          density="compact"
      />

    <v-btn
        text="localisation"
        append-icon="mdi-map-marker-outline"
        v-on:click="getLocalisation"
    />
  </div>
</template>

<style scoped>

</style>