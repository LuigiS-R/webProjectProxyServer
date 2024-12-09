const express = require('express')
const axios = require('axios')
const app = express()

app.use( (req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*')
    next()
})

//Setting a json response from the homepage
app.get('/', (req, res) => res.json({
    'message' : 'Hello World'
}))

app.get('/weather', (req, resp)=>{
    axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          lat: req.query.lat,
          lon: req.query.lon,
          appid: 'c1348e246938f5fa78a450f0e4f8a755'
        }
      })
      .then(response => {
        resp.json({
            'location': response.data.name,
            'temperature': response.data.main.temp,
            'humidity': response.data.main.humidity
            
        })
      })
      .catch(error => {
        console.error('Error:', error);
      });
})

app.get('/pollution', (req, resp)=>{
    axios.get('http://api.openweathermap.org/data/2.5/air_pollution', {
        params: {
          lat: req.query.lat,
          lon: req.query.lon,
          appid: 'c1348e246938f5fa78a450f0e4f8a755'
        }
      })
      .then(response => {
        resp.json({
            'pm2_5': response.data.list[0].components.pm2_5,
            'pm10': response.data.list[0].components.pm10,
            'nh3': response.data.list[0].components.nh3,
            'so2': response.data.list[0].components.so2
            
        })
      })
      .catch(error => {
        console.log('error: ', error);
      });
})

app.get('/forecast', (req, resp)=>{
  axios.get('http://api.weatherapi.com/v1/forecast.json', {
    params:{
      key: '3337f5c175c64ed3a28113820241411',
      q: req.query.location,//'Pusan'
      days: 3
    }
  })
  .then(response =>{
    var dates = []
    var temperatures = []
    var humidity = []
    for(let i = 0; i<3; i++){
      dates.push(response.data.forecast.forecastday[i].date);
      temperatures.push(response.data.forecast.forecastday[i].day.avgtemp_c);
      humidity.push(response.data.forecast.forecastday[i].day.avghumidity);
    }
    resp.json({
      'date' : dates,
      'temperature': temperatures,
      'humidity': humidity
    })
  })
  .catch(error =>{
    console.log("Error:", error)
  })
})

app.get('/geocoding', (req, res)=>{
  axios.get('http://api.openweathermap.org/geo/1.0/direct',{
    params:{
      q: req.query.city,
      appid: 'c1348e246938f5fa78a450f0e4f8a755'
    }
  })
  .then(response =>{
    res.json({
      'latitude': response.data[0].lat,
      'longitude': response.data[0].lon,
      'name': response.data[0].name,
      'country': response.data[0].country
    })
  })
  .catch(error=>{
    console.log("Error:", error);
  })
})

app.get('/time', (req, res)=>{
  axios.get('https://www.timeapi.io/api/time/current/coordinate', {
    params:{
      latitude: req.query.lat,
      longitude: req.query.lon
    }
  })
  .then(response=>{
    res.json({
      'hour' : response.data.hour,
      'minute': response.data.minute,
      'day': response.data.dayOfWeek
    })
  })
})

app.get('/ranking', (req, res)=>{
  axios.get('https://api.waqi.info/v2/map/bounds?token=197c0e1219e13311e584c9aefa437c16ac45b8f0&latlng=69.657086,-161.718163,-46.920255,170.106289')
  .then(response=>{
    let array = [];
    for(let i = 0; i<response.data.data.length; i++){
      let newObject = {aqi: response.data.data[i].aqi, name: response.data.data[i].station.name}
      array.push(newObject)
    }
    array.sort((objectA, objectB)=> objectA.aqi-objectB.aqi);
    let finalArray = []
    for(let i = 0; i<5; i++){
      finalArray.push(array[i]);
    }

    res.json({
      'top': finalArray
    })
  })
})

app.listen(3000, ()=>{
    console.log('Listening on port 3000')
})