var express = require('express');
var router = express.Router();

const stores = require("../controllers/stores.controller.js");

/* GET home page. */
router.get('/', stores.index);
router.get('/#/add', stores.add);
router.post('/', stores.create);
router.get('/:storeId/edit', stores.edit);
router.post('/:storeId', stores.update);
router.get('/:storeId/delete', stores.delete);

module.exports = router;
