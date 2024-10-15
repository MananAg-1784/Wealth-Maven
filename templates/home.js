document.querySelectorAll(".faq-question").forEach((question) => {
  question.addEventListener("click", () => {
    const card = question.closest(".faq-card");
    card.classList.toggle("active");
  });
});
