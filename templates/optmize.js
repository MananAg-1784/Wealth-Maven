document.addEventListener("DOMContentLoaded", function () {
  // Optimization Comparison Chart
  const ctx = document.getElementById("optimizationChart").getContext("2d");

  // Generate sample data
  const categories = [
    "US Stocks",
    "Int. Stocks",
    "Bonds",
    "Real Estate",
    "Cash",
  ];
  const currentAllocation = [45, 25, 20, 5, 5];
  const suggestedAllocation = [40, 30, 15, 10, 5];

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: categories,
      datasets: [
        {
          label: "Current Allocation",
          data: currentAllocation,
          backgroundColor: "#ff6c00",
          borderColor: "#ff6c00",
          borderWidth: 1,
        },
        {
          label: "Suggested Allocation",
          data: suggestedAllocation,
          backgroundColor: "#4CAF50",
          borderColor: "#4CAF50",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "#ffffff",
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          ticks: {
            color: "#ffffff",
            callback: function (value) {
              return value + "%";
            },
          },
        },
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          ticks: {
            color: "#ffffff",
          },
        },
      },
    },
  });
});
