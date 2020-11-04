const Shopify = require('shopify-api-node');
require('dotenv').config()

// Homepage
exports.index = async (req, res) => {
  // const shopify = new Shopify({
  //   shopName: process.env.STORE_URL,
  //   apiKey: process.env.STORE_API_KEY,
  //   password: process.env.STORE_PASSWORD
  // });

  // // create webhook for product/create
  // try {
  //   const productCreateWebhook = await shopify.webhook.create({
  //     topic: 'products/create',
  //     address: process.env.APP_URL + '/products/autoCreate',
  //     format: 'json'
  //   });
  //   console.log(productCreateWebhook);
  // } catch (error) {
  //   console.log('error: ', error);
  // }
  // render index page
  res.render('index', {page: 'index'});
}
