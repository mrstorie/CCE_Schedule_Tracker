// Weather API setup
const API_KEY = "69e1db710cd2fe4903a85b7ebf97f627";
const LOCATION = "Highlands Ranch, US";
const currentWeatherEl = document.getElementById("current-weather");
const twoHourWeatherEl = document.getElementById("two-hour-weather");
const threePMWeatherEl = document.getElementById("three-pm-weather");

// School schedule
const schedule = {
    Monday: [
      { period: "Period 1", start: "07:45", end: "09:19" },
      { period: "Period 2", start: "09:24", end: "10:58" },
      { period: "A Lunch", start: "10:58", end: "11:32" },
      { period: "Period 3", start: "11:37", end: "13:11" },
      { period: "Period 4", start: "13:16", end: "14:50" }
    ],
    Tuesday: [
      { period: "PLC", start: "07:30", end: "08:05" },
      { period: "Period 5", start: "08:05", end: "09:39" },
      { period: "Homeroom", start: "09:39", end: "09:49" },
      { period: "Structured Academic Support", start: "09:49", end: "10:56" },
      { period: "A Lunch", start: "10:56", end: "11:32" },
      { period: "Period 6", start: "11:37", end: "13:11" },
      { period: "Period 7", start: "13:16", end: "14:50" }
    ],
    Wednesday: [
      { period: "Teacher Office Hours", start: "07:30", end: "07:45" },
      { period: "Period 1", start: "07:45", end: "09:19" },
      { period: "Period 2", start: "09:24", end: "10:58" },
      { period: "A Lunch", start: "10:58", end: "11:32" },
      { period: "Period 3", start: "11:37", end: "13:11" },
      { period: "Period 4", start: "13:16", end: "14:50" }
    ],
    Thursday: [
      { period: "PLC", start: "07:30", end: "08:05" },
      { period: "Period 5", start: "08:05", end: "09:39" },
      { period: "Homeroom", start: "09:39", end: "09:49" },
      { period: "EAGLE TIME", start: "09:49", end: "10:56" },
      { period: "A Lunch", start: "10:56", end: "11:32" },
      { period: "Period 6", start: "11:37", end: "13:11" },
      { period: "Period 7", start: "13:16", end: "14:50" }
    ],
    Friday: [
      { period: "Teacher Office Hours", start: "07:30", end: "07:45" },
      { period: "Period 1", start: "07:45", end: "08:36" },
      { period: "Period 2", start: "08:41", end: "09:32" },
      { period: "Period 3", start: "09:37", end: "10:28" },
      { period: "Period 4", start: "10:33", end: "11:24" },
      { period: "A Lunch", start: "11:24", end: "12:02" },
      { period: "Period 5", start: "12:07", end: "12:58" },
      { period: "Period 6", start: "13:03", end: "13:54" },
      { period: "Period 7", start: "13:59", end: "14:50" }
    ]
  };

const currentPeriodEl = document.getElementById("current-period");
const timeRemainingEl = document.getElementById("time-remaining");

// Function to format time
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

// Update current time every second
setInterval(() => {
  const now = new Date();
  document.getElementById("current-time").innerText = formatTime(now);
  updateSchedule(now);
}, 1000);

// Fetch weather data
async function fetchWeather() {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${LOCATION}&units=imperial&appid=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const current = data.list[0];
    const inTwoHours = data.list[1];
    const at3PM = data.list.find(item => new Date(item.dt_txt).getHours() === 15);

    currentWeatherEl.innerHTML = `Now .......... <span>${Math.round(current.main.temp)}°F</span>`;
    twoHourWeatherEl.innerHTML = `In 2 Hours ... <span>${Math.round(inTwoHours.main.temp)}°F</span>`;
    threePMWeatherEl.innerHTML = `At 3 PM ...... <span>${Math.round(at3PM.main.temp)}°F</span>`;
  } catch (error) {
    currentWeatherEl.innerText = "Error fetching weather.";
    twoHourWeatherEl.innerText = "";
    threePMWeatherEl.innerText = "";
  }
}
  
fetchWeather();
setInterval(fetchWeather, 300000);

// Update class period info
function updateSchedule(now) {
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const currentDaySchedule = schedule[day] || [];
  const currentTime = now.getHours() * 60 + now.getMinutes();

  let currentPeriod = "N/A";
  let timeRemaining = "";

  for (const period of currentDaySchedule) {
    const [startHour, startMin] = period.start.split(":").map(Number);
    const [endHour, endMin] = period.end.split(":").map(Number);
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (currentTime >= startTime && currentTime < endTime) {
      currentPeriod = period.period;
      timeRemaining = `${endTime - currentTime} minutes remaining`;
      break;
    }
  }

  currentPeriodEl.innerText = `Current: ${currentPeriod}`;
  timeRemainingEl.innerText = timeRemaining || "Not in Session";
}
