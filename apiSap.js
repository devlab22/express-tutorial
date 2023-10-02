"use strict"
const axios = require("axios");
const express = require("express");
const router = express.Router();

async function getCountries(name = null) {

    if (name === null) {
        const { data } = await axios('https://restcountries.com/v3.1/all')
        return data
    }
    else {
        const { data } = await axios(`https://restcountries.com/v3.1/name/${name}`)
        return data
    }

}

async function getSapUsers() {

    const auth = 'dmVuZ2VsaGFyZDpzbGF2YTMx'
   // const auth = Buffer.from(authorization).toString('base64')
    const { data } = await axios('http://lhd.lighthouse-it.de:8000/sap/opu/odata/sap/zve_userui5_srv/UserDataSet',

        {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        }
    )
    return data

}


router.get('/', (req, res, next) => {

    res.json({
        "server": 'express',
        "router": 'sap'
    })
})

router.get('/countries', (req, res, next) => {

    console.log(req.body)
    const countryName = req.query.name || null
    const result = {
        count: 0,
        code: 200,
        server: 'express',
        router: 'sap',
        method: 'get country'
    }

    try {

        (async () => {

            const data = await getCountries(countryName)
            result.result = data;
            result.count = data.length;
            res.json(result);

        })()

    }
    catch (err) {
        result.msg = err.message
        result.code = 401
        res.json(result);
    }

})

router.get('/sapusers', (req, res, next) => {


    const result = {
        count: 0,
        code: 200,
        server: 'express',
        router: 'sap',
        method: 'get sap users'
    }

    try {

        (async () => {

            try {
                const data = await getSapUsers()
                result.result = data;
                result.count = data.length;
                res.json(result);
            }
            catch (err) {
                result.msg = err.message
                result.code = 401
                res.json(result);
            }

        })()

    }
    catch (err) {
        result.msg = err.message
        result.code = 401
        res.json(result);
    }

})



module.exports = router;