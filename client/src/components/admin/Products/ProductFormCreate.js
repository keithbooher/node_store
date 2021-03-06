import React, { Component } from 'react'
import { createProduct, getAllCategories } from '../../../utils/API'
import { productNameToPathName } from '../../../utils/helpFunctions'
import { dispatchObj } from '../../../actions'
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
      categories: null
    }
  }

  async componentDidMount() {
    let { data } = await this.props.getAllCategories()

    this.setState({ categories: data })
  }

  async componentWillUnmount() {
    this.setState({ categories: null })
  }

  async handleSubmitCreate() {
    const create_product_values = this.props.form['create_product_form'].values

    let new_product = {
      categories: [],
      dimensions: {},
      images : {
        i1: null,
        i2: null,
        i3: null,
        i4: null,
        i5: null
      }
    }
    for (let [key, value] of Object.entries(create_product_values)) {
      if (key === "depth" || key === "width" || key === "height") {
        new_product.dimensions[key] = value
      } else if (key === "categories") {
        // just pushing category id's into the category array attribute in the product
        value.forEach((category) => {
          new_product["categories"].push(category._id)
        })
      } else if(key === "images") {
        new_product.images.i1 = value
      } else {
       new_product[key] = value
      }
      
    }
    new_product["path_name"] = productNameToPathName(new_product.name)
    let create_product = await this.props.createProduct(new_product)
    this.props.dispatchObj(reset("create_product_form"))
    if (create_product.status === 200) {
      this.props.history.push(`/admin/products/${create_product.data._id}`)
    } else {
      alert("OOps its fucked m8")
    }
  }

  render() {
    let fontSize = "1em"
    if (!this.props.mobile) {
      fontSize = "18px"
    }
    return (
      <div style={{ fontSize }}>
       {this.state.categories !== null ?
          <>
            <Link to="/admin/products"><FontAwesomeIcon icon={faTimesCircle} />Cancel</Link>
            <div>
              <Form 
                onSubmit={(e) => this.handleSubmitCreate(e)}
                submitButton={<button style={this.props.mobile ? { marginTop: "10px", width: "100%" } : { marginTop: "20px", width: "200px", fontSize: "25px" }}>Create Product</button>}
                formFields={injectCategoryDataIntoFormFields(this.state.categories, null, "create")}
                form='create_product_form'
                validation={validate}
              />
            </div>
          </>
        : ""}
      </div>
    )
  }
}

function mapStateToProps({ form, mobile }) {
  return { form, mobile }
}

const actions = { getAllCategories, dispatchObj, createProduct }

export default connect(mapStateToProps, actions)(ProductForm)
