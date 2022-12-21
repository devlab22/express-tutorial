const express = require("express");
const path = require("path");
const app = express();
const dirname = process.cwd();

const PORT = 1337;

app.use(express.static(path.join(dirname, 'public')));

app.get("/", (req, res) => {
    res.sendFile(path.join(dirname, 'index.html'));
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

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
