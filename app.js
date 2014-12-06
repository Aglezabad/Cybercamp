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
var api = require('./routes/api');

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
    app:{
        name: config.app.name || "CyberCamp"
    },
    i18n: {
        catalog: config.locale.catalog || ["en", "es"]
    },
    custom: {
        favicon: config.custom.favicon || "/icon/favicon.ico",
        appleicon: config.custom.appleicon || "/icon/appleicon.png",
        separator: config.custom.separator || " | "
    },
    routes: {
        prefix: config.routes.prefix || "cc-"
    } 
};

//Routes
app.use('/'+app.locals.routes.prefix+'api', api);

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
        return res.status(err.status || 500).send({
            status: err.status,
            message: err.message
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
