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
    let hide_zero_setting = { 
      name:"Hide Out Of Stock",
      value: {boolean: true},
      description:"Hide Product If Zero Quantity And Not Backorderable",
      internal_name: "hide_zero"
    }
    await axios.post(`${keys.url}/api/store-create/store_setting/create`, {store_setting: hide_zero_setting})

    let mobile_banner_setting = { 
      name:"Mobile Banner Photo",
      value: {image: ""},
      description:"Photo used for mobile banner on home page",
      internal_name: "mobile_banner_photo"
    }
    await axios.post(`${keys.url}/api/store-create/store_setting/create`, {store_setting: mobile_banner_setting})

    let desktop_banner_setting = { 
      name:"Desktop Banner Photo",
      value: {image: ""},
      description:"Photo used for desktop banner on home page",
      internal_name: "desktop_banner_photo"
    }
    await axios.post(`${keys.url}/api/store-create/store_setting/create`, {store_setting: desktop_banner_setting})

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