function fetchStockData(symbol) {
  const apiKey = "0CQKCMOA4YW66LXI"; // Consider storing this securely 0CQKCMOA4YW66LXI
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data["Error Message"]) {
        throw new Error(data["Error Message"]);
      }

      const timeSeries = data["Time Series (5min)"];
      if (!timeSeries) {
        throw new Error("No time series data found");
      }

      const latestTime = Object.keys(timeSeries)[0];
      const latestData = timeSeries[latestTime];

      // Update DOM with stock data
      document.getElementById("nifty-value").innerText = latestData["4. close"];
      document.getElementById("nifty-change").innerText = calculateChange(
        timeSeries,
        latestTime
      );
      document.getElementById("nifty-high").innerText = latestData["2. high"];
      document.getElementById("nifty-low").innerText = latestData["3. low"];
    })
    .catch((error) => {
      console.error("Error fetching stock data:", error);
      // Update DOM to show error
      document.getElementById("nifty-value").innerText = "Error";
      document.getElementById("nifty-change").innerText = "N/A";
      document.getElementById("nifty-high").innerText = "N/A";
      document.getElementById("nifty-low").innerText = "N/A";
    });
}

// Function to calculate change
function calculateChange(timeSeries, latestTime) {
  const times = Object.keys(timeSeries);
  const latestClose = parseFloat(timeSeries[latestTime]["4. close"]);
  const previousClose = parseFloat(timeSeries[times[1]]["4. close"]);
  const change = ((latestClose - previousClose) / previousClose) * 100;
  return change.toFixed(2) + "%";
}

// Example call with a valid symbol from BSE (Bombay Stock Exchange)
fetchStockData("RELIANCE.BSE"); // Change symbol as needed
