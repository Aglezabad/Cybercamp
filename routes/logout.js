var express = require('express');
var router = express.Router();

/* GET logout.
 * Use case: User logout.
 */
router.get('/', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
