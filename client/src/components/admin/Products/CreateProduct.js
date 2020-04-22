import React, { Component } from 'react'
import { createProduct, getAllCategories } from '../../../utils/API'
import hf from '../../../utils/helperFunctions'
import { connect } from 'react-redux'
import {Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons"
import { productFields } from "./formFields"
import Form from "../../shared/Form"
import { create } from 'domain';
class CreateProduct extends Component {
  constructor(props) {
    super()
    this.state = {
      categories: null
    }
  }

  async componentDidMount() {
    let categories = await getAllCategories()
    console.log(categories)
    this.setState({ categories: categories.data })
  }

  async handleSubmit(e) {
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

  injectDataIntoFormFields() {
    let pulledFields = productFields
    console.log(productFields)
    pulledFields.forEach((field) => {
      if (field.name === 'category') {
        // we've cycled through the fields AND IF its the category field
        // we want to add to the options
        // specifically we want to add an array of the categories
        let options = []
        this.state.categories.forEach((category) => {
          options.push({ _id: category._id, name: category.name, path_name: category.path_name })
        })
        field.options = options
      }
    })
    return pulledFields
  }

  render() {
    return (
      <>
       {this.state.categories !== null ?
          <>
            <Link to="/admin/products"><FontAwesomeIcon icon={faTimesCircle} />Cancel</Link>
            <div>
              <Form 
                onSubmit={(e) => this.handleSubmit(e)}
                submitButtonText={"Create Product"}
                formFields={this.injectDataIntoFormFields()}
                formId='create_product_form'
                form='create_product_form'
              />
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

export default connect(mapStateToProps, null)(CreateProduct)
