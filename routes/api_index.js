var express = require('express');
var router = express.Router();
var User = require("../models/User");

/* GET index: Devuelve mensaje de bienvenida. */
router.get('/', function(req, res){
	return res.status(200).send({
		ok: true,
		message: "Welcome to CyberCamp API",
		wow: "Wow, so much security. Such event."
	});
});

module.exports = router;