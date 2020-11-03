var express = require('express');
var router = express.Router();

const products = require("../controllers/products.controller.js");

router.get('/', products.index);
router.post('/', products.index);
router.get('/:productId/duplicate', products.duplicate);
router.post('/autoCreate', products.happenCreated);

module.exports = router;
