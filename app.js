function predict() {
  const hour = Number(document.getElementById("hour").value);
  const rain = document.getElementById("rain").value;
  const month = Number(document.getElementById("month").value);
  const county = document.getElementById("county").value;

  let risk = 0.15;

  if (hour >= 18 && hour <= 22) risk += 0.25;
  if (rain === "Yes") risk += 0.25;

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
    `Estimated outage risk for ${county}: <span class="${riskClass}">${percentage}%</span>`;

  document.getElementById("comment").innerText = comment;

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
        backgroundColor: ["#f43f5e", "#22c55e"],
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
