
const flash_msg = document.getElementById('flash_messages');
flash_msg.style.display = "none";

const socket = io("/get_in_touch", {autoConnect:false});
socket.connect();
socket.on('connect', function(){
    console.log("Socket Connected...");
});
socket.on('disconnect', function(){
    console.log("Socket disconnected...");
});

document.querySelectorAll(".faq-question").forEach((question) => {
  question.addEventListener("click", () => {
    const card = question.closest(".faq-card");
    card.classList.toggle("active");
  });
});

document.getElementById("touch_submit").addEventListener("click", function(event) {
  event.preventDefault(); // Prevent the form from submitting

  // Extract form data
  const firstName = document.getElementById("fname").value;
  const lastName = document.getElementById("lname").value;
  const email = document.getElementById("email").value;
  const description = document.getElementById("description").value;

  json_data = {
    fname:firstName,
    lname:lastName,
    email:email,
    description: description
  };

  socket.connect();
  flash_msg.style.display = "block";
  const alertDiv = document.querySelector(".alert");
  alertDiv.classList.add("alert-info");
  alertDiv.innerHTML = `
    <div id="loader" class="loader"></div>
    <div>Sending Email</div>
  `;
  const loader = document.getElementById("loader");
  loader.style.display = "block";
  
  socket.emit('get_in_touch_details', json_data, (response)=>{
    response = JSON.parse(response);
    console.log(response);
    console.log(response.category);
    loader.style.display = "none";
    if (response.category.trim() == "danger"){
      alertDiv.classList.add("alert-danger"); // Add the alert-danger class
    } else{
      alertDiv.classList.add("alert-success"); // Add the alert-danger class
    }
    alertDiv.textContent = response.value; // Set the text content to "HI"
  });
});
