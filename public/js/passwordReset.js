
document.getElementById("resetPassword").addEventListener("submit", (event)=>{
    event.preventDefault();
    let email= document.querySelector("#email").value;
    firebase.auth().sendPasswordResetEmail(email)
    .then(function(){
        alert('Check your mail box and reset your password.');
        window.location.assign("/login");
    })
    .catch(function(){
        document.getElementById("email").style.borderColor="red";
        document.getElementById("errorMessage").style.borderColor="red";
        document.getElementById("errorMessage").innerHTML="Please enter correct email";
    })
})
