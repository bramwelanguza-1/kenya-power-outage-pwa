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

  document.getElementById("result").innerText =
    "Estimated outage risk for " + county + ": " +
    Math.round(risk * 100) + "%";
}
