const express = require('express')
const fetch = require('node-fetch')
const Datastore = require('nedb')
// const bodyParser = require('body-parser')
require('dotenv').config()


const app = express()
const port = process.env.PORT || 3004

app.listen( port, () => {
  console.log(`App is listening at: http://localhost:${port}`)
})
// app.use(bodyParser.urlencoded({extended : true}))

app.use(express.static('public'))

app.use(express.json({
  limit:'1mb'
}))

// define and load the database
const database = new Datastore('database/database.db')
database.loadDatabase()

// Database API (POST / Insert) 
app.post('/api', (req, res) => {
  // Send information to the database
  console.log('Database post endpoint got a request')
  const data = req.body
  // console.log(data)
  const timestamp = Date.now()
  data.timestamp = timestamp
  // console.log(data)
  database.insert(data)
  data.success = true
  res.json(data)
})

// Database API (GET / read)
app.get('/api', (req, res) => {
  // Send the information from the database to the client
  database.find({}, (err, data) => {
    
    if (err) {
      console.error(err)
      res.end()
    }
    // send data to client
    
    res.json(data)
    
  })

})

app.get('/delete/:id', (req, res) => {
  let id = req.params.id
  console.log(id)
  database.remove({ _id: id }, {}, function (err, numRemoved) {
    // numRemoved = 1
    if (numRemoved > 0 ) {
      res.json({success:true})
    } else {
      console.log(err)
      res.json(err)
      // res.end()
    }
  });
})


// Weather and AQI API Endpoint
app.get('/weather/:latlon', async (req, res) => {
  const latlon = req.params.latlon.split(',')
  const lat = latlon[0]
  const lon = latlon[1]
  // console.log(lat, lon)

  // API Key to OWM
  const apiKeyWeather = process.env.API_KEY_WEATHER
  const apiKeyAQI = process.env.API_KEY_AQI
  
  // Request for weather
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKeyWeather}&units=metric`
  const weatherResponse = await fetch(weatherUrl)
  const weatherJson = await weatherResponse.json()
  // Request for AQI
  const aqiUrl = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${apiKeyAQI}`
  const aqiResponse = await fetch(aqiUrl)
  const aqiJson = await aqiResponse.json()

  console.log(aqiJson)

  const data = {
    weather: weatherJson,
    aqi : aqiJson.data.aqi
  }
  // Send response to the client
  res.json(data)

})