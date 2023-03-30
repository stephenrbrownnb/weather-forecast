const form = document.querySelector('#user-form');
const searchHistory = document.querySelector('#search-history');
const searchTerm = document.querySelector('#repo-search-term');
const reposContainer = document.querySelector('#repos-container');

let cities = [];

// Add event listener to form
form.addEventListener('submit', function(event) {
  event.preventDefault();
  const input = document.querySelector('#username');
  const city = input.value.trim();
  if (city.length) {
    geocode(city);
    input.value = '';
  }
});

// Add event listener to search history
searchHistory.addEventListener('click', function(event) {
  if (event.target.matches('button')) {
    const city = event.target.textContent.trim();
    geocode(city);
  }
});

// Geocode city name to get latitude and longitude
async function geocode(city) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token={2943a7908b1bb114d559f8b52228f1f7}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const { center } = data.features[0];
    const [longitude, latitude] = center;
    getWeather(latitude, longitude, city);
  } catch (error) {
    console.error(error);
    alert('An error occurred while geocoding the city.');
  }
}

// Get weather data from API
async function getWeather(latitude, longitude, city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid={2943a7908b1bb114d559f8b52228f1f7}&units=metric`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayWeather(data, city);
  } catch (error) {
    console.error(error);
    alert('An error occurred while fetching weather data.');
  }
}

// Display weather data in UI
function displayWeather(data, city) {
  // Update search term
  searchTerm.textContent = city;

  // Create weather card
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <div class="card-body">
      <h3 class="card-title">${city}</h3>
      <p class="card-text">${data.weather[0].description}</p>
      <p class="card-text">${data.main.temp} &#8451;</p>
    </div>
  `;

  // Add card to container
  reposContainer.appendChild(card);

  // Add city to search history
  if (!cities.includes(city)) {
    cities.push(city);
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-block');
    button.textContent = city;
    searchHistory.appendChild(button);
  }
}