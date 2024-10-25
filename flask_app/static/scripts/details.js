document.getElementById("next-btn").addEventListener("click", function () {
    const progressBars = document.querySelectorAll(".progress-line");
  
    for (let i = 0; i < progressBars.length; i++) {
      if (progressBars[i].classList.contains("inactive")) {
        progressBars[i].classList.remove("inactive");
        break;
      }
    }
  });