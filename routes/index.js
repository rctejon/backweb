var express = require('express');
var router = express.Router();
var HandlerGenerator = require("../handlegenerator.js");
var middleware = require("../middleware.js");

HandlerGenerator = new HandlerGenerator();
/* GET home page. */
router.get('/', middleware.checkToken, HandlerGenerator.index);
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

router.post( '/login', HandlerGenerator.login);

module.exports = router;
