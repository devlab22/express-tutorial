const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/users/", (req, res) => {
    res.send( "<h1>Hallo Express => GET users</h1>");
});

app.post("/api/users/", (req, res) => {
    res.send( "<h1>Hallo Express => POST user</h1>");
});

app.put("*", (req, res) => {
    res.send( "<h1>Hallo Express => PUT</h1>");
});

app.delete("*", (req, res) => {
    res.send( "<h1>Hallo Express => DELETE</h1>");
});

app.listen(1337, () => {
    console.log('Server listening on port 1337');
});
