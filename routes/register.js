var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('page_register', { title: res.__("Register"), req: req });
});

router.post('/', function(req, res){
	var newUser = new User({
		username: req.body.username,
		email: req.body.email
	});
	User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            return res.render('page_register', {title: res.__("Register"), req: req, info: err});
        }
        req.login();
        return res.redirect('/');
    });
});

module.exports = router;
