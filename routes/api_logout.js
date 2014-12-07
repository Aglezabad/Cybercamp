var express = require('express');
var router = express.Router();
var User = require("../models/User");

/* POST logout: Cierra sesión. */
// Recuerda enviar el header Content-type: application/json o bodyParser pasará de ello.
router.get('/', function(req, res, next){
	req.session = null;
	return res.status(200).send({
		ok: true,
		message: "Session closed."
	});
});

module.exports = router;
