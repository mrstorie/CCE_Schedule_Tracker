// Elements for displaying the current periods and time remaining
const periodEl1 = document.getElementById("period1");
const periodEl2 = document.getElementById("period2");
const timeLeftEl1 = document.getElementById("time-left1");
const timeLeftEl2 = document.getElementById("time-left2");

const schedule = [
  {
    day: "Monday",
    periods: [
      { name: "Period 1", start: "07:45", end: "09:19" },
      { name: "Period 2", start: "09:24", end: "10:58" },
      { name: "A Lunch", start: "10:58", end: "11:32" },
      { name: "Class (A Lunch)", start: "11:37", end: "13:11" },
      { name: "Class (B Lunch)", start: "11:03", end: "12:37" },
      { name: "B Lunch", start: "12:37", end: "13:11" },
      { name: "Period 4", start: "13:16", end: "14:50" },
    ],
  },
  {
    day: "Tuesday",
    periods: [
      { name: "PLC", start: "07:30", end: "08:05" },
      { name: "Period 5", start: "08:05", end: "09:39" },
      { name: "Homeroom / Structured Academic Support", start: "09:39", end: "10:56" },
      { name: "A Lunch", start: "10:56", end: "11:32" },
      { name: "Class (A Lunch)", start: "11:37", end: "13:11" },
      { name: "Class (B Lunch)", start: "11:01", end: "12:35" },
      { name: "B Lunch", start: "12:35", end: "13:11" },
      { name: "Period 7", start: "13:16", end: "14:50" },
    ],
  },
  {
    day: "Wednesday",
    periods: [
      { name: "Period 1", start: "07:45", end: "09:19" },
      { name: "Period 2", start: "09:24", end: "10:58" },
      { name: "A Lunch", start: "10:58", end: "11:32" },
      { name: "Class (A Lunch)", start: "11:37", end: "13:11" },
      { name: "Class (B Lunch)", start: "11:03", end: "12:37" },
      { name: "B Lunch", start: "12:37", end: "13:11" },
      { name: "Period 3", start: "13:16", end: "14:50" },
    ],
  },
  {
    day: "Thursday",
    periods: [
      { name: "PLC", start: "07:30", end: "08:05" },
      { name: "Period 5", start: "08:05", end: "09:39" },
      { name: "Homeroom / Eagle Time", start: "09:39", end: "10:56" },
      { name: "A Lunch", start: "10:56", end: "11:32" },
      { name: "Class (A Lunch)", start: "11:37", end: "13:11" },
      { name: "Class (B Lunch)", start: "11:01", end: "12:35" },
      { name: "B Lunch", start: "12:35", end: "13:11" },
      { name: "Period 7", start: "13:16", end: "14:50" },
    ],
  },
  {
    day: "Friday",
    periods: [
      { name: "Period 1", start: "07:45", end: "08:36" },
      { name: "Period 2", start: "08:41", end: "09:32" },
      { name: "Period 3", start: "09:37", end: "10:28" },
      { name: "Period 4", start: "10:33", end: "11:24" },
      { name: "A Lunch", start: "11:24", end: "12:02" },
      { name: "Class (A Lunch)", start: "12:07", end: "12:58" },
      { name: "Class (B Lunch)", start: "11:29", end: "12:20" },
      { name: "B Lunch", start: "12:20", end: "12:58" },
      { name: "Period 6", start: "13:03", end: "13:54" },
      { name: "Period 7", start: "13:59", end: "14:50" },
    ],
  },
];


// Helper function to get the current time in "HH:MM:SS" format
function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function getCurrentDate() {
  const now = new Date();
  const weekday = now.toLocaleString("en-US", { weekday: "long" });
  const month = now.toLocaleString("en-US", { month: "long" });
  const day = now.getDate();
  const year = now.getFullYear();
  return `${weekday}, ${month} ${day}, ${year}`;
}

// Function to find the current periods
function getCurrentPeriods() {
  const now = getCurrentTime().slice(0, 5); // Extract HH:MM for comparison
  const today = new Date().toLocaleString("en-US", { weekday: "long" });
  const todaySchedule = schedule.find((d) => d.day === today);

  if (!todaySchedule) return [];

  return todaySchedule.periods.filter(
    (period) => now >= period.start && now < period.end
  );
}

// Function to calculate the time remaining for a period
function getTimeRemaining(endTime) {
  const now = new Date();
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const end = new Date();
  end.setHours(endHour, endMinute, 0, 0);

  const diff = Math.max(0, end - now); // Time difference in milliseconds
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return `${minutes}m ${seconds}s`;
}

// Function to update the displayed periods and time remaining
function updatePeriods() {
  const currentPeriods = getCurrentPeriods();

  if (currentPeriods.length === 0) {
    periodEl1.innerText = "No current period";
    timeLeftEl1.innerText = "";
    periodEl2.innerText = "";
    timeLeftEl2.innerText = "";
    return;
  }

  // Update for the first period
  const period1 = currentPeriods[0];
  periodEl1.innerText = period1.name;
  timeLeftEl1.innerText = `Time Left: ${getTimeRemaining(period1.end)}`;

  // Update for the second period if present
  if (currentPeriods.length > 1) {
    const period2 = currentPeriods[1];
    periodEl2.innerText = period2.name;
    timeLeftEl2.innerText = `Time Left: ${getTimeRemaining(period2.end)}`;
  } else {
    periodEl2.innerText = "";
    timeLeftEl2.innerText = "";
  }
}

// Update the periods and display the current time every second
function updateDashboard() {
  const currentTimeEl = document.getElementById("current-time");
  const currentDateEl = document.getElementById("current-date");
  currentTimeEl.innerText = `${getCurrentTime()}`;
  currentDateEl.innerText = `${getCurrentDate()}`;
  updatePeriods();
}

const fetchWeather = async () => {
  const apiKey = '69e1db710cd2fe4903a85b7ebf97f627'; // Replace with your OpenWeatherMap API key
  const city = 'Highlands Ranch';
  const units = 'imperial';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},US&units=${units}&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const weatherData = await response.json();
    const temperature = Math.round(weatherData.main.temp);
    document.getElementById("wx").textContent = `${temperature}°`;
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
};

// Start the interval for updating every second
setInterval(updateDashboard, 1000);
setInterval(fetchWeather, 60000);

