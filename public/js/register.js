
//firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)


document
    .getElementById("signup")
    .addEventListener("submit", (event) => {
        event.preventDefault();
        let email = document.querySelector('#emailAddress').value;
        let password = document.querySelector('#password').value;
        let confirmPassword = document.querySelector('#confirmPassword').value;

        if (password == confirmPassword) {
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then((cred) => {
                    let user=firebase.auth().currentUser;
                    let isSent=false;
                    user.sendEmailVerification().then(function(){
                        isSent=true;
                    }).catch(err=>{isSent=false;})
                    alert('Your account has been created. Please verify the email that was sent to you. Then only you can login.');
                    window.location.assign("/login");
                })
                /* .then(({ user }) => {
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
            return false;*/
        } else {
            event.preventDefault();
            document.getElementById('errorMessage').style.color = "red";
            document.getElementById('password').style.borderColor = "red";
            document.getElementById('confirmPassword').style.borderColor = "red";
            document.querySelector('#errorMessage').innerHTML = "Passwords should be same";
        }
    });


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
