const Store = require("../models/store.model.js");
const Shopify = require('shopify-api-node');

// render index page
exports.index = (req, res) => {
  Store.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving stores."
      });
    else res.render('stores/index', {page: 'stores', stores: data});
  });
}

// Check the availability of the store
exports.checkStore = (req, res) => {
  Store.findById(req.params.storeId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Store with id ${req.params.storeId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Store with id " + req.params.storeId
        });
      }
    } 
    else {
      // check the store with api and password
      const shopify = new Shopify({
        shopName: data.store_url,
        apiKey: data.store_api_key,
        password: data.store_password
      });
      shopify.shop.get().then(shopData => {
        data['activated'] = 1;
        Store.updateById(data.id, data, (err, data) => {
          if (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                message: `Not found Store with id ${data.id}.`
              });
            } else {
              res.status(500).send({
                message: "Error updating Store with id " + data.id
              });
            }
          }
          else
            res.redirect('/stores');
        });
      }).catch(error => {
        console.log('error: ', error);
        res.redirect('/stores');
      });
    }
  });
}

// Go to store add page
exports.add = (req, res) => {
  res.render('stores/addStore', {page: 'stores'});
}

// Create a new Store
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Store
  const store = new Store({
    store_name: req.body.store_name,
    store_url: req.body.store_url,
    store_api_key: req.body.store_api_key,
    store_password: req.body.store_password,
    activated: 0
  });

  // Save Store in the database
  Store.create(store, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Store."
      });
    else
      res.redirect('/stores');
  });
};



// Get a single Store with a storeId
exports.edit = (req, res) => {
  Store.findById(req.params.storeId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Store with id ${req.params.storeId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Store with id " + req.params.storeId
        });
      }
    } 
    else {
      res.render('stores/editStore', {page: 'stores', store: data});
    }
  });
};

// Update a Store identified by the storeId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Store.updateById(
    req.params.storeId,
    new Store(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Store with id ${req.params.storeId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Store with id " + req.params.storeId
          });
        }
      }
      else
        res.redirect('/stores');
    }
  );
};

// Delete a Store with the specified storeId in the request
exports.delete = (req, res) => {
  Store.remove(req.params.storeId, (err, data) => {
    if (err) {
      console.log(err);
    }
    
    res.redirect('/stores');
  });
};

