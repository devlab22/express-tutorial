const express = require("express");
const path = require("path");
const app = express();
const helmet = require("helmet");
const cookieparser = require("cookie-parser");

const PORT = 1337;

app.use(helmet());
app.use(cookieparser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Router
const channelRouter = require("./channelRouter");
const userRouter = require("./userRouter");

app.use("/c/", channelRouter);
app.use("/user/", userRouter);

app.get("/", (req,res,next) => {
    console.log('req.query:', req.query);
    console.log('req.cookies:', req.cookies);
    const user = req.cookies['user'] ? req.cookies.user : '';
    res.send(`<h1>Hallo Home ${user}</h1>`);
});

app.post("/", (req, res, next) => {
    res.cookie("user", req.body.name);
    //res.send(`<h1>Hallo Home POST</h1>`);
    res.json({name: req.body.name});
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});