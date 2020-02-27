export default {
  auth: {
    _id: "5e52a35de58d94155e9af88f",
    first_name: "keith",
    last_name: "booher",
    credits: 100,
    admin: true,
    googleId: "101528929297924900082",
    email: "keibooher@gmail.com",
    photo: "https://lh3.googleusercontent.com/-DKS3ohvTaRA/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rd6Tpk6kGH9v64ByvAAlDB3gHz7Tg/photo.jpg",
    billing_address: [],
    shipping_address: []
  },
  products: [
    {
      _id:"5e44a5832709777fdef4f0fc",
      description:"test product description",
      deleted_at:null,
      category: [
        {
          _category_id:"5e4040fd4f5d294feb520651",
          category_path_name:"test_category",
          category_name:"test category" 
        },
        {
          _category_id:"5e449d5ed4b97f7709d4dc16",
          category_path_name:"test_category_two",
          category_name:"test category two"
        }
      ],
      name:"test product",
      path_name:"test_product",
      created_at: "2020-02-13T01:25:23.324+00:00",
      inventory_count:1,
      price:10,
      dimensions: {
        height:1,
        width:1,
        depth:1
      },
      image:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.amazon.in%2FRolling-Nature-Money-Hybrid-Indoor%2Fdp%2FB00KWS1HO8&psig=AOvVaw3eU69cga1aH-A4PFH4nkX8&ust=1581356497508000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKChmJOCxecCFQAAAAAdAAAAABAG",
      display:true
    },
    {
      _id:"5e44a646da41ee8025a997de",
      description:"test product two description",
      deleted_at:null,
      category: [
        {
          _category_id:"5e449d5ed4b97f7709d4dc16",
          category_path_name:"test_category_two",
          category_name:"test category two"
        }
      ],
      name:"test product two",
      path_name:"test_product_two",
      created_at: "2020-02-13T01:25:23.324+00:00",
      inventory_count:1,
      price:1,
      dimensions: {
        height:1,
        width:1,
        depth:1
      },
      image:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.amazon.in%2FRolling-Nature-Money-Hybrid-Indoor%2Fdp%2FB00KWS1HO8&psig=AOvVaw3eU69cga1aH-A4PFH4nkX8&ust=1581356497508000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKChmJOCxecCFQAAAAAdAAAAABAG",
      display:true
    }
  ],
  cart: {
    _id: "5e55f6b4bfdc6b3622f08a33",
    checkout_state: "shopping",
    line_items: [
      {_id: "5e55f6b4bfdc6b3622f08a34",
      product_name: "test product",
      image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.amazon.in%2FRoll...",
      _product_id: "5e44a5832709777fdef4f0fc",
      quantity: 2,
      product_price: 10
      },
      {_id: "5e55f6c3bfdc6b3622f08a36",
      product_name: "test product two",
      image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.amazon.in%2FRoll...",
      _product_id: "5e44a646da41ee8025a997de",
      quantity: 2,
      product_price: 1
      }
    ],
    _user_id: "5e52a35de58d94155e9af88f",
    sub_total:22,
    total: 23.76
  }
}