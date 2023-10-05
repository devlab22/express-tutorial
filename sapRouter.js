"use strict"
const axios = require("axios");
const express = require("express");
const router = express.Router();
const SapDashboard = require("./sapDashboard")

const Dashboards = []

function getDashboard(token = null){

    const db = Dashboards.find(item => item.token === token)

    if (!db){
        throw new Error('user is not authorized')
    }
    return db;
}

async function getCustomizing(token = null) {

    const auth = token

    const authorization = 'uname:password'
    if (!auth) {
        auth = Buffer.from(authorization).toString('base64')
    }

    const { data } = await axios('http://lhd.lighthouse-it.de:8000/sap/bc/webrfc',

        {
            params:{
                'view': 'PERSON',
                'begda': '20200101',
                'endda': '20240101',
                '_FUNCTION': 'Z_GET_CUSTOMIZING',
                'sap-client': '005'
            },
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json'
            }
        }
    )

    return data

}

async function getSapUsers(token = null) {

    const auth = token

    const authorization = 'uname:password'
    if (!auth) {
        auth = Buffer.from(authorization).toString('base64')
    }

    const { data } = await axios('http://lhd.lighthouse-it.de:8000/sap/opu/odata/sap/zve_userui5_srv/UserDataSet/?sap-client=005',

        {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json'
            }
        }
    )
    return data

}


router.get('/', (req, res, next) => {

    res.json({
        "server": 'express',
        "router": 'my sap server',
        "count": Dashboards.length
    })
})

router.use('/login', (req,res,next) => {

    const token = req.body.token || req.query.token || null
    const authorization = req.body.authorization || req.query.authorization || null
    
    const result = {
        status: 200,
        statusText: 'OK',
        server: 'express',
        router: 'sap',
        method: 'get sap users'
    }

    try {

        (async () => {

            try {
                const db = SapDashboard.createInstance(token, authorization)
                
                Dashboards.push({
                    "token": token,
                    "db": db
                }) 

                res.json(result);
            }
            catch (err) {
                result.msg = err.message
                result.status = err.response.status
                result.statusText = err.response.statusText
                res.json(result);
            }

        })()
    }
    catch (err) {
        result.msg = err.message
        result.status = err.response.status
        result.statusText = err.response.statusText
        res.json(result);
    }

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

        const line = getDashboard('12345')

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
       // result.statusText = err.response.statusText
        res.json(result);
    }

})

router.get('/sapusers', (req, res, next) => {


    const token = req.query.token || null
    const result = {
        status: 200,
        statusText: 'OK',
        server: 'express',
        router: 'sap',
        method: 'get sap users'
    }

    try {
        (async () => {

            try {
                const data = await getSapUsers(token)
                result.result = data;
                res.json(result);
            }
            catch (err) {
                result.msg = err.message
                result.status = err.response.status
                result.statusText = err.response.statusText
                res.json(result);
            }

        })()
    }
    catch (err) {
        result.msg = err.message
        result.status = err.response.status
        result.statusText = err.response.statusText
        res.json(result);
    }

})

router.get('/customizing', (req, res, next) => {

    
    const token = req.query.token || null
    const result = {
        status: 200,
        statusText: 'OK',
        server: 'express',
        router: 'sap',
        method: 'get sap customizing'
    }

    try{

         (async () => {

            try {
                const data = await getCustomizing(token)
                result.result = data;
                res.json(result);
            }
            catch (err) {
                
                result.msg = err.message
                result.statusText = err.response.statusText
                result.status = err.response.status
                res.json(result);
            }

        })()
    }
    catch(err){
        result.msg = err.message
        result.status = err.response.status
        result.statusText = err.response.statusText
        res.json(result);
    }

})



module.exports = router;