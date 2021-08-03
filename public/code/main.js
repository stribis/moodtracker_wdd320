function setup () {

  // Remove Canvas
  noCanvas()
  // Capture video from webcam
  const video = createCapture()
  video.parent('main-container')
  video.size(320, 240)

  let lat, lon, city, weather, description, aqi
  // Geo-locate
  // console.log(navigator)
  if( 'geolocation' in navigator ) {
    navigator.geolocation.getCurrentPosition( async position => {

      try {

        console.log(position)
        // We have location from user
        lat = position.coords.latitude
        lon = position.coords.longitude

        const apiUrl = `weather/${lat},${lon}`

        // Gather response from server
        const response = await fetch(apiUrl)
        const json = await response.json()
        console.log(json)

        city = json.weather.name
        weather = json.weather.main.temp
        description = json.weather.weather[0].description
        aqi = json.aqi

        const template = `
        <div class="more_info">
          <div class="weatherDis">
            <i class="fas fa-thermometer-empty"></i>
            <div>
              <div class="temp">${weather}</div>
              <div class="summary">${description}</div>
            </div>
          </div>
          <div class="locationDis">
            <i class="fas fa-map-marker-alt"></i>
            <p class="location" title="${lat},${lon}">${city}</p>
          </div>
          <div class="airDis">
            <i class="fas fa-wind"></i>
            <div class="aqi">${aqi}</div>
          </div>
        </div>
        ` 

        const weatherDiv = document.createElement('div')
        weatherDiv.innerHTML = template
        document.querySelector('main').append(weatherDiv)
      } catch(error) {
        console.error(error)
      }  
        

    })
  } else {
    console.error('Geolocation is not available in this browser')
  }

  // What happens after user clicks send

  document.querySelector('form button').addEventListener('click', async e => {
    e.preventDefault()

    // Reset Messages
    if (document.querySelector('.success-message')) document.querySelector('.success-message').remove()
    if (document.querySelector('.error-message')) document.querySelector('.error-message').remove()

    // Get user input
    const mood = document.querySelector('form input').value
    // Get current image
    video.loadPixels()
    const image64 = video.canvas.toDataURL()

    const data = {
      mood,
      city,
      weather,
      description,
      aqi,
      image64
    }


    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }

    // Send data to API endpoint
    const response = await fetch('/api', options)
    const json = await response.json()

    console.log(json)
    if (json.success) {
  
      const message = document.createElement('span')
      message.classList.add('success-message')
      message.innerHTML = "Mood has been added"
      document.querySelector('form').after(message)
    }else {
      const message = document.createElement('span')
      message.classList.add('error-message')
      message.innerHTML = "Something went wrong"
      document.querySelector('form').after(message)
    }

  })





}