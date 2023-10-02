const express = require("express");
const path = require("path");
const app = express();
const helmet = require("helmet");
const cookieparser = require("cookie-parser");
const dirname = process.cwd();

const PORT = 1337;
const HOST = 'localhost'

app.use(helmet());
app.use(cookieparser());
app.use(express.static(path.join(dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Router
const channelRouter = require("./channelRouter");
const userRouter = require("./userRouter");
const apiRouter = require('./apiRouter');
const sapRouter = require('./apiSap')
const sqlRouter = require('./sqlRouter');

app.use("/c/", channelRouter);
app.use("/user/", userRouter);
app.use('/api/meraki/', apiRouter)
app.use('/api/sap/', sapRouter)
//app.use('/api/sql/', sqlRouter)

app.get("/", (req,res,next) => {
    console.log('req.query:', req.query);
    console.log('req.cookies:', req.cookies);
   
    res.send(`<h1>Hallo Home</h1>`);
});

/* app.post("/", (req, res, next) => {
    res.cookie("user", req.body.name);
    //res.send(`<h1>Hallo Home POST</h1>`);
    res.json({name: req.body.name});
}) */

app.listen(PORT, HOST, () => {
    console.log(`Server listening on port ${HOST}:${PORT}`);
});