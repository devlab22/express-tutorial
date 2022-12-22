"use strict"
const express = require("express");
const router = express.Router();
const usr = new Set();
const Dashboard = require("./Dashboard");
const myDashboards = []

/* router.param('name', (req, res, next, name) => {
    console.log('set param:', name);
    console.log(req.body)
    usr.add(name)
    next();
}); */

function authenticateUser(req, res, next){
    res.locals.validatedUser = req.params.name;
    console.log('middleware:', res.locals.validatedUser);
    next();
}

//router.use("/:name", authenticateUser);

router.get("/", (req,res,next) => {

    const items = [];
    usr.forEach(name => items.push(name));
    res.json({users: items, dashboards: myDashboards});
});

router.get("/:name", (req,res,next) => {
    console.log(req.params)
    console.log(reg.body)
    res.send(`<h1>Hallo ${req.params.name}</h1>`);
});

router.post("/", (req,res,next) => {
    console.log(req.body)
    const params = {
        name: req.body['name'],
        token: req.body['token']
    }
   

    const tmp = new Dashboard(params);
    myDashboards.push(tmp)
    res.json(req.body);
});

router.put("/:id", (req,res,next) => {
    console.log('id:', req.params.id)
    console.log('name:', req.body['name'])
    res.json(req.body);
});

router.delete("/:id", (req,res,next) => {
    console.log('delete')
    console.log('id:', req.params.id)
   // console.log('name:', req.body['name'])
    res.json(req.body);
});

module.exports = router;