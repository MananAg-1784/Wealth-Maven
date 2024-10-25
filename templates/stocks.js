function goToNextPage() {
  const numStocks = document.getElementById("numStocks").value;
  if (!numStocks || numStocks <= 0) {
    alert("Please enter a valid number of stocks");
    return;
  }

  const stockInputs = document.getElementById("stockInputs");
  stockInputs.innerHTML = ""; // Clear previous entries

  // Hide the next button and show analyze button
  document.getElementById("nextButton").classList.add("hidden");
  document.getElementById("analyzeButton").style.display = "block";

  for (let i = 0; i < numStocks; i++) {
    const stockDiv = document.createElement("div");
    stockDiv.classList.add("stock-item");

    // Create input containers
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = `Stock ${i + 1} Name`;
    nameInput.classList.add("stock-name");

    const weightInput = document.createElement("input");
    weightInput.type = "number";
    weightInput.placeholder = "Weight";
    weightInput.classList.add("stock-weight");

    const sectorInput = document.createElement("input");
    sectorInput.type = "text";
    sectorInput.placeholder = "Sector";
    sectorInput.classList.add("stock-sector");

    stockDiv.appendChild(nameInput);
    stockDiv.appendChild(weightInput);
    stockDiv.appendChild(sectorInput);

    stockInputs.appendChild(stockDiv);
  }
}

function redirectToAnalyze() {
  // Collect and validate the data before redirecting
  const stockInputs = document.querySelectorAll(".stock-item");
  let isValid = true;

  stockInputs.forEach((stockInput) => {
    const name = stockInput.querySelector(".stock-name").value;
    const weight = stockInput.querySelector(".stock-weight").value;
    const sector = stockInput.querySelector(".stock-sector").value;

    if (!name || !weight || !sector) {
      isValid = false;
    }
  });

  if (!isValid) {
    alert("Please fill in all stock details before proceeding");
    return;
  }

  // Redirect to analyze.html
  window.location.href = "analyze.html";
}
