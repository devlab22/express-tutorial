const express = require("express");
const path = require("path");
const app = express();
const helmet = require("helmet");
const cookieparser = require("cookie-parser");
const dirname = process.cwd();
const fs = require('fs');

let PORT = null;
let HOST = null;

try {
    const rawdata = fs.readFileSync(path.join(dirname, 'config.json'));
    const data = JSON.parse(rawdata);
    PORT = data.PORT || 1337
    HOST = data.HOST || 'localhost'

}
catch (e) {
    console.log(e.message)
    PORT = 1337
    HOST = 'localhost'
}

const sapRouter = require('./sapRouter')

app.use(helmet());
app.use(cookieparser());
app.use(express.static(path.join(dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/sap/', sapRouter);

app.get("/", (req,res,next) => {
    console.log('req.query:', req.query);
    console.log('req.cookies:', req.cookies);
   
    res.send(`<h1>My SAP Web Server</h1>`);
});

app.listen(PORT, HOST, () => {
    console.log(`Server listening on ${HOST}:${PORT}`);
});