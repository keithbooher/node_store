import _ from 'lodash'

export const productFields = [
  { label: 'Name', name: 'name', noValueError: 'You must provide an address' },
  { label: 'Path Name', name: 'path_name', display: false, typeOfComponent: 'field-disable', noValueError: 'You must provide an address' },
  { label: 'Description', name: 'description', noValueError: 'You must provide an address' },
  { label: 'Inventory Count', name: 'inventory_count', noValueError: 'You must provide an address' },
  { label: 'Price', name: 'price', noValueError: 'You must provide an address' },
  { label: 'Height', name: 'height', noValueError: 'You must provide an address' },
  { label: 'Width', name: 'width', noValueError: 'You must provide an address' },
  { label: 'Depth', name: 'depth', noValueError: 'You must provide an address' },
  { label: 'Categories', name: 'categories', typeOfComponent: 'tree', options: {}, noValueError: 'You must provide an address' },
  { label: 'Display To Customer', name: 'display', typeOfComponent: 'check-box', noValueError: 'You must provide an address' },
]

export const productSearchField = [
  { label: 'Search For Product By Name', name: 'search_bar', noValueError: 'You must provide an address' },
]
// FOR INJECTING ***CATEGORY*** DATA

export const injectCategoryDataIntoFormFields = (categories, product) => {
  let pulledFields = productFields
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
    product.categories.forEach((state_product_category) => {
      // working with category field
      options.forEach((option_cat) => {
        if (option_cat._id === state_product_category._id) {
          option_cat.default = true
        }
      })
    }) 
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

  _.each(props.formFields, ({ name, noValueError }) => {
    if(!values["name"]) {
      errors["name"] = noValueError
    }
  })

  // if no errors i.e. an empty object, then we know all the values are valid.
  return errors;
}

