const fs = require('fs');
const dirname = process.cwd();
const path = require('path');
const axios = require("axios");

class SapDashboard{

    constructor(token=null, authorization=null, host=null, port=null, sap_client=null){
        this.token = token;
        this.authorization = authorization
        this.host = host
        this.port = port
        this.sap_client = sap_client
    }

    getParams(){

        return{
            'sap_client': this.sap_client
        }
    }
    getHeaders(){

        return {
            'Authorization': `Basic ${this.authorization}`,
            'Accept': 'application/json'
        }
    }

    readConfig() {

        try {
            const rawdata = fs.readFileSync(path.join(dirname, 'sapConfig.json'));
            const data = JSON.parse(rawdata);
            this.host = data.HOST
            this.port = data.PORT
            this.sap_client = data.SAP_CLIENT

        }
        catch (e) {
            console.log(e.message)
        }

    }

    static async getCountries(name = null) {

        if (name === null) {
            const { data } = await axios('https://restcountries.com/v3.1/all')
            return data
        }
        else {
            const { data } = await axios(`https://restcountries.com/v3.1/name/${name}`)
            return data
        }
    
    }

    async getSapUsers() {

        const headers = this.getHeaders();
        const params = this.getParams();
    
        const { data } = await axios(`${this.host}:${this.port}/sap/opu/odata/sap/zve_userui5_srv/UserDataSet`,
            {
                params: params,
                headers: headers 
            }   
        )
        return data
    
    }

    async getEvetns(begda='20200101', endda='20240101' ) {
    
        const headers = this.getHeaders();
        const params = this.getParams();

        params.view = 'PERSON'
        params.begda = begda
        params.endda = endda
        params._FUNCTION = 'Z_GET_CUSTOMIZING'

        const { data } = await axios('http://lhd.lighthouse-it.de:8000/sap/bc/webrfc',
            {
                params: params,
                headers: headers
            }
        )
    
        return data
    
    }

    static createInstance(token, authorization){

        const db = new SapDashboard(token, authorization)
        db.readConfig()
        return db;
    }
}

module.exports = SapDashboard