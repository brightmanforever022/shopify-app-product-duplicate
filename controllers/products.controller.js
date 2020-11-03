// const Product = require("../models/product.model.js");
const Store = require("../models/store.model.js");
const Shopify = require('shopify-api-node');
require('dotenv').config()
const shopify = new Shopify({
  shopName: process.env.STORE_URL,
  apiKey: process.env.STORE_API_KEY,
  password: process.env.STORE_PASSWORD
});

exports.index = async (req, res) => {
  const title_query = req.body.search_title || '';
  let productList = []
  // Get id/title of all products
  let params = { limit: 5 };
  do {
    const products = await shopify.product.list(params);
    const tempList = products.map(pr => pr.title);
    productList.push(...tempList);
    params = products.nextPageParameters;
  } while (params !== undefined);

  console.log(productList);
  // search product
  shopify.product.list({title: title_query}).then(prList => {
    res.render('products/index', {
      page: 'products',
      productList: productList,
      product: prList[0],
      searchQuery: title_query
    });
  });
}

// Broadcast the product from main store to all other stores
exports.duplicate = (req, res) => {
  const mainProductId = req.params.productId;
  let storeConnect = null;
  
  Store.getAllActivated(async (err, stores) => {
    // Get product information
    const mainProductInfo = await shopify.product.get(mainProductId);
    
    for (i = 0; i < stores.length; i++) {
      // initialize the connection with each store
      storeConnect = new Shopify({
        shopName: stores[i].store_url,
        apiKey: stores[i].store_api_key,
        password: stores[i].store_password
      });

      // create product by main product Info
      const productVariants = mainProductInfo.variants.map(pv => {
        return {
          option1: pv.option1,
          option2: pv.option2,
          price: pv.price,
          sku: pv.sku,
          weight: pv.weight,
          weight_unit: pv.weight_unit,
        }
      })
      const productOptions = mainProductInfo.options.map(op => {
        return {
          name: op.name,
          values: op.values
        }
      });
      const productImgaes = mainProductInfo.images.map(pi => {
        return {
          "src": pi.src,
        }
      });
      const productImage = {
        "src": mainProductInfo.image ? mainProductInfo.image.src : '',
      }
      // console.log(mainProductInfo);
      try {
        const createdProduct = await storeConnect.product.create(
          {            
            "title": mainProductInfo.title,
            "body_html": mainProductInfo.body_html,
            "product_type": mainProductInfo.product_type,
            "tags": mainProductInfo.tags.split(','),
            "product_type": mainProductInfo.product_type,
            "variants": productVariants,
            "options": productOptions,
            "image": productImage,
            "images": productImgaes,
          }
        );
        console.log('product created: ', stores[i].store_name, createdProduct.id);        
      } catch (error) {
        console.log('product creating error: ', error)
      }
    }
  });

  res.redirect('/products');
}

