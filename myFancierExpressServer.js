const express = require("express");
const path = require("path");
const app = express();
const { authenticateUser, rootSide, users, postUser } = require("./baseUtils");
const helmet = require("helmet");

const PORT = 1337;

// Middleware
app.use(helmet());
app.use("/users/", authenticateUser);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}))


// GET
app.get("/", rootSide);
app.get("/users/", users);

// POST
app.post("/", (req, res, next) => {

    let name = '';
    let password = '';

    if('name' in req.body){
        name = req.body['name'];
    }

    if('password' in req.body){
        password = req.body['password'];
    }

    let user = {
        name: name,
        password: password
    }
    postUser(user);
    const message ="<h1>Hallo POST Root</h1>"
    // console.log(req.body);

    res.send(message);
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
