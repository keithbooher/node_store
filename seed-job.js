const axios = require('axios')
const keys = require('./config/keys')


const seed = async () => {
  try {
     // make a request to make Shipping Methods
    let shipping_method = {
      name:"Flat Rate",
      internal_name:"flat_rate",
      shipping_rates: [{
        name: "Standard",
        description: "Standard priority",
        effector: 10,
        display: true
      }],
      display:true
    }
    let shipping_method_data = {shipping_method}
    await axios.post(`${keys.url}/api/store-create/shipping_method/create`, shipping_method_data)


    // make a request to make Store settings
    let store_setting = { 
      name:"Hide Out Of Stock",
      boolean:true,
      description:"Hide Product If Zero Quantity And Not Backorderable",
      internal_name: "hide_zero"
    }
    let store_setting_data = {store_setting}
    await axios.post(`${keys.url}/api/store-create/store_setting/create`, store_setting_data)


    // make a request to make One Mock Category
    let mock_category = {
      name: "Test",
      // NEVER EVER EVER EVER CHANGE PATH NAME
      path_name: "test",
      nest_level: 0,
      display_order: 1,
      sub_categories: [],
      created_at: new Date(),
      deleted_at: null,
      display: true
    }
    let mock_category_data = { category: mock_category }
    const created_cat = await axios.post(`${keys.url}/api/store-create/category/create`, mock_category_data)


    // make a request to make One Mock Product
    let mock_product = {
      name: "Test",
      path_name: "test",
      short_description: "Test Prod",
      description: "Test Product",
      created_at:  new Date(),
      deleted_at: null,
      inventory_count: 1,
      price: 1,
      weight: 1,
      dimensions: {
        height: 1,
        width: 1,
        depth: 1
      },
      categories: [created_cat.data._id],
      image: "",
      display: true,
      home_promotion:  true,
      backorderable: false
    }
    let mock_product_data = { new_product: mock_product }
    await axios.post(`${keys.url}/api/store-create/product/create`, mock_product_data)

    // then manually change the first user to be admin status
    // after they sign in for the first time
  } catch (err) {
    console.log(err)
    // logger.error(err);
  }
 
}
seed()