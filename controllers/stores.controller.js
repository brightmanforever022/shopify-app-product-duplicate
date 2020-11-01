const Store = require("../models/store.model.js");

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

// Go to store add page
exports.add = (req, res) => {
  res.render('/stores/add');
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
    else res.send(data);
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
      res.render('stores/edit', {page: 'stores', store: data});
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
      } else res.send(data);
    }
  );
};

// Delete a Store with the specified storeId in the request
exports.delete = (req, res) => {
  Store.remove(req.params.storeId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Store with id ${req.params.storeId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Store with id " + req.params.storeId
        });
      }
    } else res.send({ message: `Store was deleted successfully!` });
  });
};

// Delete all Stores from the database.
exports.deleteAll = (req, res) => {
  Store.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Stores."
      });
    else res.send({ message: `All Stores were deleted successfully!` });
  });
};