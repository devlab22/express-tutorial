const express = require("express");
const path = require("path");
const app = express();
const helmet = require("helmet");
const cookieparser = require("cookie-parser");
const dirname = process.cwd();

const PORT = 1337;

app.use(helmet());
app.use(cookieparser());
app.use(express.static(path.join(dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const Dashboard = require("./Dashboard");
const myDashboards = []

app.get("/", (req,res,next) => {
    res.json({count: myDashboards.length, dashboards: myDashboards});
});