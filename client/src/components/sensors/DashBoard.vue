<template>
  <div>
    <div
        id="dashboard"
        :style="{ backgroundColor: currentTheme.colors.secondary }"
    >
      <div v-if="currentTemperature || currentHumidity">
        Données actuelles:
        <h1>
          {{ currentTemperature }}°C
          <v-icon color="red">mdi-sun-thermometer-outline</v-icon>
          {{ currentHumidity }}%
          <v-icon color="blue">mdi-water-thermometer-outline</v-icon>
        </h1>
      </div>
      <canvas id="myChart"></canvas>
      <v-btn
          v-on:click="deleteData"
          text="Supprimer"
      />
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
import {mapState} from "vuex";
import {getRequest} from "@/services/axios.service";
export default {
  name: "DashBoard",
  data(){
    return{
      data: null,
      currentTemperature: null,
      currentHumidity:null,
      chart:null,
      minDate:null,
      maxDate:null,
    }
  },
  computed:{
    ...mapState(['currentTheme'])
  },
  methods:{
    async deleteData() {
      const result = await getRequest('/sensors/data/delete')
      if(result.error) {
        alert(result.error)
      } else {
        location.reload();
        alert(`${result.deletedCount} données ont été supprimées`)
      }
    },
    setChart(data){
      const ctx = document.getElementById('myChart');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(data => data.timestamp),
          datasets: [
            {
              label: 'Température',
              data: data.map(data => data.temperature),
              borderWidth: 3,
              backgroundColor: 'red',
              borderColor:'red'
            },
            {
              label: 'Humidité',
              data: data.map(data => data.humidity),
              borderWidth: 3,
              backgroundColor: 'blue',
              borderColor:'blue'
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Evolution de la Température (°C) et de l\'Humidité (%) en temps réél',
            }
          },
          scales: {
            y: {
              min: -10,
              max: 100
            }
          }
        }
      })
      Object.seal(chart)
      this.chart = chart
    },
    async addChart(temperature,humidity,timestamp){
      this.chart.data.labels.push(timestamp)
      this.chart.data.datasets[0].data.push(temperature)
      this.chart.data.datasets[1].data.push(humidity)
      this.chart.update()
    }
  },
  async mounted() {
    this.data = await getRequest('/sensors/data')
    this.setChart(this.data)
    this.$socket.on("sensorData", (data) => {
      this.currentTemperature = data.temperature
      this.currentHumidity = data.humidity
      this.addChart(this.currentTemperature, this.currentHumidity, new Date(data.timestamp).toISOString())
    })
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
</script>

<style scoped>
#dashboard {
  margin: 10px;
  padding: 10px;
  text-align: center;
  border-radius: 20px;
}
button {
  background-color: transparent;
  border-radius: 10px;
  padding: 5px;
  width: 20vw;
}
@media screen and (min-width: 1000px) {
  #dashboard {
    width: 60vw;
    margin: 0 20vw;
  }
}
</style>
