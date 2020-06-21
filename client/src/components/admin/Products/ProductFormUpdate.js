import React, { Component } from 'react'
import { updateProduct, getAllCategories, getProductInfo } from '../../../utils/API'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons"
import { injectCategoryDataIntoFormFields, validate } from "./formFields"
import Form from "../../shared/Form"
import { reset } from "redux-form"

// TO DO
// if we are in the create form lets show a disabled input 
// for product path name that is filled out as the user types
// out the products desired name
// Maybe I can make a "mirror" form field that accomplishes this for name and pathname

class ProductForm extends Component {
  constructor(props) {
    super()
    this.state = {
      categories: [],
      product: null
    }
  }

  async componentDidMount() {
    let categories = await getAllCategories()

    const split_paths = window.location.pathname.split( '/' )
    const product_path_name = split_paths[split_paths.length - 1]
    let product = await getProductInfo(product_path_name)

    this.setState({ categories: categories.data, product: product.data })
  }


  async componentWillUnmount() {
    this.setState({ categories: null, product: null })
  }


  async handleSubmitUpdate(e) {
    e.preventDefault()
    const create_product_values = this.props.form['update_product_form'].values
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
    // new_product_info["path_name"] = productNameToPathName(new_product_info.name)
    
    new_product_info["_id"] = this.state.product._id

    let updated_product = await updateProduct(new_product_info)
    this.props.dispatch(reset("update_product_form"))
    if (updated_product.status === 200) {
      this.props.history.push(`/admin/products/${new_product_info._id}`)
    } else {
      alert("OOps its fucked m8")
    }
  }

  // FOR INJECTING EXISTING PRODUCT DATA INTO THE CREATE FORM
  injectDataIntoFormFields(fields) {
    let initialValues = {}
    fields.forEach((field) => {
      switch (field.name) {
        case "depth":
          if (this.state.product.dimensions) {
            initialValues[field.name] = this.state.product.dimensions.depth
          }
          break;
        case "width":
          if (this.state.product.dimensions) {
            initialValues[field.name] = this.state.product.dimensions.width                    
          }
          break;
        case "height":
          if (this.state.product.dimensions) {
            initialValues[field.name] = this.state.product.dimensions.height          
          }
          break;
        default:
          initialValues[field.name] = this.state.product[field.name]
          break;
      }
    })



    return initialValues
  }

  render() {
    let fields = injectCategoryDataIntoFormFields(this.state.categories, this.state.product)
    return (
      <>
       {this.state.categories.length > 0 ?
          <>
            <Link to="/admin/products"><FontAwesomeIcon icon={faTimesCircle} />Cancel</Link>
            <div>
              <Form 
                onSubmit={(e) => this.handleSubmitUpdate(e)}
                submitButtonText={"Update Product"}
                formFields={fields}
                form='update_product_form'
                initialValues={this.injectDataIntoFormFields(fields)}
                validation={validate}
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

export default connect(mapStateToProps, null)(ProductForm)
