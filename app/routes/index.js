
var express = require('express');
var router = express.Router();


/* GET home page.  API call with no  */
router.get('/', function(req, res, next) {
	
	res.send('index');
});

module.exports = router;
