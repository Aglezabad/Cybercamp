var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('page_index', {req: req});
});

module.exports = router;
