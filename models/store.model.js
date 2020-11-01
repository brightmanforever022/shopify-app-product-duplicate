const sql = require("../database/db.js");

// constructor
const Store = function(store) {
  this.store_name = store.store_name;
  this.store_url = store.store_url;
  this.store_api_key = store.store_api_key;
  this.store_password = store.store_password;
  this.activated = 0;
};

Store.create = (newStore, result) => {
  sql.query("INSERT INTO stores SET ?", newStore, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created store: ", { id: res.insertId, ...newStore });
    result(null, { id: res.insertId, ...newStore });
  });
};

Store.findById = (storeId, result) => {
  sql.query(`SELECT * FROM stores WHERE id = ${storeId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found store: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Store with the id
    result({ kind: "not_found" }, null);
  });
};

Store.getAll = result => {
  sql.query("SELECT * FROM stores", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("stores: ", res);
    result(null, res);
  });
};

Store.updateById = (id, store, result) => {
  sql.query(
    "UPDATE stores SET store_name = ?, store_url = ?, store_api_key = ?, store_password = ?, activated = ? WHERE id = ?",
    [
      store.store_name, store.store_url,
      store.store_api_key, store.store_password,
      store.activated,
      id
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Store with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated store: ", { id: id, ...store });
      result(null, { id: id, ...store });
    }
  );
};

Store.remove = (id, result) => {
  sql.query("DELETE FROM stores WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Store with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted store with id: ", id);
    result(null, res);
  });
};

Store.removeAll = result => {
  sql.query("DELETE FROM stores", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} stores`);
    result(null, res);
  });
};

module.exports = Store;