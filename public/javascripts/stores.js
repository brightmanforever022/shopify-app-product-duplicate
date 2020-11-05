function deleteAllStores(e) {
  if (confirm('Are you sure that you delete all stores?')) {
    // delete all stores
    console.log('it will delete all stores in db');
    window.location.href = '/stores/deleteAll';
  } else {
    // you denied to delete all stores
    console.log('There are no any actions here');
  }
}

function addStore() {
  window.location.href = '/stores/add';
}

function deleteStore(id) {
  if (confirm('Are you sure that you delete this store?')) {
    // delete a store by id
    console.log('it will delete a store by id');
    window.location.href = '/stores/' + id + '/delete/';
  } else {
    // you denied to delete a store by id
    console.log('There are no any actions here');
  }
}