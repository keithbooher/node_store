require("babel-register")({
  presets: ["es2015", "react"]
});
 
const router = require("./sitemap-routes").default;
const Sitemap = require("react-router-sitemap").default;
const fetch = require("node-fetch");
const API = "http://localhost:5000" 

async function generateSitemap() {

  let products_res = await fetch(API + "/api/all/products")
  let products = await products_res.json()
  let categories_res = await fetch(API + "/api/sitemap/categories")
  let categories = await categories_res.json()

  let categoryMap = categories.map((cat) => {
      return { category: cat.path_name }
  })

  let productMap = categories.map((cat) => {
    return { category: cat.path_name }
  })
  
  productMap = productMap.map(obj => {
    obj.product = []
    return obj
  })

  products.forEach((product) => {
    product.categories.forEach((cat) => {
      productMap = productMap.map(obj => {
        if (obj.category === cat.path_name) {
          obj.product.push(product.path_name)
        }
        return obj
      })
    })
  })
  
  productMap = productMap.filter(obj => obj.product.length !== 0)

  const paramsConfig = {
    "/shop/:category/:product": productMap,
    "/shop/:category": categoryMap,

  };
  return (
    new Sitemap(router)
      .applyParams(paramsConfig)
      .build('http://my-site.ru')
      .save('public/sitemap.xml')
  );
}

generateSitemap()







