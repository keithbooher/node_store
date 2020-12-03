const axios = require('axios')
const keys = require('./config/keys')


const fb_product_feed_job = async () => {
  const { GoogleSpreadsheet } = require('google-spreadsheet');
 
  // spreadsheet key is the long id in the sheets URL
  const doc = new GoogleSpreadsheet('1BUwNu8rdAhm0tpfEDHuuYt1Hip2gFo9V88RG3A3yJew');
   
  // use service account creds
  // await doc.useServiceAccountAuth({
  //   client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  //   private_key: process.env.GOOGLE_PRIVATE_KEY,
  // });
  // OR load directly from json file if not in secure environment
  await doc.useServiceAccountAuth(require('./keep-you-eye-open-1481905959db.json'));
  // OR use service account to impersonate a user (see https://developers.google.com/identity/protocols/oauth2/service-account#delegatingauthority)
  // await doc.useServiceAccountAuth(require('./creds-from-google.json'), 'some-user@my-domain.com');
  // OR use API key -- only for read-only access to public sheets
  // doc.useApiKey('YOUR-API-KEY');
   
  await doc.loadInfo(); // loads document properties and worksheets
  // console.log(doc.title);
  // await doc.updateProperties({ title: 'KYEO FB Product Sheet' });
  
  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

  await sheet.clear()
  await sheet.setHeaderRow(['id', 'title', 'description', 'availability', 'condition', 'price', 'link', 'image_link', 'brand', 'inventory', 'fb_product_category', 'google_product_category']);

  const { data } = await axios.get(`${keys.url}/api/products/fb_feed`)


  const new_rows = data.map((p, i) => {
    const id = p._id
    const title = p.name
    const description = p.description
    let availability
    if (p.availability) {
      availability = "available for order"     
    } else {
      availability = "discontinued"
    }
    const condition = "New"
    const price = p.price

    let category_path_name
    if (p.categories.length > 0) {
      let cat = p.categories.find(cat => cat.deleted_at === undefined || cat.deleted_at === null)
      if (cat) {
        category_path_name = cat.path_name
      } else {
        category_path_name = "n_o_n_e"
      }
    } else {
      category_path_name = "n_o_n_e"
    }

    const link = keys.url + "/shop/" + category_path_name + "/" + p.path_name
    let image_link
    if (p.images.i1 !== null) {
      image_link = p.images.i1
    } else {
      image_link = keys.url
    }
    const brand = "Damnit Janet"
    const inventory = p.inventory_count
    const fb_product_category = 169
    const google_product_category = "arts & crafts"

    return {
      id,
      title,
      description,
      availability,
      condition,
      price,
      link,
      image_link,
      brand,
      inventory,
      fb_product_category,
      google_product_category
    }
  })

  await sheet.addRows(new_rows);
  await sheet.saveUpdatedCells();
  // adding / removing sheets
  // const newSheet = await doc.addSheet({ title: 'hot new sheet!' });
  // await newSheet.delete();
}

fb_product_feed_job()