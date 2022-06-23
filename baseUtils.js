function authenticateUser(req, res, next){
    res.locals.validatedUser = 'Bob';
    console.log('middleware:', res.locals.validatedUser);
    next();
}

function rootSide (req, res, next){
    console.log('root:');
    res.send( "<h1>Hallo Express => GET </h1>");
    next();
}

function users(req, res, next){
    console.log('users:', res.locals.validatedUser);
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