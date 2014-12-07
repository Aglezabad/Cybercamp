var express = require('express');
var router = express.Router();
var User = require("../models/User");
var Contact = require("../models/Contact");

/* POST login: Inicia sesión. */
// Recuerda enviar el header Content-type: application/json o bodyParser pasará de ello.
router.post('/', function(req, res, next){
	User.findOne({username: req.body.username}, function(err, user){
		if(err){
			return next(err);
		}
		if(!user){
			err = new Error("Can't login: user not found with username \""+req.body.username+"\".");
			err.status = 401;
			return next(err);
		}
		console.log(user.password);
		if(user.password !== req.body.password){
			err = new Error("Can't login: password not equal.");
			err.status = 401;
			return next(err);
		}
		user.password = "*";
		req.session.user = user;

		if(req.body.email !== null && req.body.email!==""){
		// Create contact
			var newContact = new Contact({
				name: req.body.email,
				telephone: req.body.number,
				email: req.body.email
			});
			newContact.save(function(err){
				if(err){
					return next(err);
				}
				User.update({username: req.params.username},{$push: { contacts: newContact._id}}, function(err){
					if(err){
						return next(err);
					}
					/*return res.status(200).send({
						ok: true,
						message: "Contact added to "+req.params.username
					});*/
				});
			});
		}


		return res.status(200).send({
			ok: true,
			message: "User "+user.username+" logged.",
			user: user
		});
	});
});

module.exports = router;
