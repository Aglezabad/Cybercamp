//Dependencies
var express = require('express');
var ect = require('ect');
var i18n = require('i18n');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

//DB models
var User = require('./models/User');

//Config
var config = require('./config.json');

//Route controllers
var index = require('./routes/index');
var login = require('./routes/login');
var logout = require('./routes/logout');
var register = require('./routes/register');
var setLang = require('./routes/setLang');
var admin = require('./routes/admin');

var app = express();

//View engine setup
var ectRenderer = ect({ watch: true, root: __dirname + '/views', ext: '.ect' });
app.set('view engine', 'ect');
app.engine('ect', ectRenderer.render);

//Locales
i18n.configure({
    locales: config.locale.catalog || ['en', 'es'],
    defaultLocale: config.locale.default || "en",
    cookie: config.locale.cookie || "cybercamp.i18n",
    prefix: config.locale.prefix || "cybercamp-i18n-",
    directory: config.locale.directory || "./i18n"
});

//Connect to mongoDB
mongoose.connect(config.database.route, config.database.options || {});

//App Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({name: config.session.name, secret: config.session.secret, resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(require('less-middleware')(config.routes.less || "./public"));
app.use(express.static(config.routes.static || "./public"));

app.use(i18n.init);

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

//PassportJS
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Routes
app.use('/', index);
app.use('/'+app.locals.routes.prefix+'login', login);
app.use('/'+app.locals.routes.prefix+'logout', logout);
app.use('/'+app.locals.routes.prefix+'register', register);
app.use('/'+app.locals.routes.prefix+'setlang', setLang);
app.use('/'+app.locals.routes.prefix+'admin', admin);

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
        res.status(err.status || 500);
        res.render('page_error', {
            title: err.message,
            message: err.message,
            status: err.status,
            error: err
        });
    });
}

//Production
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('page_error', {
        title: err.message,
        message: err.message,
        status: err.status,
        error: {}
    });
});


module.exports = app;
