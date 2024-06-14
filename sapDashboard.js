const axios = require("axios");
const crypto = require("crypto")
const xmlParser = require('xml2json')
const soap = require('soap');

class SapDashboard {

    constructor(params = {}) {
        this.token = crypto.randomUUID();
        this.authorization = params['authorization'] || null
        this.sap_client = params['sap_client'] || null
        this.uname = ''
        this.baseUrl = params['baseUrl'] || null
        var timeout = params['timeout'] || 60
        this.timeout = parseInt(timeout)
        this.begda = params['begda'] || '19000101'
        this.endda = params['endda'] || '99991231'
        this.soapDest = null
        this.WSDL = null
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

        const service = `lighth/bowservice/${this.sap_client}/bowline/bowservice`
        this.WSDLUrl = `${this.baseUrl}/sap/bc/srt/wsdl/flv_10002A1011D1/bndg_url/sap/bc/srt/rfc/${service}`

        // service = `lighth/bshservice/${this.sap_client}/bshservice/bshservbind`

        this.loginTime = SapDashboard.getDateTime(new Date())
        this.updateLastActionTime()

    }

    updateLastActionTime() {
        var date = new Date();
        var d = new Date();
        this.lastActionTime = SapDashboard.getDateTime(date)
        d.setMinutes(date.getMinutes() + this.timeout)
        this.logoutTime = SapDashboard.getDateTime(d)
    }

    checkParams() {

        if (!this.token) {
            throw new Error('set token', { status: 400 })
        }

        if (!this.authorization) {
            throw new Error('set authorization', { status: 400 })
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

        if (!this.begda) {
            var currentDate = new Date()
            //this.begda = currentDate.toISOString().split('T')[0].replace('-', '')
            this.begda = '' + currentDate.getFullYear() +
                + ("0" + (currentDate.getMonth() + 1)).slice(-2)
                + (currentDate.getDate())
        }

        if (!this.endda) {
            var d = new Date()
            var date = new Date()
            date.setMonth(d.getMonth() + 3)
            this.endda = '' + date.getFullYear()
                + ("0" + (date.getMonth() + 1)).slice(-2)
                + (date.getDate())


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

        /*  params.view = 'EVENTS'
         params.begda = this.begda
         params.endda = this.endda
         params._FUNCTION = 'Z_EVENTS_MGR'
         params.plvar = this.person.plvar
         params.otype = this.person.otype
         params.realo = this.person.realo */

        const filter = `otype eq '${this.person.otype}' and objid eq '${this.person.realo}' and begda eq '${this.begda}' and endda eq '${this.endda}' `

        const { data } = await axios(`${this.baseUrl}/sap/opu/odata/LIGHTH/PARTIC_MANAGEMENT_SRV/eventSet?$filter=${filter}`, {
            params: params,
            headers: headers
        })

        /*  const { data } = await axios(`${this.baseUrl}/sap/bc/webrfc`,
             {
                 params: params,
                 headers: headers
             }
         ) */

        return data

    }

    async getEvent(otype = 'E', objid = null) {

        if (!objid) {
            throw new Error('set objid', { status: 400 })
        }

        const headers = this.getHeaders();
        const params = this.getParams();

        const filter = `otype eq '${otype}' and objid eq '${objid}' `

        const { data } = await axios(`${this.baseUrl}/sap/opu/odata/LIGHTH/PARTIC_MANAGEMENT_SRV/event_detailsSet?$filter=${filter}`, {
            params: params,
            headers: headers
        })

        /*  params.view = 'EVENT'
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
         ) */

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
        this.person.admin = data['RESULTS']['ADMIN'] === 'X' ? true : false

        return data

    }

    async setSAPInfo(payload = {}) {

        const headers = this.getHeaders();
        const params = this.getParams();

        params._FUNCTION = 'Z_EVENTS_MGR'
        params.view = 'SET_ENDPOINTS_INFO'

        for (const [key, value] of Object.entries(payload)) {
            params[key] = value
        }

        await axios(`${this.baseUrl}/sap/bc/webrfc`,{
            params: params,
            headers: headers
        })

        
    }

    async getWSDL() {

        const headers = this.getHeaders();

        headers.Accept = 'text/xml'
        headers['Content-Type'] = 'text/xml'

        const { data } = await axios(`${this.WSDLUrl}`,
            {
                headers: headers
            }
        )

        const result = xmlParser.toJson(data)
        const tmp = JSON.parse(result)
        this.WSDL = tmp
        return tmp
    }

    getWSDLAttribute(name = null) {

        var result = null

        if (this.WSDL) {

            if (name === 'location') {
                result = this.WSDL['wsdl:definitions']['wsdl:service']['wsdl:port']['soap:address']['location']
            }
        }

        return result
    }

    async getCustomizing() {

        const headers = this.getHeaders();

        if (!this.WSDL) {
            await this.getWSDL()
        }

        const location = this.getWSDLAttribute('location')


        headers['Accept'] = 'text/xml'
        headers['Content-Type'] = 'text/xml'
        headers['SoapAction'] = `${location}/getCustomizing`
        headers['connection'] = 'keep-alive'

       // console.log(location)
       // console.log(headers)
        var args = {name: 'getCustomizing'};

        var client = await soap.createClientAsync(this.WSDLUrl,{
            wsdl_headers: headers
        })
       // var result = await client.method(args, this.processData)
       const res = client.setSOAPAction('getCustomizing')
        console.log(res)
        return []

        /* const { data } = await axios(`${this.WSDLUrl}`,
            {
                headers: headers
            }
        )

        const result = xmlParser.toJson(data)
        const tmp = JSON.parse(result)
        return tmp */
    }

    async processData(args){

        return new Promise((resolve) => {
            // do some work
            console.log(resolve)
            resolve({
              name: args.name
            });
          });
    }

    async getPersonUI() {

        const headers = this.getHeaders();
        const params = this.getParams();

        const { data } = await axios(`${this.baseUrl}/sap/opu/odata/LIGHTH/PARTIC_MANAGEMENT_SRV/person4usSet`,
            {
                params: params,
                headers: headers
            }
        )

        if (data['d']['results'].length > 0) {

            this.person.otype = data['d']['results'][0]['otype']
            this.person.realo = data['d']['results'][0]['realo']
            this.person.short = data['d']['results'][0]['short']
            this.person.stext = data['d']['results'][0]['stext']
            this.person.org_otype = data['d']['results'][0]['org_otype']
            this.person.org_objid = data['d']['results'][0]['org_objid']
            this.person.org_short = data['d']['results'][0]['org_short']
            this.person.org_stext = data['d']['results'][0]['org_stext']
            this.person.admin = data['d']['results'][0] === 'X' ? true : false
        }

        return data
    }

    static createInstance(params = {}) {

        const db = new SapDashboard(params)
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