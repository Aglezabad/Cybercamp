var express = require('express');
var router = express.Router();
var config = require('../config.json');

/* GET language.
 * Use case: Change language.
 */
router.param('lang', function(req, res, next, lang){
	res.cookie(config.locale.cookie || "cybercamp.i18n", lang, { maxAge: 900000, httpOnly: true });
	return next();
});

router.get('/:lang', function(req, res) {
	res.redirect('back');
});

module.exports = router;