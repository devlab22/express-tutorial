"use strict"
const express = require("express");
const router = express.Router();
const Dashboard = require("./Dashboard");
const myDashboards = []


function getDashoard(token) {

    return myDashboards.find(tmp => tmp.token === token);
}


router.get("/", (req, res, next) => {

    const data = []

    for (let i = 0; i < myDashboards.length; i++) {

        data.push({
            login: myDashboards[i].login,
            token: myDashboards[i].token
        })

    }

    res.json({ count: data.length, server: "Node JS Express", dashboards: data });
});

router.get("/organizations", (req, res, next) => {

    const result = {
        request: false,
        data: []
    }

    const token = req.query['token']
    const tmp = getDashoard(token)

    if (tmp) {

        (async () => {

            const data = await tmp['obj'].getOrganizations();
            result['login'] = tmp['login'];
            result['data'] = data;
            result['request'] = true;
            res.json(result);
        })()

    } else {

        result['error'] = `token ${token} not found`
        res.json(result)
    }

})

router.get("/networks", (req, res, next) => {

    const result = {
        request: false,
        data: []
    }

    const token = req.query['token']
    const tmp = getDashoard(token)

    if (tmp) {

        (async () => {

            const data = await tmp['obj'].getNetworks();
            result['login'] = tmp['login'];
            result['data'] = data;
            result['request'] = true;
            res.json(result);
        })()

    } else {

        result['error'] = `token ${token} not found`
        res.json(result)
    }

})

router.get("/country", (req, res, next) => {

    const name = req.query.name;
    // console.log(req.body)
    // console.log(req.query)
    // console.log(req.params)

    const result = {
        request: false,
        country: name
    }

    if (name) {

        (async () => {

            const data = await Dashboard.getCountry(name)
            result['data'] = data
            result['request'] = true;
            res.json(result);
        })()

    }

});

router.get("/print", (req, res, next) => {
    console.log('print')
    // console.log('query', req.query)
    // console.log('params', req.params)
    // console.log('body', req.body)

    const token = req.query['token']
    const tmp = getDashoard(token)
    let result = {}
    if (tmp) {
        // tmp.obj.printParams()
        result['login'] = tmp.login;
        result['token'] = tmp.token;
    } else {
        // console.log('object not found')
        result['message'] = `token ${token} not found`
    }

    res.json(result);
});

router.post("/login", (req, res, next) => {
    console.log('login')

    const params = {
        login: req.body['login'],
        token: req.body['token']
    }


    if (params) {


        (async () => {

            try {
                const data = await Dashboard.login(params)
                myDashboards.push(data)

                res.json(params);
            }
            catch (err) {
                console.log(err.message)
               // params['error'] = JSON.parse(err.message);
                res.json(params)
            }

        })()

    }

    /*   try {
          const tmp = new Dashboard(params);
  
          console.log(tmp.msg)
          if (tmp.msg.code < 300) {
  
              console.log("login true")
              const data = {
                  obj: tmp,
                  token: req.body['token'],
                  login: req.body['login']
              }
              myDashboards.push(data)
  
          } else {
              console.log('catch error')
              params['error'] = tmp.msg
          }
  
          res.json(params);
      }
      catch (err) {
          params['error'] = "unhandled error"
          res.json(params)
      } */
    // res.json(params)
});

router.get("/logout", (req, res, next) => {
    console.log('logout')

    const token = req.query.token;
    const result = {
        query: req.query,
        logout: false
    }

    for (var i = 0; i < myDashboards.length; i++) {
        const tmp = myDashboards[i];

        if (tmp.token === token) {
            console.log(i)
            result['logout'] = true;
            myDashboards.splice(i, 1)
            break
        }
    }

    res.json(result);
});

router.put("/:id", (req, res, next) => {
    console.log('update')
    console.log('id:', req.params.id)
    console.log('login:', req.body['login'])
    res.json(req.body);
});

router.delete("/:id", (req, res, next) => {
    console.log('delete')
    console.log('id:', req.params.id)
    res.json(req.body);
});

module.exports = router;