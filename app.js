//Dependencies
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//Config
var config = require('./config.json');

//Route controllers
var apiIndex = require('./routes/api_index');
var apiLogin = require('./routes/api_login');
var apiLogout = require('./routes/api_logout');
var apiRegister = require('./routes/api_register');
var apiContacts = require('./routes/api_contacts');

var app = express();

//App Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser(config.session.secret));
app.use(session({
    name: config.session.name || "cybercamp.sid",
    secret: config.session.secret,
    store: new MongoStore({
      url: config.session.route,
    }),
    resave: true,
    saveUninitialized: true
  }));

//Connect to mongoDB
mongoose.connect(config.database.route, config.database.options || {});

app.locals = {
    routes: {
        prefix: config.routes.prefix || "cc-"
    } 
};

//Routes
app.use('/'+app.locals.routes.prefix+'api', apiIndex);
app.use('/'+app.locals.routes.prefix+'api/login', apiLogin);
app.use('/'+app.locals.routes.prefix+'api/logout', apiLogout);
app.use('/'+app.locals.routes.prefix+'api/register', apiRegister);
app.use('/'+app.locals.routes.prefix+'api/contacts', apiContacts);



//Catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Error handlers
//Development
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err.stack);
        return res.status(err.status || 500).send({
            status: err.status,
            message: err.message,
            stack: err.stack
        });
    });
}

//Production
app.use(function(err, req, res, next) {
    return res.status(err.status || 500).send({
        status: err.status,
        message: err.message
    });
});

module.exports = app;
