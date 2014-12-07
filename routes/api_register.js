var express = require('express');
var router = express.Router();
var User = require("../models/User");

/* POST register: Registra usuario. */
router.post('/', function(req, res, next){
	// Input verification If email is formatted as email
	// Username and password has no restrictions.
	if(!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email)){
		var err = new Error("Validation error: email introduced does not match with pattern.");
		err.status = 400;
		return next(err);
	}
	// Create new user.
	var user = new User({
		username: req.body.username,
		password: req.body.password,
		email: req.body.email
	});
	user.save(function(err){
		if(err){
			return next(err);
		}
		return res.status(200).send({
			ok: true,
			message: "New user registered."
		});
	});
});

module.exports = router;
