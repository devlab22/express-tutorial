"use strict"
const express = require("express");
const router = express.Router();

router.param('name', (req, res, next, name) => {
    console.log('set param:', name);
    next();
});

function authenticateUser(req, res, next){
    res.locals.validatedUser = req.params.name;
    console.log('middleware:', res.locals.validatedUser);
    next();
}

router.use("/:name", authenticateUser);

router.get("/", (req,res,next) => {
    res.send("<h1>Hallo user</h1>");
});

router.get("/:name", (req,res,next) => {
    res.send(`<h1>Hallo ${req.params.name}</h1>`);
});

router.post("/", (req,res,next) => {
    console.log(req.body)
    res.json(req.body);
});

module.exports = router;