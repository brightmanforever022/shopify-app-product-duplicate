var express = require('express');
var router = express.Router();

const indexes = require("../controllers/indexes.controller.js");

/* GET home page. */
router.get('/', indexes.index);

module.exports = router;
