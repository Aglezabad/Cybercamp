var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res) {
  res.render('page_login', { title: res.__("Login"), req: req });
});

/* En el POST username está en req.body.username y el password en req.body.password */
router.post('/', function(req, res, next){
	passport.authenticate('local', function(err, user, info){
		if(err){
			return next(err);
		}
		if(!user){
			console.log(info);
			return res.render('page_login', {title: res.__("Login"), req: req, info: info});
		}
		console.log("User " + user.username + " logged in.");
		return res.redirect('/');
	})(req, res, next);
});

module.exports = router;
