  
  let currentQuestion = 0;
  let score = 0;
  let ques_ans = [];
  
  const progressBar = document.getElementById("progress");
  const questionContainer = document.getElementById("question-container");
  const questionElement = document.getElementById("question");
  const optionsElement = document.getElementById("options");
  const nextButton = document.getElementById("next-btn1");
  const finishButton = document.getElementById("finish-btn");
  const counterElement = document.getElementById("counter");
  
  function showQuestion() {
    const progressPercentage = (currentQuestion / (questions.length - 1)) * 100;
    progressBar.style.width = `${progressPercentage}%`;
  
    questionElement.innerText = questions[currentQuestion].question;
    optionsElement.innerHTML = "";
  
    questions[currentQuestion].options.forEach((option) => {
      const optionElement = document.createElement("div");
  
      const innerHtmlContent = `
      <input type="checkbox" id="${option}" name="option" value="${option}">
  <label for="${option}">${option}</label><br></br>`;
  
      optionElement.innerHTML = questions[currentQuestion].isCheckbox
        ? innerHtmlContent
        : `<input type="radio" name="option" value="${option}"> ${option}`;
      optionsElement.appendChild(optionElement);
    });
  
    counterElement.innerText = `Question ${currentQuestion + 1} of ${
      questions.length
    }`;
  }
  
  nextButton.addEventListener("click", () => {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
      console.log(selectedOption);
      console.log(questions[currentQuestion]);
      const selectedValue = selectedOption.value;
      score += questions[currentQuestion].scores[selectedValue];
      ques_ans.push({
        "question_id" : questions[currentQuestion].question_id,
        "answer_id" : questions[currentQuestion].answer_ids[selectedValue]
      })
  
      currentQuestion++;
  
      if (currentQuestion < questions.length) {
        showQuestion();
      } else {
        showResults();
      }
    } else {
      alert("Please select an option!");
    }
  });
  
  function showResults() {
    questionContainer.innerHTML = `<h2>Your Risk Profile: ${determineRiskProfile(
      score
    )}</h2>`;
  
    nextButton.style.display = "none";
    finishButton.style.display = "block";
  }
  
  function determineRiskProfile(score) {
    console.log(score);
    if (score <= 25) {
      return "Conservative";
    } else if (score <= 50) {
      return "Moderate";
    } else {
      return "Aggressive";
    }
  }
  
  showQuestion();

  document.getElementById("finish-btn").addEventListener("click", function() {
    const queryParams = ques_ans.map((item, index) => 
        `question${index + 1}=${item.question_id},${item.answer_id}`
    ).join('&');

    // Construct the URL with the query string
    const customUrl = `/risk_assessed?${queryParams}&score=${score}`;

    // Redirect to Flask route with the custom URL
    window.location.href = customUrl;
});
  