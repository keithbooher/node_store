import React, { Component } from 'react'
import { createProduct, updateProduct, getAllCategories, getProductInfo } from '../../../utils/API'
import hf from '../../../utils/helperFunctions'
import { connect } from 'react-redux'
import { Route, Link, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons"
import { productFields } from "./formFields"
import Form from "../../shared/Form"
import loadingGif from '../../../images/pizzaLoading.gif'
import { create } from 'domain';

// TO DO
// if we are in the create form lets show a disabled input 
// for product path name that is filled out as the user types
// out the products desired name
// Maybe I can make a "mirror" form field that accomplishes this for name and pathname

class ProductForm extends Component {
  constructor(props) {
    super()
    this.createForm = this.createForm.bind(this)
    this.updateForm = this.updateForm.bind(this)
    this.state = {
      categories: null,
      product: null
    }
  }

  async componentDidMount() {
    console.log('???')
    let categories = await getAllCategories()
    console.log(categories.data)

    const split_paths = window.location.pathname.split( '/' )
    const path = split_paths[split_paths.length - 2]
    let product
    if (path === "update") {
      const product_path_name = split_paths[split_paths.length - 1]
      product = await getProductInfo(product_path_name)
    } else {
      product = {data: null}
    }

    this.setState({ categories: categories.data, product: product.data })
  }

  async handleSubmitCreate(e) {
    e.preventDefault()
    const create_product_values = this.props.form['create_product_form'].values
    let new_product = {
      categories: [],
      dimensions: {}
    }
    for (let [key, value] of Object.entries(create_product_values)) {
      if (key === "depth" || key === "width" || key === "height") {
        new_product.dimensions[key] = value
      } else if (key === "categories") {
        // just pushing category id's into the category array attribute in the product
        value.forEach((category) => {
          new_product["categories"].push(category._id)
        })
      }  else {
       new_product[key] = value
      }
    }
    new_product["path_name"] = hf.productNameToPathName(new_product.name)
    let create_product = await createProduct(new_product)
    if (create_product.status === 200) {
      this.props.history.push(`/admin/products/${create_product.data._id}`)
    } else {
      alert("OOps its fucked m8")
    }
  }

  async handleSubmitUpdate(e) {
    e.preventDefault()
    const create_product_values = this.props.form['update_product_form'].values
    console.log(create_product_values)
    let new_product_info = {
      categories: [],
      dimensions: {}
    }
    for (let [key, value] of Object.entries(create_product_values)) {
      if (key === "depth" || key === "width" || key === "height") {
        new_product_info.dimensions[key] = value
      } else if (key === "categories") {
        // just pushing category id's into the category array attribute in the product
        value.forEach((category) => {
          new_product_info["categories"].push(category._id)
        })
      } else {
       new_product_info[key] = value
      }
    }

    // TO DO
    // Actually lets not update the path name with the new name. 
    // Lets offer this as a specific redirect feature
    // new_product_info["path_name"] = hf.productNameToPathName(new_product_info.name)
    
    new_product_info["_id"] = this.state.product._id

    let updated_product = await updateProduct(new_product_info)
    if (updated_product.status === 200) {
      this.props.history.push(`/admin/products/${new_product_info._id}`)
    } else {
      alert("OOps its fucked m8")
    }
  }

  // FOR INJECTING ***CATEGORY*** DATA
  injectCategoryDataIntoFormFields() {
    let pulledFields = productFields
    // We cycle through the fields AND IF its the category field:
    // we'll want to add the array of categories to the options on the category field
    let options = []
    pulledFields.forEach((field) => {
      if (field.name === 'categories') {
        // fill out options indiscriminately 
        this.state.categories.forEach((category) => {
          options.push({ ...category, default: false })
        })
      }

      if (field.name === 'path_name' && this.state.product !== null) {
        field.display = true
      }
    })

    // if updating, lets set the product's assigned categories' default attribute to true for the tree form field
    if (this.state.product !== null) {
      this.state.product.categories.forEach((state_product_category) => {
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

  // FOR INJECTING EXISTING PRODUCT DATA INTO THE CREATE FORM
  injectDataIntoFormFields() {
    let fields = this.injectCategoryDataIntoFormFields()


    let initialValues = {}
    fields.forEach((field) => {
      switch (field.name) {
        case "depth":
          initialValues[field.name] = this.state.product.dimensions.depth
          break;
        case "width":
          initialValues[field.name] = this.state.product.dimensions.width          
          break;
        case "height":
          initialValues[field.name] = this.state.product.dimensions.height          
          break;
        default:
          initialValues[field.name] = this.state.product[field.name]
          break;
      }
    })



    return initialValues
  }

  createForm() {
    return(
      <Form 
        onSubmit={(e) => this.handleSubmitCreate(e)}
        submitButtonText={"Create Product"}
        formFields={this.injectCategoryDataIntoFormFields()}
        formId='create_product_form'
        form='create_product_form'
      />
    )
  }

  updateForm() {
    return(
      <Form 
        onSubmit={(e) => this.handleSubmitUpdate(e)}
        submitButtonText={"Update Product"}
        formFields={this.injectCategoryDataIntoFormFields()}
        formId='update_product_form'
        form='update_product_form'
        initialValues={this.injectDataIntoFormFields()}
      />
    )
  }

  render() {
    console.log(this.state)
    return (
      <>
       {this.state.categories !== null ?
          <>
            <Link to="/admin/products"><FontAwesomeIcon icon={faTimesCircle} />Cancel</Link>
            <div>
              <Route exact path="/admin/products/form/add" component={this.createForm} />
              <Route exact path="/admin/products/form/update/:path_name" component={this.updateForm} />
            </div>
          </>
        : ""}
      </>
    )
  }
}

function mapStateToProps({ form }) {
  return { form }
}

export default connect(mapStateToProps, null)(ProductForm)
