"use strict"
const express = require("express");
const router = express.Router();
const MySqliteHelper = require('./sqliteHelper')
var myDB = null;

function connect(dbname=null){

    if(!dbname){
        throw new Error('database is not defined', {status: 400})
    }
    myDB = new MySqliteHelper(dbname);
    const data = myDB.getMasterData()
    console.log(data)
}

router.get("/", (req,res,next) => {

    res.json({database: "sqlite3"});
});

router.use('/connect', (req,res,next) => {

    const dbname = req.body.dbname || req.query.dbname || null
    const result = {
        status: 200,
        message: "OK"
    }

    try{
      //  myDB = new MySqliteHelper(dbname);
      //  const data =  myDB.getMasterData()
        connect(dbname)

    }
    catch(e){
        result.status = 400;
        result.message = e.message;
    }
    
    res.json(result)
})


module.exports = router