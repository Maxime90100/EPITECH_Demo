<template>
  <div>
    <div
        id="dashboard"
        :style="{backgroundColor: currentTheme.colors.secondary}"
    >
      <div>Température actuelle: <b>{{temperature}}</b>°C</div>
      <div>Humidité actuelle: <b>{{humidity}}</b>%</div>
      <canvas id="myChart"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
import {mapState} from "vuex";
export default {
  name: "DashBoard",
  data(){
    return{
      temperature: null,
      humidity:null,
      chart:null
    }
  },
  computed:{
    ...mapState(['currentTheme'])
  },
  methods:{
    setChart(){
      const ctx = document.getElementById('myChart');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Température',
              data: [],
              borderWidth: 3,
              backgroundColor: 'red',
              borderColor:'red'
            },
            {
              label: 'Humidité',
              data: [],
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
    async addChart(temperature,humidity){
      const date = new Date().getHours() + 'h' + new Date().getMinutes() + ':' + new Date().getSeconds() + 's'
      this.chart.data.labels.push(date)
      this.chart.data.datasets[0].data.push(temperature)
      this.chart.data.datasets[1].data.push(humidity)
      this.chart.update()
    }
  },
  mounted(){
    this.setChart()
    this.$socket.on("sensorData", (data)=>{
      this.temperature = data.temperature
      this.humidity = data.humidity
      this.addChart(this.temperature,this.humidity)
    })
  }
}
</script>

<style scoped>
#dashboard{
  margin: 10px;
  padding: 10px;
  text-align: center;
  border-radius: 20px;
}
button{
  background-color: transparent;
  border-radius: 10px;
  padding: 5px;
  width: 20vw;
}
@media screen and (min-width: 1000px) {
  #dashboard{
    width: 60vw;
    margin: 0 20vw;
  }
}
</style>