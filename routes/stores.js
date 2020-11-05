var express = require('express');
var router = express.Router();

const stores = require("../controllers/stores.controller.js");

/* GET home page. */
router.get('/add', stores.add);
router.get('/:storeId/edit', stores.edit);
router.post('/:storeId', stores.update);
router.get('/:storeId/delete', stores.delete);
router.get('/check/:storeId', stores.checkStore);
router.get('/', stores.index);
router.post('/', stores.create);

module.exports = router;
