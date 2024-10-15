const questions = [
  {
    question: "What is your age?",
    options: ["Below 30", "30-40", "40-50", "Above 50"],
    scores: { "Below 30": 5, "30-40": 4, "40-50": 3, "Above 50": 2 },
  },
  {
    question: "What is your current annual income (in INR)?",
    options: ["Below 5 lakhs", "5-10 lakhs", "10-20 lakhs", "Above 20 lakhs"],
    scores: {
      "Below 5 lakhs": 1,
      "5-10 lakhs": 2,
      "10-20 lakhs": 3,
      "Above 20 lakhs": 4,
    },
  },
  {
    question:
      "What is your monthly disposable income (after all expenses and savings)?",
    options: ["Below 10,000", "10,000-25,000", "25,000-50,000", "Above 50,000"],
    scores: {
      "Below 10,000": 1,
      "10,000-25,000": 2,
      "25,000-50,000": 3,
      "Above 50,000": 4,
    },
  },
  {
    question:
      "Do you have any major financial obligations? (Select all that apply)",
    options: [
      "Mortgage",
      "Car loan",
      "Student loan",
      "Dependents' education",
      "Other",
      "None",
    ],
    scores: {
      None: 5,
      Mortgage: 1,
      "Car loan": 2,
      "Student loan": 3,
      "Dependents' education": 2,
      Other: 1,
    },
    isCheckbox: true,
  },
  {
    question: "What is the size of your emergency fund?",
    options: [
      "Less than 3 months of expenses",
      "3-6 months of expenses",
      "6-12 months of expenses",
      "More than 12 months of expenses",
    ],
    scores: {
      "Less than 3 months of expenses": 1,
      "3-6 months of expenses": 2,
      "6-12 months of expenses": 3,
      "More than 12 months of expenses": 4,
    },
  },
  {
    question: "What is your primary investment goal?",
    options: [
      "Saving for a major purchase",
      "Retirement",
      "Education fund for children",
      "Wealth accumulation",
      "Other",
    ],
    scores: {
      "Saving for a major purchase": 1,
      Retirement: 4,
      "Education fund for children": 3,
      "Wealth accumulation": 5,
      Other: 2,
    },
    isCheckbox: true,
  },
  {
    question:
      "How long do you plan to keep your investments before you need to access the money?",
    options: [
      "Less than 1 year",
      "1-3 years",
      "3-5 years",
      "5-10 years",
      "More than 10 years",
    ],
    scores: {
      "Less than 1 year": 1,
      "1-3 years": 2,
      "3-5 years": 3,
      "5-10 years": 4,
      "More than 10 years": 5,
    },
  },
  {
    question:
      "How would you rate your knowledge of investments and financial markets?",
    options: [
      "None",
      "Basic understanding",
      "Moderate knowledge",
      "Advanced knowledge",
    ],
    scores: {
      None: 1,
      "Basic understanding": 2,
      "Moderate knowledge": 3,
      "Advanced knowledge": 4,
    },
  },
  {
    question:
      "How much experience do you have with the following asset classes? (Stocks)",
    options: ["None", "1", "2", "3", "4", "5"],
    scores: { None: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6 },
  },
  {
    question: "How do you usually feel about taking financial risks?",
    options: [
      "Very uncomfortable",
      "Somewhat uncomfortable",
      "Neutral",
      "Somewhat comfortable",
      "Very comfortable",
    ],
    scores: {
      "Very uncomfortable": 1,
      "Somewhat uncomfortable": 2,
      Neutral: 3,
      "Somewhat comfortable": 4,
      "Very comfortable": 5,
    },
  },
  {
    question:
      "Suppose the value of your investment dropped by 20% over a month. What would you do?",
    options: [
      "Sell all investments",
      "Sell some investments",
      "Do nothing",
      "Buy more investments",
    ],
    scores: {
      "Sell all investments": 1,
      "Sell some investments": 2,
      "Do nothing": 3,
      "Buy more investments": 5,
    },
  },
  {
    question: "What is your preference for investment returns vs. risk?",
    options: [
      "Prefer stable returns",
      "Accept moderate risk",
      "Willing to take high risk",
    ],
    scores: {
      "Prefer stable returns": 1,
      "Accept moderate risk": 3,
      "Willing to take high risk": 5,
    },
  },
  {
    question:
      "What percentage of your total savings are you willing to invest in risky assets?",
    options: ["Less than 10%", "10-25%", "25-50%", "More than 50%"],
    scores: {
      "Less than 10%": 1,
      "10-25%": 2,
      "25-50%": 4,
      "More than 50%": 5,
    },
  },
  {
    question: "How would you describe your current financial situation?",
    options: [
      "Struggling",
      "Managing expenses",
      "Comfortable",
      "Very comfortable",
    ],
    scores: {
      Struggling: 1,
      "Managing expenses": 2,
      Comfortable: 3,
      "Very comfortable": 4,
    },
  },
  {
    question:
      "How soon would you need access to your investments in an emergency?",
    options: [
      "Immediately",
      "Within 3 months",
      "Within 6 months",
      "Within a year",
      "More than a year",
    ],
    scores: {
      Immediately: 1,
      "Within 3 months": 2,
      "Within 6 months": 3,
      "Within a year": 4,
      "More than a year": 5,
    },
  },
  {
    question: "Are there any specific investment restrictions or preferences?",
    options: ["Yes", "No"],
    scores: { Yes: 1, No: 5 },
  },
  {
    question: "How do you prefer to manage your investments?",
    options: [
      "Make decisions myself",
      "Follow recommendations",
      "Automated investment services",
    ],
    scores: {
      "Make decisions myself": 5,
      "Follow recommendations": 3,
      "Automated investment services": 4,
    },
  },
];

let currentQuestion = 0;
let score = 0;

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
    const selectedValue = selectedOption.value;
    score += questions[currentQuestion].scores[selectedValue];

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
  if (score <= 25) {
    return "Conservative";
  } else if (score <= 50) {
    return "Moderate";
  } else {
    return "Aggressive";
  }
}

showQuestion();
