async function predict() {
  const hour = Number(document.getElementById("hour").value);
  const rain = document.getElementById("rain").value;
  const month = Number(document.getElementById("month").value);
  const county = document.getElementById("county").value;
  const city = document.getElementById("city").value;

  // 1. Get real weather data from OpenWeatherMap
  const apiKey = "7f35afb7f560a5f4493ba7fa3f08c60c";
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city},KE&appid=${apiKey}`
  );

  const weather = await response.json();
  const rainReal = weather.weather[0].main.toLowerCase().includes("rain");

  // 2. Improve risk logic using real weather
  let risk = 0.15;

  if (hour >= 18 && hour <= 22) risk += 0.25;
  if (rain === "Yes" || rainReal) risk += 0.25;

  if (month >= 3 && month <= 5) risk += 0.2;
  if (month >= 10 && month <= 12) risk += 0.15;

  if (county === "Nairobi" || county === "Kiambu") risk += 0.15;
  if (county === "Kisumu") risk += 0.1;

  risk = Math.min(risk, 0.95);
  const percentage = Math.round(risk * 100);

  let riskClass = "low";
  let comment = "Normal operation expected.";

  if (percentage >= 70) {
    riskClass = "high";
    comment = "⚠️ High risk of outage. Prepare backup power.";
  } else if (percentage >= 40) {
    riskClass = "medium";
    comment = "⚠️ Moderate risk. Stay alert and plan.";
  }

  document.getElementById("result").innerHTML =
    `Estimated outage risk for ${county} (${city}): <span class="${riskClass}">${percentage}%</span>`;

  document.getElementById("comment").innerText =
    comment + " (Weather from OpenWeatherMap)";

  drawChart(percentage);
}
