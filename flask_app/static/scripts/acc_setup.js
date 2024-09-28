const otpBoxes = document.querySelectorAll('.otp-box');
const otpInput = document.getElementById('otp');

otpBoxes.forEach((box, index) => {
  box.addEventListener('input', (event) => {
    if (event.target.value.length === 1) {
      if (index < otpBoxes.length - 1) {
        otpBoxes[index + 1].focus();
      }
    }
    collectOtp();
  });

  box.addEventListener('keydown', (event) => {
    if (event.key === 'Backspace' && event.target.value === '') {
      if (index > 0) {
        otpBoxes[index - 1].focus();
      }
    }
  });
});

function collectOtp() {
  let otp = '';
  otpBoxes.forEach(box => {
    otp += box.value;
  });
  otpInput.value = otp;
}


const socket = io("/otp", {autoConnect:false});
socket.connect();
socket.on('connect', function(){
    console.log("Socket Connected...");
});
socket.on('disconnect', function(){
    console.log("Socket disconnected...");
});

const OtpButton = document.getElementById('send_otp');

// Add click event listener to the button
OtpButton.addEventListener('click', () => {
    const currentUrl = window.location.href; // Get the current URL
    console.log('Sending URL to server:', currentUrl); // Optional: log the URL to the console
    document.querySelector(".resend-link").innerHTML = `
    <div id="loader" class="loader"></div>
    <div>Resending Otp...</div>
    `;
    socket.connect();
    socket.emit('adhaar_otp', {url:currentUrl}, (response)=>{
        console.log(response);
        if(response == 1){
            document.querySelector(".resend-link").innerHTML = 'Otp Sent';
        }else{
            document.querySelector(".resend-link").innerHTML = "Server error, Cannot send Otp";
        }
    });
});
