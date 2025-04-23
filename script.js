document.getElementById("calculator-form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const answers = {
      transport: formValue("transport"),
      electricity: formValue("electricity"),
      recycle: formValue("recycle"),
      meat: formValue("meat"),
      onlineShopping: formValue("onlineShopping"),
      acUsage: formValue("acUsage"),
      showerLength: formValue("showerLength")
    };
  
    let score = 0;
  
    if (answers.transport === "walk") score += 3;
    else if (answers.transport === "public") score += 2;
    else if (answers.transport === "bike") score += 1;
  
    if (answers.electricity === "low") score += 3;
    else if (answers.electricity === "medium") score += 2;
  
    if (answers.recycle === "yes") score += 2;
  
    if (answers.meat === "never") score += 3;
    else if (answers.meat === "rarely") score += 2;
    else if (answers.meat === "few") score += 1;
  
    if (answers.onlineShopping === "rarely") score += 2;
    else if (answers.onlineShopping === "occasionally") score += 1;
  
    if (answers.acUsage === "never") score += 2;
    else if (answers.acUsage === "rarely") score += 1;
  
    if (answers.showerLength === "short") score += 2;
    else if (answers.showerLength === "medium") score += 1;
  
    // Display result
    let message = "";
    if (score >= 15) message = "<strong>🌟 Great job!</strong> You're living sustainably!";
    else if (score >= 8) message = "<strong>😊 Not bad!</strong> But there's room to improve!";
    else message = "<strong>⚠️ Let's do better!</strong> Try more eco habits.";
  
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `<h2>Your Score: ${score}/21</h2><p>${message}</p>`;
    resultDiv.classList.remove("hidden");
  
    // Render chart
    const chartCanvas = document.getElementById("chart");
    chartCanvas.classList.remove("hidden");
  
    const ctx = chartCanvas.getContext("2d");
    if (window.myChart) window.myChart.destroy();
  
    window.myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Your Score', 'Remaining'],
        datasets: [{
          label: 'Carbon Footprint Score',
          data: [score, 21 - score],
          backgroundColor: ['#4CAF50', '#eeeeee'],
          borderColor: ['#388E3C', '#cccccc'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  
    // Shareable Result
    const shareContainer = document.getElementById("share-container");
    const shareText = document.getElementById("share-text");
  
    const plainMessage = message.replace(/<[^>]+>/g, "");
    const shareMessage = `I just calculated my carbon footprint 🌍 and my score is ${score}/21! ${plainMessage} Try it yourself: https://ecocalc.netlify.app/`;
  
    shareText.value = shareMessage;
    shareContainer.classList.remove("hidden");
  
    // WhatsApp sharing
const whatsappMessage = encodeURIComponent(shareMessage);
document.getElementById("whatsapp-share").href = `https://wa.me/?text=${whatsappMessage}`;

  });
  
  function formValue(name) {
    return document.querySelector(`[name="${name}"]`).value;
  }
  
  function copyToClipboard() {
    const text = document.getElementById("share-text");
    text.select();
    document.execCommand("copy");
    alert("Result copied! Share it with your friends 🌍");
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const cityElement = document.getElementById('city');
    const cityInput = document.getElementById('city-input'); // 💡 store it once
  
    // Get city name from geolocation
    function getCityFromGeoLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const apiKey = '4d7940de83a6fca046a800e8a0e7b832';
          const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  
          try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const cityName = data.name;
  
            if (cityElement) cityElement.textContent = cityName;
            if (cityInput) cityInput.value = cityName;
          } catch (error) {
            console.error('Error fetching city:', error);
            if (cityElement) cityElement.textContent = 'Unable to get city';
          }
        });
      } else {
        if (cityElement) cityElement.textContent = 'Geo-location not supported';
      }
    }
  
    getCityFromGeoLocation();
  });
  // Fetch air quality data
  function fetchAirQuality() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  
    function success(position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getAirQuality(lat, lon);
    }
  
    function error() {
      console.log("Unable to retrieve your location.");
    }
  }
  
  // Call the function to fetch air quality data
  function getAirQuality(lat, lon) {
    const apiKey = "4d7940de83a6fca046a800e8a0e7b832"; 
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const aqi = data.list[0].main.aqi;
  
        let quality = "";
        let emoji = "";
  
        switch (aqi) {
          case 1:
            quality = "Good";
            emoji = "🟢";
            break;
          case 2:
            quality = "Fair";
            emoji = "🟡";
            break;
          case 3:
            quality = "Moderate";
            emoji = "🟠";
            break;
          case 4:
            quality = "Poor";
            emoji = "🔴";
            break;
          case 5:
            quality = "Very Poor";
            emoji = "🟣";
            break;
          default:
            quality = "Unknown";
            emoji = "❓";
        }
  
        document.getElementById("city").innerHTML += `
          <p class="air-info" data-aos="fade-in">
            Air Quality: <strong>${quality} ${emoji}</strong>
          </p>
        `;
      })
      .catch(err => console.log("Error fetching AQI:", err));
  }
  
