"use strict"
const express = require("express");
const router = express.Router();

router.param('channelName', (req, res, next, channelName) => {
    console.log(channelName);
    next();
});

router.get("/", (req,res,next) => {
    res.send("<h1>Hallo channel</h1>");
});

router.get("/:channelName/", (req,res,next) => {
    res.send(`<h1>Hallo channel ${req.params.channelName}</h1>`)
});

router.get("/:channelName/videos", (req,res,next) => {
    res.send(`<h1>Hallo ${req.params.channelName} Videos</h1>`)
});

router.get("/:channelName/music", (req,res,next) => {
    res.send(`<h1>Hallo ${req.params.channelName} Music</h1>`)
});

module.exports = router;