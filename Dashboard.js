
const fs = require('fs');
const dirname = process.cwd();
const path = require('path');
//const axios = require('axios')

class Dashboard {

    constructor(params) {

        this.params = params;
        this.config = {};
        this.adParser = {};
        this.readConfig();
    }

    printParams() {
        console.log(this.params);
    }

    readConfig() {

        try {
            const rawdata = fs.readFileSync(path.join(dirname, 'config.json'));
            const data = JSON.parse(rawdata);
            this.config = data;
        }
        catch (e) {
            console.log(e.message)
        }

        try {
            const rawdata = fs.readFileSync(path.join(dirname, 'adParser.json'));
            const data = JSON.parse(rawdata);
            this.adParser = data;
        }
        catch (e) {
            console.log(e.message)
        }
       
    }

    static async getCountry(name){

        //const {data} = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
        return name
       
    }
}

module.exports = Dashboard