const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");

const days = [
  "Nedelja",
  "Ponedeljak",
  "Utorak",
  "Srijeda",
  "Četvrtak",
  "Petak",
  "Subota",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Maj",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Dec",
];

const API_KEY = "1a3c642b03f325c67d6ce21c60c56512";

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const minutes = time.getMinutes();

  timeEl.innerHTML = hour + ":" + (minutes < 10 ? "0" + minutes : minutes);

  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

getWeatherData();
function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        showWeatherData(data);
      });
  });
}

function showWeatherData(data) {
  let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

  currentWeatherItemsEl.innerHTML = `<div class="weather-item">
        <div>Vlažnost</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pritisak</div>
        <div>${pressure} mbar</div>
    </div>
    <div class="weather-item">
        <div>Brzina vjetra</div>
        <div>${wind_speed} m/s</div>
    </div>

    <div class="weather-item">
        <div>Izlazak sunca</div>
        <div>${window.moment(sunrise * 1000).format("hh:mm")}</div>
    </div>
    <div class="weather-item">
        <div>Zalazak sunca</div>
        <div>${window.moment(sunset * 1000).format("hh:mm")}</div>
    </div>
    
    
    `;

  let otherDayForcast = "";
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      const dan = window.moment(day.dt * 1000).format("dddd");
      let dani = "";

      const daniU = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      const daniN = [
        "Ponedeljak",
        "Utorak",
        "Srijeda",
        "Četvrtak",
        "Petak",
        "Subota",
        "Nedelja",
      ];

      for (let i = 0; i < daniU.length; i++) {
        if (dan == daniU[i]) {
          dani += daniN[i];
        } else {
          console.log("err");
        }
      }
      let { temp } = data.current
      currentTempEl.innerHTML = `
            <img src="https://openweathermap.org/img/wn//${
              day.weather[0].icon
            }@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${dani}</div>
                <div class="temp">Temp: ${temp.toFixed(1)}&#176;C</div>
            </div>
            
            `;
    } else {
      const sdani = window.moment(day.dt * 1000).format("ddd");
      let sdan = "";

      const sdaniU = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const sdaniN = ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];

      for (let i = 0; i < sdaniU.length; i++) {
        if (sdani == sdaniU[i]) {
          sdan += sdaniN[i];
        } else {
          console.log("err");
        }
      }

      otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${sdan}</div>
                <img src="https://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Max: ${day.temp.max.toFixed(1)}&#176;C</div>
                <div class="temp">Min: ${day.temp.min.toFixed(1)}&#176;C</div>
            </div>
            
            `
    }
  });

  weatherForecastEl.innerHTML = otherDayForcast;
}
