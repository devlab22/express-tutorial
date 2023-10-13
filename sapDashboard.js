const axios = require("axios");

class SapDashboard {

    constructor(token = null, authorization = null, baseUrl=null, sap_client = null, timeout=60, begda=null, endda=null) {
        this.token = token;
        this.authorization = authorization
        this.sap_client = sap_client
        this.uname = ''
        this.baseUrl = baseUrl
        this.timeout = parseInt(timeout)
        this.begda = begda
        this.endda = endda
        this.person = {
            plvar: '',
            otype: '',
            realo: '',
            short: '',
            stext: '',
            org_otype: '',
            org_objid: '',
            org_short: '',
            org_stext: '',
            admin: false
        }
        
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

        if(!this.begda){
            var currentDate = new Date()
            //this.begda = currentDate.toISOString().split('T')[0].replace('-', '')
            this.begda = '' + currentDate.getFullYear() + 
            + ("0" + (currentDate.getMonth() + 1)).slice(-2) 
            + (currentDate.getDate())
        }

        if(!this.endda){
            var d = new Date()
            var date = new Date()
            date.setMonth(d.getMonth() + 3)
            this.endda = '' + date.getFullYear()  
                        + ("0" + (date.getMonth() + 1)).slice(-2)
                        + ( date.getDate() )
            
            
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

    async getEvents() {

        const headers = this.getHeaders();
        const params = this.getParams();

        params.view = 'EVENTS'
        params.begda = this.begda
        params.endda = this.endda
        params._FUNCTION = 'Z_EVENTS_MGR'
        params.plvar = this.person.plvar
        params.otype = this.person.otype
        params.realo = this.person.realo

        const { data } = await axios(`${this.baseUrl}/sap/bc/webrfc`,
            {
                params: params,
                headers: headers
            }
        )

        return data

    }

    async getEvent(otype='E', objid=null) {

        if(!objid){
            throw new Error('set objid', {status: 400})
        }

        const headers = this.getHeaders();
        const params = this.getParams();

        params.view = 'EVENT'
        params.begda = this.begda
        params.endda = this.endda
        params._FUNCTION = 'Z_EVENTS_MGR'
        params.plvar = this.person.plvar
        params.otype = otype
        params.objid = objid

        const { data } = await axios(`${this.baseUrl}/sap/bc/webrfc`,
            {
                params: params,
                headers: headers
            }
        )

        return data

    }

    async getPerson() {

        const headers = this.getHeaders();
        const params = this.getParams();

        params.view = 'PERSON'
        params.begda = this.begda
        params.endda = this.endda
        params._FUNCTION = 'Z_EVENTS_MGR'

        const { data } = await axios(`${this.baseUrl}/sap/bc/webrfc`,
            {
                params: params,
                headers: headers
            }
        )

        this.person.plvar = data['RESULTS']['PLVAR']
        this.person.otype = data['RESULTS']['OTYPE']
        this.person.realo = data['RESULTS']['REALO']
        this.person.short = data['RESULTS']['SHORT']
        this.person.stext = data['RESULTS']['STEXT']
        this.person.org_otype = data['RESULTS']['ORG_OTYPE']
        this.person.org_objid = data['RESULTS']['ORG_OBJID']
        this.person.org_short = data['RESULTS']['ORG_SHORT']
        this.person.org_stext = data['RESULTS']['ORG_STEXT']
        this.person.admin = data['RESULTS']['ADMIN'] == 'X' ? true : false
        
        return data

    }

    static createInstance(token, authorization, baseUrl=null, sap_client = null, timeout=60, begda=null, endda=null) {

        const db = new SapDashboard(token, authorization, baseUrl, sap_client, timeout, begda, endda)
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