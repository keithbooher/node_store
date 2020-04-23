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
    let categories = await getAllCategories()

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
      dimensions: {}
    }
    for (let [key, value] of Object.entries(create_product_values)) {
      if (key === "depth" || key === "width" || key === "height") {
        new_product.dimensions[key] = value
      } else {
       new_product[key] = value
      }
    }
    new_product["path_name"] = hf.productNameToPathName(new_product.name)
    createProduct(new_product)
  }

  async handleSubmitUpdate(e) {
    e.preventDefault()
    const create_product_values = this.props.form['update_product_form'].values
    let new_product_info = {
      category: [],
      dimensions: {}
    }
    for (let [key, value] of Object.entries(create_product_values)) {
      if (key === "depth" || key === "width" || key === "height") {
        new_product_info.dimensions[key] = value
      } else if (key === "category") {
        value.forEach((category) => {
          new_product_info["category"].push(category._id)
        })
      } else {
       new_product_info[key] = value
      }
    }
    new_product_info["path_name"] = hf.productNameToPathName(new_product_info.name)
    
    new_product_info["_id"] = this.state.product._id
    console.log(new_product_info)
    updateProduct(new_product_info)
  }

  injectCategoryDataIntoFormFields() {
    let pulledFields = productFields
    console.log(pulledFields)
    pulledFields.forEach((field) => {
      if (field.name === 'category') {
        // we've cycled through the fields AND IF its the category field
        // we want to add to the options
        // specifically we want to add an array of the categories
        let options = []
        this.state.categories.forEach((category) => {
          options.push({ _id: category._id, name: category.name })
        })
        field.options = options
      }
    })
    // console.log(pulledFields)
    return pulledFields
  }

  injectDataIntoFormFields() {
    let fields = this.injectCategoryDataIntoFormFields()
    console.log(fields)

    let initialValues = {}
    fields = fields.forEach((field) => {
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
    return (
      <>
       {this.state.categories !== null ?
          <>
            <Link to="/admin/products"><FontAwesomeIcon icon={faTimesCircle} />Cancel</Link>
            <div>
              <Route exact path="/admin/products/add" component={this.createForm} />
              <Route path="/admin/products/update" component={this.updateForm} />
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
