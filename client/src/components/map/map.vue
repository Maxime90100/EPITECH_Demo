<script>
import ChooseLocalisation from "@/components/map/chooseLocalisation.vue";
import {mapActions, mapState} from "vuex";
export default {
  components:{
    ChooseLocalisation,
  },
  data() {
    return {
      pathMapSVG: 'src/assets/map/mapCommunes.svg',
      mapLoading: true,
      mapSVG: null,
      editableMapSVG: null,
      tooltipText: null,
      tooltipPop: null,
      showPop: false
    };
  },
  computed:{
    ...mapState(['currentTheme']),
    ...mapState('geographieModule',['selectedRegion','selectedDepartement','selectedCommune','allCommunes','populationLegend']),
  },
  watch:{
    selectedRegion: 'showMap',
    selectedDepartement: 'showMap',
    selectedCommune: 'showMap',
    showPop: 'statPopulation',
    currentTheme: 'showMap'
  },
  async mounted() {
    await this.fetchAndProcessSVG();
    await this.showMap();
  },
  methods: {
    ...mapActions('geographieModule',['getMapCommunes']),
    async fetchAndProcessSVG() {
      try {
        const response = await fetch(this.pathMapSVG);
        if (response.ok) {
          const svgContent = await response.text();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(svgContent, 'text/xml');
          const svgElement = xmlDoc.querySelector('svg');

          this.addListeners(svgElement);

          this.mapSVG = svgElement.cloneNode(true);
          this.editableMapSVG = svgElement;
          const svgContainer = this.$refs.mapSVG;
          svgContainer.appendChild(svgElement);

          this.mapLoading = false;
        } else {
          console.error('Échec de la récupération du fichier SVG.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération et du traitement du fichier SVG :', error);
      }
    },
    addListeners(svgElement){
      // TOOLTIP POSITION
      svgElement.addEventListener('mousemove', (event)=>{
        const tooltip = document.getElementById('tooltip')
        tooltip.style.left = event.clientX + 'px';
        tooltip.style.top = event.clientY + 'px';
      });
      svgElement.addEventListener('mouseleave', ()=>{
        this.tooltipText = null;
      });
      // TOOLTIP TEXT
      const pathElements = svgElement.querySelectorAll('path');
      pathElements.forEach((path) => {
        path.addEventListener('mouseover', () => {
          this.tooltipText = path.id;
          const code = path.id.split(' ')[0];
          const commune = this.allCommunes.find(commune => commune.code === code);
          this.tooltipPop = commune ? commune.population : 'x';
        });
        path.style.fill = this.currentTheme.colors.secondary;
      });
    },
    reloadMap() {
      while (this.editableMapSVG.firstChild) {
        this.editableMapSVG.removeChild(this.editableMapSVG.firstChild);
      }
      const clonedChildren = this.mapSVG.cloneNode(true).childNodes;
      clonedChildren.forEach((child) => {
        this.editableMapSVG.appendChild(child.cloneNode(true));
      });
      const viewBox = this.mapSVG.getAttribute('viewBox');
      this.editableMapSVG.setAttribute('viewBox', viewBox);
      this.addListeners(this.editableMapSVG);
    },
    focusOnElement(element) {
      if (element) {
        const viewBox = this.editableMapSVG.getAttribute('viewBox').split(' ').map(parseFloat);
        const bBox = element.getBBox();

        const widthZoomLevel = viewBox[2] / bBox.width;
        const heightZoomLevel = viewBox[3] / bBox.height;
        const zoomLevel = Math.min(widthZoomLevel, heightZoomLevel);
        const newWidth = viewBox[2] / zoomLevel;
        const newHeight = viewBox[3] / zoomLevel;

        const centerX = bBox.x + bBox.width / 2;
        const centerY = bBox.y + bBox.height / 2;
        const newX = centerX - (newWidth / 2);
        const newY = centerY - (newHeight / 2);

        this.editableMapSVG.setAttribute('viewBox', `${newX} ${newY} ${newWidth} ${newHeight}`);
      }
    },
    async showMap(){
      if(this.selectedRegion){
        this.reloadMap();
        const groups = this.editableMapSVG.querySelectorAll('g');
        const regions = Array.from(groups).filter((group)=>{
          return group.querySelectorAll('g').length > 0;
        });
        regions.forEach((region)=>{
          const codeRegion = region.id.split(' ')[0];
          if(codeRegion !== this.selectedRegion.code){
            region.parentNode.removeChild(region);
          } else  {
            this.focusOnElement(region);
            if(this.selectedDepartement){
              const departements = region.querySelectorAll('g');
              departements.forEach((departement)=>{
                const codeDepartement = departement.id.split(' ')[0];
                if(codeDepartement !== this.selectedDepartement.code){
                  departement.parentNode.removeChild(departement);
                } else {
                  this.focusOnElement(departement);
                  if(this.selectedCommune){
                    const communes = departement.querySelectorAll('path');
                    communes.forEach((commune)=>{
                      const codeCommune = commune.id.split(' ')[0];
                      if(codeCommune === this.selectedCommune.code){
                        commune.style.fill = this.currentTheme.colors.primary;
                      }
                    });
                  }
                }
              });
            }
          }
        });
      } else {this.reloadMap();}
      if(this.showPop) await this.statPopulation();
    },
    async statPopulation() {
      if(this.showPop){
        if (this.allCommunes.length === 0) {
          await this.getMapCommunes();
        }

        const communeMap = new Map();
        this.allCommunes.forEach((commune) => {
          communeMap.set(commune.code, commune);
        });

        const paths = this.editableMapSVG.querySelectorAll('path');
        paths.forEach((path) => {
          const code = path.id.split(' ')[0];
          const commune = communeMap.get(code);
          if (commune) {
            path.style.fill = commune.color;
          }
        });
      } else {
        const paths = this.editableMapSVG.querySelectorAll('path');
        paths.forEach((path)=>{
          const code = path.id.split(' ')[0];
          if(this.selectedCommune && this.selectedCommune.code === code){
            path.style.fill = this.currentTheme.colors.primary;
          } else {
            path.style.fill = this.currentTheme.colors.secondary;
          }
        });
      }
    }
  },
};
</script>

<template>
  <div>
    <div class="container">
      <v-progress-circular
          v-if="mapLoading"
          indeterminate
          class="mapSVG"
      />
      <div
          id="tooltip"
          v-if="tooltipText"
          :style="{
          backgroundColor: currentTheme.colors.primary,
          color: currentTheme.colors['primary-text']
        }"
      >
        {{tooltipText}}
        <div>
          <v-icon icon="mdi-account-multiple"/>
          {{tooltipPop}}
        </div>
      </div>
      <svg
          id="mapSVG"
          ref="mapSVG"
          class="mapSVG"
          xmlns="http://www.w3.org/2000/svg"
      />
      <ChooseLocalisation id="chooser"/>
    </div>
    <hr>
    <div class="container">
      <v-btn
          class="hugeButton"
          :text="showPop ? 'carte' : 'démographie'"
          v-on:click="showPop = !showPop"
      />
      <div v-if="showPop">
        <h1>Population :</h1>
        <v-rating
            v-if="populationLegend"
            v-model="Object.keys(populationLegend).length"
            :length="Object.keys(populationLegend).length"
            :item-labels="Object.values(populationLegend)"
        >
          <template v-slot:item="props">
            <v-icon
                icon="mdi-map-marker"
                :style="{ color: Object.keys(populationLegend)[props.index] }"
                size="large"
                density="confortable"
            />
          </template>
          <template v-slot:item-label="props">
          <span
              :style="'color: ' + Object.keys(populationLegend)[props.index]"
          >
            {{ props.label === null ? `<${Object.values(populationLegend)[Object.keys(populationLegend).length - 2]}` : props.label === 0 ? '0' : '>' + props.label}}
          </span>
          </template>
        </v-rating>
      </div>
    </div>
    <hr>
  </div>
</template>

<style scoped>
.container{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
hr{
  margin-top: 20px;
  margin-bottom: 20px;
}
.mapSVG{
  padding: 10px;
  width: 50vw;
  height: 50vw;
}
#tooltip{
  position: absolute;
  font-size: 1.5vw;
  z-index: 1;
  padding: 2px;
  border-radius: 10px;
  pointer-events: none;
}
#chooser{
  width: 50vw;
}

/* MODE TELEPHONE */
@media screen and (max-width: 500px) {
  .container {
    display: block;
  }
  .mapSVG{
    width: 100vw;
    height: 100vw;
  }
  #chooser{
    width: 100vw;
  }
}
/* MODE ORDINATEUR */
@media screen and (min-width: 1024px) {
  .mapSVG{
    width: 80vh;
    height: 80vh;
  }
}
</style>
