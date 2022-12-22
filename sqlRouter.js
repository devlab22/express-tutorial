"use strict"
const express = require("express");
const router = express.Router();
const MySqliteHelper = require('./sqliteHelper')
var myDB = null;

function connect(dbname){

    myDB = new MySqliteHelper(dbname);
    const data = myDB.getMasterData()
    console.log(data)
}

router.get("/", (req,res,next) => {

    res.json({database: "sqlite3"});
});

router.post('/connect', (req,res,next) => {

    const dbname = req.body['dbname']
    const result = {
        code: 200,
        message: "OK"
    }

    try{
      //  myDB = new MySqliteHelper(dbname);
      //  const data =  myDB.getMasterData()
        connect(dbname)

    }
    catch(e){
        result['code'] = 400;
        result['message'] = e.message;
    }
    
    res.json(result)
})


module.exports = router