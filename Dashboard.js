
const fs = require('fs');
const dirname = process.cwd();
const path = require('path');
const axios = require('axios');

class Dashboard {

    constructor(params) {

        this.params = params;
        this.config = {};
        this.adParser = {};
        this.orgId = null;
        this.readConfig();
        this.baseUrl = 'https://api.meraki.com/api/v1';
        this.apiKey = "75dd5334bef4d2bc96f26138c163c0a3fa0b5ca5";
       /*  this.msg = {
            code: 200,
            message: ""
        } */

       /*  if (!this.orgId) {

            (async () => {

                try {
                    const organizations = await this.getOrganizations();
                    this.orgId = organizations[0]['id']

                } catch (err) {

                    console.log('catch')
                    console.log(JSON.parse(err.message))
                    this.msg = JSON.parse(err.message)

                }

            })()

        } */


    }

    getHeaders() {

        return {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Cisco-Meraki-API-Key": this.apiKey
        }
    }

    async getData(url) {

        try {
            const response = await axios.get(url, {
                headers: this.getHeaders()
            });
            return response.data;
        }
        catch (err) {
           // console.log('error in getData')
            throw new Error(`{ "status": ${err.response.status}, "message": "${err.response.statusText}" }`)
        }

    }
    async getNetworks() {

        const data = this.getData(`${this.baseUrl}/organizations/${this.orgId}/networks`);
        return data;

    }
    async getOrganizations() {

        const data = this.getData(`${this.baseUrl}/organizations`);
        return data;

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

    static async getCountry(name) {

        const { data } = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
        return data;

    }

    static async login(params){

        var result = {} 

        try{
            const tmp = new Dashboard(params);

            const organizations = await tmp.getOrganizations();
            tmp.orgId = organizations[0]['id'];

            result['obj'] = tmp;
            result['login'] = params.login;
            result['token'] = params.token;
            return result;
        }
        catch(err){
            throw new Error(err.message)
        }


    }
}

module.exports = Dashboard