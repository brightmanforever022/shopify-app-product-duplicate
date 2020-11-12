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
  let params = { limit: 200 };
  do {
    const products = await shopify.product.list(params);
    const tempList = products.map(pr => pr.title);
    productList.push(...tempList);
    params = products.nextPageParameters;
  } while (params !== undefined);

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

exports.happenCreated = async (req, res) => {
  res.status(200).send('received');
  let createdProductInfo = req.body;
  await sleep(3000);
  createdProductInfo = await shopify.product.get(createdProductInfo.id);
  await broadCast(createdProductInfo);
}

// Broadcast the product from main store to all other stores
exports.duplicate = async (req, res) => {
  // Get product information
  const mainProductId = req.params.productId;
  const mainProductInfo = await shopify.product.get(mainProductId);
  
  await broadCast(mainProductInfo);

  res.redirect('/products');
}

async function broadCast (mainProductInfo) {
  Store.getAllActivated(async (err, stores) => {
    for (i = 0; i < stores.length; i++) {
      // initialize the connection with each store
      const storeConnect = new Shopify({
        shopName: stores[i].store_url,
        apiKey: stores[i].store_api_key,
        password: stores[i].store_password
      });

      // create product by main product Info
      const productVariants = mainProductInfo.variants.map(pv => {
        return {
          option1: pv.option1,
          option2: pv.option2,
          option3: pv.option3,
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

      const imageOrder = mainProductInfo.variants.map(pv => {
        let imageIndex = 100;
        mainProductInfo.images.map((pi, piIndex) => {
          if (pv.image_id === pi.id) {
            imageIndex = piIndex;
          }
        });
        return imageIndex;
      })
      
      try {
        const createdProduct = await storeConnect.product.create(
          {            
            "title": mainProductInfo.title,
            "body_html": mainProductInfo.body_html,
            "product_type": mainProductInfo.product_type,
            "tags": mainProductInfo.tags.split(','),
            "published": false,
            "status": "draft",
            "variants": productVariants,
            "options": productOptions,
            "image": productImage,
            "images": productImgaes,
          }
        );
        
        await sleep(4000);
        
        // update images of variants
        const createdProductInfo = await storeConnect.product.get(createdProduct.id);
        createdProductInfo.variants.map(async (pv, pvIndex) => {
          if (imageOrder[pvIndex] != 100) {
            await storeConnect.productVariant.update(pv.id, {
              "image_id": createdProductInfo.images[imageOrder[pvIndex]].id
            });
            await sleep(500);
          }
        });

      } catch (error) {
        console.log('product creating error: ', error)
      }
    }
  });
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}