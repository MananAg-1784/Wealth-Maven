const questions = [
    {
      question: "What is your goal?",
      options: ["Retirement", "Asset Purchase", "Wealth Accumilation", "Other"],
    },
    {
      question: "For how long are you planning to invest?",
      options: [
        "short term (1-3 years)",
        "medium term(3-7 years)",
        "long term(7+ years)",
      ],
    },
    {
      question: "What is the amount you are planning to invest?",
      options: ["Below 10,000", "10,000-25,000", "25,000-50,000", "Above 50,000"],
    },
  ];
  
  let currentQuestion = 0;
  
  const progressBar = document.getElementById("progress");
  const questionElement = document.getElementById("question");
  const optionsElement = document.getElementById("options");
  const nextButton = document.getElementById("next-btn1");
  const finishButton = document.getElementById("finish-btn");
  const prevButton = document.getElementById("prev-btn1");
  const counterElement = document.getElementById("counter");
  
  function showQuestion() {
    const progressPercentage = (currentQuestion / (questions.length - 1)) * 100;
    progressBar.style.width = `${progressPercentage}%`;
  
    questionElement.innerText = questions[currentQuestion].question;
    optionsElement.innerHTML = "";
  
    questions[currentQuestion].options.forEach((option) => {
      const optionElement = document.createElement("div");
      optionElement.innerHTML = `<input type="radio" name="option" value="${option}"> ${option}`;
      optionsElement.appendChild(optionElement);
    });
  
    counterElement.innerText = `Question ${currentQuestion + 1} of ${
      questions.length
    }`;
  
    // Handle button visibility and placement
    prevButton.style.display = currentQuestion === 0 ? "none" : "inline-block";
  
    if (currentQuestion === questions.length - 1) {
      nextButton.style.display = "none";
      finishButton.style.display = "inline-block";
      prevButton.style.float = "left";
    } else {
      nextButton.style.display = "inline-block";
      finishButton.style.display = "none";
    }
  }
  
  nextButton.addEventListener("click", () => {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
      currentQuestion++;
      if (currentQuestion < questions.length) {
        showQuestion();
      }
    } else {
      alert("Please select an option!");
    }
  });
  
  prevButton.addEventListener("click", () => {
    if (currentQuestion > 0) {
      currentQuestion--;
      showQuestion();
    }
  });
  
  showQuestion();
  