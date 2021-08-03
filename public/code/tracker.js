

fetchData()

async function fetchData () {

  // Use fetch to get data from /api
  const response = await fetch('/api')
  const data = await response.json()
  console.log(data)

  let aqText
  let aqClass
  
  // AQ INDEX
  // < 51 = 'GOOD'
  // > 50 && < 101 = 'Moderate'
  // > 100 && < 151 = 'Unhealthy for sentive groups'
  // > 150 && < 201 = 'Unhealthy'
  // > 200 && < 301 = 'Very Unhealthy'
  // > 300  = 'Hazardous'

 


  let counter = 0
  data.forEach( item => {
    counter++

    // define aq Text

    if ( item.aqi < 51 ) {
      aqText = 'Good'
    } else if (item.aqi < 50  && item.aqi < 101 ) {
      aqText = 'Moderate'
    } else if (item.aqi < 100  && item.aqi < 151 ) {
      aqText = 'Unhealthy for sentive groups'
    } else if (item.aqi < 150  && item.aqi < 201 ) {
      aqText = 'Unhealthy'
    } else if (item.aqi < 200  && item.aqi < 301 ) {
      aqText = 'Very Unhealthy'
    } else if (item.aqi > 300 ) {
      aqText = 'Hazardous'
    }



    // Create container for entry
    const container = document.createElement('div') 


    container.innerHTML = `
      <section class="mood_container">
        <span class="delete-button" data-id="${item._id}">x</span>
        <p class="counter">${counter}</p>
        <p class="data">${new Date(item.timestamp).toLocaleString()}</p>
        <p class="mood">${item.mood}</p>
        <div class="face_container"><img src="${item.image64}"></div>
        <div class="more_info">
          <div class="weatherDis">
            <i class="fas fa-thermometer-empty"></i>
            <div>
              <div class="temp">${item.weather}°C</div>
              <div class="summary">${item.description}</div>
            </div>
          </div>
          <div class="locationDis">
            <i class="fas fa-map-marker-alt"></i>
            <p class="location">${item.city}</p>
          </div>  
          <div class="airDis">
            <i class="fas fa-wind"></i>
            <div class="aqi">${item.aqi}: <span>${aqText}</span></div>
          </div>
        </div>
      </section>
    `

    document.querySelector('main').append(container)
  })



  const allMoods = document.querySelectorAll('.mood_container')
  allMoods.forEach(mood => {
    mood.addEventListener('click', async e => {

      if (document.querySelector('.success-message')){
        document.querySelector('.success-message').remove()
      }

      if (e.target.classList.contains('delete-button')){
        console.log('deleting', e.target.dataset.id)
        const response = await fetch(`/delete/${e.target.dataset.id}`)
        const json = await response.json()
        console.log(json)

        if (json.success) {
          const message = document.createElement('span')
          message.classList.add('success-message')
          message.innerHTML = "Entry Deleted"
          document.querySelector('main').after(message)
        }
      }
    })
  })

}



