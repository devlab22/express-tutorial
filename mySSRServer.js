const express = require("express");
const path = require("path");
const app = express();
const helmet = require("helmet");
const crypto = require("crypto");
const { authenticateUser, rootSide, users, postUser } = require("./baseUtils");


const PORT = 1337;

//Setup https://expressjs.com/en/5x/api.html#app.set
app.set('case sensitive routing', false);
app.set('view engine', 'ejs');

// Middleware
app.use((req,res,next) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('hex');
    next();
})
app.use(helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`]
    }
}));
app.use("/", authenticateUser);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get("/", (req,res,next) => {
    console.log('root');
    res.render("index", {
        level: 100,
        html: `Hallo ${res.locals.validatedUser}`
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});