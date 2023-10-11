const axios = require("axios");

class SapDashboard {

    constructor(token = null, authorization = null, baseUrl=null, sap_client = null, timeout=60) {
        this.token = token;
        this.authorization = authorization
        this.sap_client = sap_client
        this.uname = ''
        this.baseUrl = baseUrl
        this.timeout = timeout
        
        this.checkParams()

        this.loginTime = SapDashboard.getDateTime(new Date())
        this.updateLastActionTime()
        
    }

    updateLastActionTime(){
        var date = new Date();
        var d = new Date();
        this.lastActionTime = SapDashboard.getDateTime(date)
        d.setMinutes(date.getMinutes() + this.timeout)
        this.logoutTime = SapDashboard.getDateTime(d)
    }

    checkParams() {

        if (!this.token) {
            throw new Error('set token', {status: 400})
        }

        if (!this.authorization) {
            throw new Error('set authorization', {status: 400})
        }

        if (!this.baseUrl) {
            this.baseUrl = "http://lhd.lighthouse-it.de:8000"
            // throw new Error('set baseUrl', {status: 400})
        }

        const value = Buffer.from(this.authorization, 'base64').toString('ascii')
        const values = value.split(':')
        this.uname = values[0]

        

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

        const { data } = await axios(`${this.baseUrl}/sap/opu/odata/sap/zve_userui5_srv/UserDataSet`,
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

        params.view = 'EVENTS'
        params.begda = begda
        params.endda = endda
        params._FUNCTION = 'Z_EVENTS_MGR'

        const { data } = await axios(`${this.baseUrl}/sap/bc/webrfc`,
            {
                params: params,
                headers: headers
            }
        )

        return data

    }

    async getPerson(begda = '20200101', endda = '20240101') {

        const headers = this.getHeaders();
        const params = this.getParams();

        params.view = 'PERSON'
        params.begda = begda
        params.endda = endda
        params._FUNCTION = 'Z_EVENTS_MGR'

        const { data } = await axios(`${this.baseUrl}/sap/bc/webrfc`,
            {
                params: params,
                headers: headers
            }
        )

        return data

    }

    static createInstance(token, authorization, baseUrl=null, sap_client = null, timeout=60) {

        const db = new SapDashboard(token, authorization, baseUrl, sap_client, timeout)
        return db;
    }

    static getDateTime(currentDate) {

        const datetime =
            currentDate.getFullYear() + "/"
            + (currentDate.getMonth() + 1) + "/"
            + (currentDate.getDate()) + ", "
            + currentDate.getHours() + ":"
            + currentDate.getMinutes() + ":"
            + currentDate.getSeconds();

        return datetime;
    }
}

module.exports = SapDashboard