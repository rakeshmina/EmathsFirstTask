//packages or things required 
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');


let admin = require('firebase-admin');
let serviceAccount = require('./rakesh-first-project-firebase-adminsdk-ynuqg-ffba65905f.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://rakesh-first-project-default-rtdb.firebaseio.com"
})

const csrfMiddleware = csrf({ cookie: true });

//intialisation of app
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'public');

//middlewares used
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(csrfMiddleware)



//requests and responses of different pages
app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});

app.get("/login", function (req, res) {
    console.log('we got request from:' + req.url)
    const sessionCookie = req.cookies.session || "";
    console.log('session=' + sessionCookie)
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked */)
        .then(() => {
            res.redirect("/profile");
        })
        .catch((error) => {
            res.render("login", { title: "user" });
        });

});

app.get("/register", function (req, res) {
    console.log('we got request from:' + req.url)
    res.render("register", { title: '', message: '' });
    console.log(req.cookies);
});

app.get("/profile", function (req, res) {
    console.log('we got request from:' + req.url)
    const sessionCookie = req.cookies.session || "";
    console.log('session=' + sessionCookie)
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked */)
        .then(() => {
            res.render("profile", { title: "user" });
        })
        .catch((error) => {
            res.redirect("/login");
        });
});
app.post("/updateProfile", (req, res) => {

    console.log("we got request from" + req.url)
    const userData = req.body.details;
    console.log(`user is ${userData.name} and he is reading in ${userData.grade}`);

    const sessionCookie = req.cookies.session || "";

    admin.auth().verifySessionCookie(sessionCookie, true)
        .then((user) => {
            const store = admin.firestore();
            const userRef = store.collection('users')
            console.log("you are verified")
            let id = user.uid;
            console.log(id)
            userRef.doc(id).set({
                name: userData.name,
                class: userData.grade
            })

            const db = admin.database();
            const uref = db.ref('/user');
            uref.child(id).set({
                name: userData.name,
                class: userData.grade
            })
            res.redirect("/userTasks")
        }).catch(() => {
            console.log("you are not verified user")
        })


})

app.get("/userTasks", (req, res) => {
    console.log('we got request from:' + req.url)
    const sessionCookie = req.cookies.session || "";
    console.log('session=' + sessionCookie)
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked */)
        .then(async (user) => {
            let id = user.uid;
            console.log("you are verified and your user id is=" + id)
            let grade;
            let name;
            const userCollection = admin.firestore().collection('users');
            const doc = await userCollection.doc(id).get()
            if (doc.exists) {
                console.log(doc.data())
                grade = doc.data().class
                name = doc.data().name
            } else {
                console.log("doc does not exit")
            }



            //realtime database
            let questions;
            const db = admin.database()
            
            ref = db.ref('/classes/' + grade) 
            console.log("your class ids=" + grade)
            ref.once("value"). then( snapshot => {
                console.log(snapshot.val())
                console.log("size is=" + snapshot.val().length)
                res.render("assignment", { title: "assignment", name: name, questions: snapshot.val() })
            })

        })
        .catch((error) => {
            console.log(error)
            res.redirect("/login");
        });

})

app.get("/", function (req, res) {
    console.log('we got request from:' + req.url)
    res.send(`<h1 class="text-center">you are making your efforts</h1>`);
});

app.post("/sessionLogin", (req, res) => {
    const idToken = req.body.idToken.toString();
    console.log("we got request from" + req.url)
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    admin.auth().createSessionCookie(idToken, { expiresIn }).then(
        (sessionCookie) => {
            const options = { maxAge: expiresIn, httpOnly: true };
            res.cookie("session", sessionCookie, options);
            res.end(JSON.stringify({ status: "success" }));
        },
        (error) => {
            res.status(401).send("UNAUTHORIZED REQUEST!");
        }
    );
});

app.get("/forgetPassword", (req, res) => {
    res.render("passwordReset", { title: "Forgot password" });
})

app.get("/sessionLogout", (req, res) => {
    res.clearCookie("session");
    res.redirect("/login");
});

//listening to some port
app.listen('3000', () => { console.log('we are listening to 3000 port.') });


//npm install <package_name>