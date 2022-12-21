"use strict"
const express = require("express");
const router = express.Router();
const usr = new Set();

router.param('name', (req, res, next, name) => {
    console.log('set param:', name);
    usr.add(name)
    next();
});

function authenticateUser(req, res, next){
    res.locals.validatedUser = req.params.name;
    console.log('middleware:', res.locals.validatedUser);
    next();
}

router.use("/:name", authenticateUser);

router.get("/", (req,res,next) => {

    const items = [];
    usr.forEach(name => items.push(name));
    res.json({users: items});
});

router.get("/:name", (req,res,next) => {
    res.send(`<h1>Hallo ${req.params.name}</h1>`);
});

router.post("/", (req,res,next) => {
    console.log(req.body)
    res.json(req.body);
});

module.exports = router;