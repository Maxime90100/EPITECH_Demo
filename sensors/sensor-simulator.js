const io = require("socket.io-client");
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });
const socket = io(process.env.SERVER_URL);

let previousTemperature = null;
let previousHumidity = null;

function generateDataTemperature(temperatureMin, temperatureMax, delta){
    const min = previousTemperature !== null ? Math.max(temperatureMin, previousTemperature - delta) : temperatureMin;
    const max = previousTemperature !== null ? Math.min(temperatureMax, previousTemperature + delta) : temperatureMax;
    const newTemperature = Math.floor(Math.random() * (max - min + 1) + min);
    previousTemperature = newTemperature;
    return newTemperature;
}

function generateDataHumidity(humidityMin, humidityMax, delta){
    const min = previousHumidity !== null ? Math.max(humidityMin, previousHumidity - delta) : humidityMin;
    const max = previousHumidity !== null ? Math.min(humidityMax, previousHumidity + delta) : humidityMax;
    const newHumidity = Math.floor(Math.random() * (max - min + 1) + min);
    previousHumidity = newHumidity;
    return newHumidity;
}

setInterval(() => {
    const temperature = generateDataTemperature(-10,30,10);
    const humidity = generateDataHumidity(25,80,15);
    const data = {temperature:temperature, humidity:humidity, timestamp:Date.now()}
    console.log(data);
    socket.emit("sensorData", data);
}, 5000);
