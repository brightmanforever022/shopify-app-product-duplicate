var express = require('express');
var router = express.Router();

const products = require("../controllers/products.controller.js");

router.get('/', products.index);
router.get('/getAll', products.findAll);
router.post('/', products.create);
router.get('/:productId', products.findOne);
router.put('/:productId', products.update);
router.delete('/:productId', products.delete);
router.delete('/', products.deleteAll);

module.exports = router;
