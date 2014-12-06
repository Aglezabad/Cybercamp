var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res) {
  res.render('page_login', { title: res.__("Login"), req: req });
});

module.exports = router;
