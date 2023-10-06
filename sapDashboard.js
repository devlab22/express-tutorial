const axios = require("axios");

class SapDashboard {

    constructor(token = null, authorization = null, host = null, port = null, sap_client = null) {
        this.token = token;
        this.authorization = authorization
        this.host = host
        this.port = port
        this.sap_client = sap_client
        this.uname = ''

        this.checkParams()
    }

    checkParams() {

        if (!this.token) {
            throw new Error('set token', {status: 400})
        }

        if (!this.authorization) {
            throw new Error('set authorization', {status: 400})
        }

        const value = Buffer.from(this.authorization, 'base64').toString('ascii')
        const values = value.split(':')
        this.uname = values[0]

        if (!this.host) {
            this.host = "http://lhd.lighthouse-it.de"
            // throw new Error('set host', {status: 400})
        }

        if (!this.port) {
            this.port = '8000'
            // throw new Error('set port', {status: 400})
        }

        if (!this.sap_client) {
            this.sap_client = '005'
            //throw new Error('set sap client', {status: 400})
        }


    }

    getParams() {

        return {
            'sap_client': this.sap_client
        }
    }
    getHeaders() {

        return {
            'Authorization': `Basic ${this.authorization}`,
            'Accept': 'application/json'
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

    async getEvents(begda = '20200101', endda = '20240101') {

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

    static createInstance(token, authorization, host = null, port = null, sap_client = null) {

        const db = new SapDashboard(token, authorization, host, port, sap_client)
        return db;
    }
}

module.exports = SapDashboard