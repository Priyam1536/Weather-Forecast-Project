const apiKey = "4b6e6b187c3843a1b73145223251108"; // api key from weatherapi.com
const cityInput = document.getElementById("cityInput"); 
const weatherDisplay = document.getElementById("weatherDisplay");
const errorMsg = document.getElementById("errorMsg");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const highTemp = document.getElementById("highTemp");
const lowTemp = document.getElementById("lowTemp");
const windEl = document.getElementById("wind");
const rainChance = document.getElementById("rainChance");
const hourlyForecast = document.getElementById("hourlyForecast");
const themeToggle = document.getElementById("themeToggle");

async function fetchWeather(query) {
  errorMsg.classList.add("hidden");
  weatherDisplay.classList.add("hidden");

  try {
    const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(query)}&days=1&aqi=no`);
    const data = await res.json();

    if (data.error) throw new Error(data.error.message);

    const weather = data.current;
    const forecast = data.forecast.forecastday[0];

    weatherIcon.src = "https:" + weather.condition.icon;
    description.textContent = weather.condition.text;
    temperature.textContent = Math.round(weather.temp_c) + "°C";
    highTemp.textContent = Math.round(forecast.day.maxtemp_c) + "°";
    lowTemp.textContent = Math.round(forecast.day.mintemp_c) + "°";
    windEl.textContent = weather.wind_kph + " kph";
    rainChance.textContent = forecast.day.daily_chance_of_rain + "%";

    hourlyForecast.innerHTML = "";
    forecast.hour.forEach(hour => {
      const card = document.createElement("div");
      card.className = "hour-card";
      card.innerHTML = `
        <p>${hour.time.split(" ")[1]}</p>
        <img src="https:${hour.condition.icon}" alt="">
        <p>${Math.round(hour.temp_c)}°</p>
      `;
      hourlyForecast.appendChild(card);
    });

    weatherDisplay.classList.remove("hidden");
  } catch (err) {
    console.error(err);
    errorMsg.classList.remove("hidden");
  }
}

cityInput.addEventListener("keyup", e => {
  if (e.key === "Enter" && cityInput.value.trim()) {
    fetchWeather(cityInput.value.trim());
  }
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀" : "🌙";
});

// Default load
fetchWeather("New York");
