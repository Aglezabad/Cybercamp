var express = require('express');
var router = express.Router();
var User = ("../models/User");


router.post('/login', function(req, res){
	console.log(req.body);
	res.send({ok: true});
});

router.post('/register', function(req, res){
	console.log(req.headers);
	console.log(req.body);
	res.send({ok: true});
});

router.get('/user/:name/contacts', function(req, res){
	User.findOne({username: req.param.name})
		.populate('contacts')
		.exec(function(err, user){
			if(err){
				return next(err);
			}
			return res.send(user.contacts);
		});
});

router.post('/user/:name/contacts', function(req, res){
	return console.log(req.body);
})

router.get('/user/:name/logs', function(req, res) {
	User.findOne({username: req.param.name})
		.populate('logs')
		.exec(function(err, user){
			if(err){
				return next(err);
			}
			return res.send(user.logs);
		});
});

module.exports = router;
