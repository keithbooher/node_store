import React, { Component } from 'react'
import { createProduct, getAllCategories, getProductInfo } from '../../../utils/API'
import { productNameToPathName } from '../../../utils/helperFunctions'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons"
import { injectCategoryDataIntoFormFields, validate } from "./formFields"
import Form from "../../shared/Form"
import { reset } from "redux-form"
import { create } from 'domain';


// TO DO
// if we are in the create form lets show a disabled input 
// for product path name that is filled out as the user types
// out the products desired name
// Maybe I can make a "mirror" form field that accomplishes this for name and pathname

class ProductForm extends Component {
  constructor(props) {
    super()
    this.state = {
      categories: null
    }
  }

  async componentDidMount() {
    let { data } = await getAllCategories()

    this.setState({ categories: data })
  }

  async componentWillUnmount() {
    this.setState({ categories: null })
  }

  async handleSubmitCreate() {
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
    new_product["path_name"] = productNameToPathName(new_product.name)
    let create_product = await createProduct(new_product)
    this.props.dispatch(reset("create_product_form"))
    if (create_product.status === 200) {
      this.props.history.push(`/admin/products/${create_product.data._id}`)
    } else {
      alert("OOps its fucked m8")
    }
  }

  render() {
    return (
      <>
       {this.state.categories !== null ?
          <>
            <Link to="/admin/products"><FontAwesomeIcon icon={faTimesCircle} />Cancel</Link>
            <div>
              <Form 
                onSubmit={(e) => this.handleSubmitCreate(e)}
                submitButtonText={"Create Product"}
                formFields={injectCategoryDataIntoFormFields(this.state.categories, null, "create")}
                form='create_product_form'
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
