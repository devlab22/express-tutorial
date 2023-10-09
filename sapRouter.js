"use strict"
const express = require("express");
const router = express.Router();
const SapDashboard = require("./sapDashboard")

let Dashboards = []

function getDashboard(token = null){

    const db = Dashboards.find(item => item.token === token)

    if (!db){
        throw new Error('user is not authorized', {status: 400})
    }
    return db;
}

router.get('/', (req, res, next) => {

    res.json({
        "server": 'express',
        "router": 'my sap server',
        "count": Dashboards.length,
        "method": "root"
    })
})

router.use('/login', (req,res,next) => {

    const token = req.body.token || req.query.token || null
    const authorization = req.body.authorization || req.query.authorization || null
    const sap_client = req.body.sap_client || req.query.sap_client || null
    const baseUrl = req.body.baseUrl || req.query.baseUrl || null

    const result = {
        status: 200,
        server: 'express',
        router: 'sap',
        method: 'Login'
    }

    try {

        (async () => {

            try {

                const db = SapDashboard.createInstance(token, authorization, baseUrl, sap_client)
                const data = await db.getPerson()
                result.result = data
                Dashboards.push(db) 

                res.json(result);
            }
            catch (err) {
                result.msg = err.message
                result.status = err.status
                res.json(result);
            }

        })()
    }
    catch (err) {
        result.msg = err.message
        result.status = 500
        res.json(result);
    }

})

router.get('/logout', (req,res,next) => {

    const token = req.body.token || req.query.token || null

    Dashboards = Dashboards.filter(item => item.token !== token)

    const result = {
        status: 200,
        server: 'express',
        router: 'sap',
        method: 'Logout'
    }

    res.json(result);

})

router.get('/countries', (req, res, next) => {

    
    const countryName = req.query.name || null
    const result = {
        count: 0,
        status: 200,
        server: 'express',
        router: 'sap',
        method: 'get country'
    }

    try {

        (async () => {

            const data = await SapDashboard.getCountries(countryName)
            result.result = data;
            result.count = data.length;
            res.json(result);

        })()

    }
    catch (err) {
        result.msg = err.message
        result.status = 400
        res.json(result);
    }

})

router.get('/sapusers', (req, res, next) => {


    const token = req.query.token || null
    const result = {
        status: 200,
        count: 0,
        server: 'express',
        router: 'sap',
        method: 'get sap users'
    }

    try {

        (async () => {

            try {

                const db = getDashboard(token)

                const data = await db.getSapUsers()
                result.result = data;
                result.count = data["d"]["results"].length
                res.json(result);
            }
            catch (err) {
                result.msg = err.message
                result.status = 400
                res.json(result);
            }

        })()
    }
    catch (err) {
        result.msg = err.message
        result.status = 400
        res.json(result);
    }

})

router.get('/events', (req,res,next) => {

    const token = req.query.token || null
    const result = {
        status: 200,
        server: 'express',
        count: 0,
        router: 'sap',
        method: 'get events'
    }

    try {

        (async () => {          

            try {

                const db = getDashboard(token)

                const data = await db.getEvents()
                result.result = data;
                result.count = data["RESULTS"].length;
                res.json(result);
            }
            catch (err) {
                result.msg = err.message
                result.status = 400
                res.json(result);
            }

        })()
    }
    catch (err) {
        result.msg = err.message
        result.status = 400
        res.json(result);
    }
})



module.exports = router;