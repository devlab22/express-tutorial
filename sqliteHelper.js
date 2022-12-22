"use strict"
const sqlite3 = require('sqlite3').verbose();

class MySqliteHelper {
    #path;
    #masterData;


    constructor(dbname) {

        this.#path = dbname.toString();
        this.#masterData = [];
        this.#readMasterData();

    }

    #readMasterData() {

        const query = 'select * from sqlite_master';
        this.#masterData = this.execute(query)

    }

    execute(sqlQuery) {

        const result = []
        const db = new sqlite3.Database(this.#path, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                throw err;
            }
            else {
                db.all(sqlQuery, [], (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    else {
                        //console.log(rows)
                        rows.forEach(row => result.push(row))
                        
                    }
                })

            }
        })

        db.close();
        console.log('exit')
        return result;
    }

    getMasterData(){
        return this.#masterData;
    }

    


}

module.exports = MySqliteHelper;