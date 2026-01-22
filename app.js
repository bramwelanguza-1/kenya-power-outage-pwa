async function predict() {
  const hour = Number(document.getElementById("hour").value);
  const rain = document.getElementById("rain").value;
  const month = Number(document.getElementById("month").value);
  const county = document.getElementById("county").value;
  const city = document.getElementById("city").value;
  const day = document.getElementById("day").value;

  const apiKey = "7f35afb7f560a5f4493ba7fa3f08c60c";

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city},KE&appid=${apiKey}`
  );
  const weather = await response.json();

  const rainReal = weather.weather[0].main.toLowerCase().includes("rain");

  let risk = 0.15;

  if (hour >= 18 && hour <= 22) risk += 0.25;
  if (rain === "Yes" || rainReal) risk += 0.25;

  if (month >= 3 && month <= 5) risk += 0.2;
  if (month >= 10 && month <= 12) risk += 0.15;

  if (county === "Nairobi" || county === "Kiambu") risk += 0.15;
  if (county === "Kisumu") risk += 0.1;

  // NEW: Day logic
  if (day === "Friday" || day === "Saturday" || day === "Sunday") {
    risk += 0.08;
  }

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
    `Estimated outage risk for ${county} (${city}) on ${day}: <span class="${riskClass}">${percentage}%</span>`;

  document.getElementById("comment").innerText =
    comment + " (Weather from OpenWeatherMap)";

  drawChart(percentage);
}

function drawChart(value) {
  const ctx = document.getElementById("riskChart").getContext("2d");

  if (window.riskChart) window.riskChart.destroy();

  window.riskChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Risk", "Safe"],
      datasets: [{
        data: [value, 100 - value],
        backgroundColor: ["#fb7185", "#22c55e"],
      }]
    },
    options: {
      responsive: true,
      cutout: "70%",
      plugins: {
        legend: { display: true },
        title: {
          display: true,
          text: "Outage Risk Visualization"
        }
      }
    }
  });
}
