var express = require('express');
var router = express.Router();
var User = require("../models/User");

/* POST login: Inicia sesión. */
// Recuerda enviar el header Content-type: application/json o bodyParser pasará de ello.
router.post('/', function(req, res, next){
	User.findOne({username: req.body.username}, function(err, user){
		if(err){
			return next(err);
		}
		if(!user){
			var err = new Error("Can't login: user not found with username \""+req.body.username+"\".");
			err.status = 401;
			return next(err);
		}
		if(user.password !== req.body.password){
			var err = new Error("Can't login: password not equal.");
			err.status = 401;
			return next(err);
		}
		user.password = "*";
		req.session.user = user;
		return res.status(200).send({
			ok: true,
			message: "User "+user.username+" logged.",
			user: user
		});
	});
});

module.exports = router;
