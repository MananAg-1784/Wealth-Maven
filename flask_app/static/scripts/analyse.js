document.addEventListener("DOMContentLoaded", function () {
    // Performance Chart
    const ctx = document.getElementById("performanceChart").getContext("2d");
  
    // Generate some sample data
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
    ];
    const portfolioData = [
      100000, 105000, 103000, 108000, 115000, 112000, 120000, 125000, 127492,
    ];
    const objectiveData = [
      100000, 102000, 104000, 106000, 108000, 110000, 112000, 114000, 116000,
    ];
  
    new Chart(ctx, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Portfolio Value",
            data: portfolioData,
            borderColor: "#ff6c00",
            backgroundColor: "rgba(255, 108, 0, 0.1)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Objective",
            data: objectiveData,
            borderColor: "#4CAF50",
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            tension: 0.4,
            borderDash: [5, 5],
            fill: true,
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
            beginAtZero: false,
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "#ffffff",
              callback: function (value) {
                return "" + value.toLocaleString();
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
  