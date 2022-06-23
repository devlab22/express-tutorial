function authenticateUser(req, res, next){
    res.locals.validateUsers = 'Bob';
    console.log('middleware:', res.locals.validateUsers);
    next();
}

function rootSide (req, res, next){
    console.log('root:', res.locals.validateUsers);
    res.send( "<h1>Hallo Express => GET </h1>");
    next();
}

function users(req, res, next){
    console.log('users:', res.locals.validateUsers);
    res.send( "<h1>Hallo Express => GET users</h1>");
}

function postUser ({name, password}) {
   console.log(`name: ${name}, password: ${password}`);
}

module.exports = { 
    authenticateUser, 
    rootSide, 
    users,
    postUser 
}