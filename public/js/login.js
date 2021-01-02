//firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)

//https://stackoverflow.com/questions/39243578/how-to-show-different-page-if-user-is-logged-in-via-firebase
document
    .getElementById("signin")
    .addEventListener("submit", (event) => {
        event.preventDefault();
        let email = document.querySelector('#emailAddress').value;
        let password = document.querySelector('#password').value;
        let goAhead = false;
        console.log(email+" "+password)
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(({user})=>{
        goAhead=user.emailVerified
        console.log("user is verified or not ="+user.emailVerified)
        alert(goAhead);
        if(goAhead){
            //console.log(user)
            return user.getIdToken().then((idToken) => {
                return fetch("/sessionLogin", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                    },
                    body: JSON.stringify({ idToken }),
                });
            });
        }else {
            document.getElementById('verifyMessage').style.color = "red";
            document.getElementById('errorMessage').innerHTML="";
            document.getElementById('verifyMessage').innerHTML = "Please verify your email";
        }
    })
    .then(() => {
        if(goAhead){
        return firebase.auth().signOut();
        }else {return false;}
    })
    .then(() => {
        if(goAhead){
        window.location.assign("/profile");
        }else {return false;}
    })
    .catch(err=>{
        document.getElementById('errorMessage').style.color = "red";
        document.getElementById('emailAddress').style.borderColor = "red";
        document.getElementById('password').style.borderColor = "red";
        document.getElementById('verifyMessage').innerHTML="";
        document.getElementById('errorMessage').innerHTML = "Please enter correct password";
    })
})

function googleCalled() {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(({ user }) => {
            return user.getIdToken().then((idToken) => {
                return fetch("/sessionLogin", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                    },
                    body: JSON.stringify({ idToken }),
                });
            });
        })
        .then(() => {
            return firebase.auth().signOut();
        })
        .then(() => {
            window.location.assign("/profile");
        });
    return false;
};

function facebookCalled() {
    let provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(({ user }) => {
            return user.getIdToken().then((idToken) => {
                return fetch("/sessionLogin", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                    },
                    body: JSON.stringify({ idToken }),
                });
            });
        })
        .then(() => {
            return firebase.auth().signOut();
        })
        .then(() => {
            window.location.assign("/profile");
        });
    return false;
}
