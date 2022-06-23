const express = require("express");
const path = require("path");
const app = express();
const helmet = require("helmet");

const PORT = 1337;

app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.param('channelName', (req, res, next, channelName) => {
    console.log(channelName);
    next();
})

app.get("/c/:channelName/", (req,res,next) => {
    res.send(`<h1>Hallo ${req.params.channelName} Home</h1>`)
});

app.get("/c/:channelName/videos", (req,res,next) => {
    res.send(`<h1>Hallo ${req.params.channelName} Videos</h1>`)
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});