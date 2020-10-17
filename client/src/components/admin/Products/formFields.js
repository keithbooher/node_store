import _ from 'lodash'

export const productFields = [
  { label: 'Name', name: 'name', noValueError: 'You must provide an address' },
  { label: 'Path Name', name: 'path_name', display: false, typeOfComponent: 'field-disable', noValueError: 'You must provide an address' },
  { label: 'Sku', name: 'sku', noValueError: 'You must provide an sku' },
  { label: 'Description', name: 'description', typeOfComponent: "text-area", noValueError: 'You must provide an address' },
  { label: 'Short Description', name: 'short_description', noValueError: 'You must provide an address' },
  { label: 'Meta Title', name: 'meta_title', noValueError: 'You must provide an address' },
  { label: 'Meta Description', name: 'meta_description', noValueError: 'You must provide an address' },
  { label: 'Meta Keywords (separate by commas)', name: 'meta_keywords', noValueError: 'You must provide an address' },
  { label: 'Inventory Count', name: 'inventory_count', typeOfComponent: "number", noValueError: 'You must provide an address' },
  { label: 'Price', name: 'price', typeOfComponent: "number", noValueError: 'You must provide an address' },
  { label: 'Height', name: 'height', typeOfComponent: "number", noValueError: 'You must provide an address' },
  { label: 'Width', name: 'width', typeOfComponent: "number", noValueError: 'You must provide an address' },
  { label: 'Depth', name: 'depth', typeOfComponent: "number", noValueError: 'You must provide an address' },
  { label: 'Weight', name: 'weight', typeOfComponent: "number", noValueError: 'You must provide an address' },
  { label: 'Display To Customer', name: 'display', typeOfComponent: 'check-box', noValueError: 'You must provide a value' },
  { label: 'Display In Gallery', name: 'gallery', typeOfComponent: 'check-box', noValueError: 'You must provide a value' },
  { label: 'Home Page Promotion', name: 'home_promotion', typeOfComponent: 'check-box', noValueError: 'You must provide a value' },
  { label: 'Make Backorderable', name: 'backorderable', typeOfComponent: 'check-box', noValueError: 'You must provide a value' },
  { label: 'Availability', name: 'availability', typeOfComponent: 'check-box', noValueError: 'You must provide a value' },
  { label: 'Gift Note', name: 'gift_note', typeOfComponent: 'check-box', noValueError: 'You must provide a value' },
  { label: 'Categories', name: 'categories', typeOfComponent: 'tree', options: {}, noValueError: 'You must provide an address' },
  { label: 'Image', name: 'images', typeOfComponent: 'photo-upload', noValueError: 'You must provide an address' },
]

export const categoryField = [
  { label: 'Categories', name: 'categories', typeOfComponent: 'tree', options: {}, noValueError: 'You must provide an address' },
]

export const productSearchField = [
  { label: 'Search For Product By Name Or Sku', name: 'search_bar', noValueError: 'You must provide an address' },
]
// FOR INJECTING ***CATEGORY*** DATA

export const injectCategoryDataIntoFormFields = (categories, product, create_or_update) => {
  let pulledFields = create_or_update === "create" ? productFields : categoryField
  // We cycle through the fields AND IF its the category field:
  // we'll want to add the array of categories to the options on the category field
  let options = []
  pulledFields.forEach((field) => {
    if (field.name === 'categories') {
      // fill out options indiscriminately 
      categories.forEach((category) => {
        options.push({ ...category, default: false })
      })
    }

    if (field.name === 'path_name' && product !== null) {
      field.display = true
    } else {
      field.display = false
    }
  })

  // if updating, lets set the product's assigned categories' default attribute to true for the tree form field
  if (product !== null) {
    if (product.categories.filter((item) => item !== null ).filter((item) => item !== undefined ).length > 0) {
      product.categories.forEach((state_product_category) => {
        // working with category field
        options.forEach((option_cat) => {
          if (option_cat._id === state_product_category._id) {
            option_cat.default = true
          }
        })
      }) 
    }
  }

  // finally, putting the built options in the field.options
  pulledFields.forEach((field) => {
    if (field.name === 'categories') {
      field.options = options
    }
  })

  return pulledFields
}


export const  validate = (values, props) => {
  if (!props.validation) {
    return
  }
  const errors = {}

  if(!values["name"]) {
    errors["name"] = "must provide a name"
  }

  if(!values["inventory_count"]) {
    errors["inventory_count"] = "must provide a inventory count"
  }

  if(!values["price"]) {
    errors["price"] = "must provide a inventory count"
  }

  // if no errors i.e. an empty object, then we know all the values are valid.
  return errors;
}

