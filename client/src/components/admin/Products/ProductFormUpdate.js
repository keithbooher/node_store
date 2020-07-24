import React, { Component } from 'react'
import { updateProduct, getAllCategories, getProductInfo } from '../../../utils/API'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes, faEdit, faEye, faEyeSlash, faArrowAltCircleLeft, faCheck } from "@fortawesome/free-solid-svg-icons"
import { injectCategoryDataIntoFormFields, validate } from "./formFields"
import Form from "../../shared/Form"
import { reset } from "redux-form"
import { validatePresenceOnAll } from "../../../utils/validations"
import { capitalizeFirsts } from "../../../utils/helperFunctions"
import FormModal from "../../shared/Form/FormModal"
import ReactFilestack from "filestack-react"

// TO DO
// if we are in the create form lets show a disabled input 
// for product path name that is filled out as the user types
// out the products desired name
// Maybe I can make a "mirror" form field that accomplishes this for name and pathname

class ProductForm extends Component {
  constructor(props) {
    super()
    this.handleSubmitUpdate = this.handleSubmitUpdate.bind(this)
    this.handleCategoryUpdate = this.handleCategoryUpdate.bind(this)
    this.finishUploading = this.finishUploading.bind(this)
    this.state = {
      categories: [],
      product: null,
      propertyToEdit: null
    }
  }

  async componentDidMount() {
    let categories = await getAllCategories()

    const split_paths = window.location.pathname.split( '/' )
    const product_path_name = split_paths[split_paths.length - 1]
    let { data } = await getProductInfo(product_path_name)

    if (!data.dimensions) {
      data.dimensions = {
        height: null,
        width: null,
        depth: null
      }
    }

    this.setState({ categories: categories.data, product: data })
  }


  async componentWillUnmount() {
    this.setState({ categories: null, product: null })
  }


  async handleSubmitUpdate() {
    const create_product_values = this.props.form['update_product_form'].values
    let update_product_info = this.state.product
    for (let [key, value] of Object.entries(create_product_values)) {
      if (key === "depth" || key === "width" || key === "height") {
        update_product_info.dimensions[key] = parseInt(value)
      } else {
        update_product_info[key] = value
      }
    }

    let { data } = await updateProduct(update_product_info)
    this.props.dispatch(reset("update_product_form"))
    this.setState({ editForm: null, propertyToEdit: null, product: data })
  }


  async handleCategoryUpdate() {
    const category_values = this.props.form['update_product_category_form'].values
    let update_product_info = this.state.product
    category_values.NaN.forEach((cat) => {
      update_product_info.categories.push(cat._id)
    })
    let { data } = await updateProduct(update_product_info)
    this.props.dispatch(reset("update_product_category_form"))
    this.setState({ product: data })
  }

  showEditIndicator(propertyToEdit) {
    this.setState({ propertyToEdit })
  }


  showEditModal(property) {
    let product = this.state.product
    const form_object = {
      product,
      onSubmit: this.handleSubmitUpdate,
      cancel: () => {
        this.props.dispatch(reset("update_product_form"))
        this.setState({ editForm: null, propertyToEdit: null })
      },
      submitButtonText: "Update Product Property",
      formFields: [
        { label: capitalizeFirsts(property), name: property, noValueError: `You must provide a value` },
      ],
      form: "update_product_form",
      validation: validatePresenceOnAll,
      initialValues: {
          [property]: product[property]
        }
    }
    this.setState({ editForm: form_object })
  }

  async finishUploading(fsData) {
    let product = this.state.product
    const src = fsData.filesUploaded[0].url
    product.image = src
    let { data } = await updateProduct(product)
    this.setState({ product: data })
  }

  async changeBoolean(property, boolean) {
    let product = this.state.product
    product[property] = boolean
    let { data } = await updateProduct(product)
    this.setState({ product: data })
  }


  render() {
    let fields = injectCategoryDataIntoFormFields(this.state.categories, this.state.product)
    return (
      <>
       {this.state.categories.length > 0 ?
          <>
            <Link to="/admin/products"><FontAwesomeIcon icon={faArrowAltCircleLeft} />Back to products</Link>

              <img style={{ height: "200px", width: "auto" }} src={this.state.product.image ? this.state.product.image : ""} />
              <ReactFilestack
                apikey={process.env.REACT_APP_FILESTACK_API}
                customRender={({ onPick }) => (
                  <div>
                    <button onClick={onPick}>Upload image</button>
                  </div>
                )}
                onSuccess={this.finishUploading}
              />
            <div className="relative">
              Name: <a className="inline" onClick={() => this.showEditIndicator("name")}>{this.state.product.name}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "name" && 
                  <FontAwesomeIcon 
                    icon={faEdit} 
                    onClick={() => this.showEditModal("name")} 
                  />
                }
            </div>
            <div className="relative">
              Path Name: {this.state.product.path_name}
            </div>
            <div className="relative">
              Description: <a className="inline" onClick={() => this.showEditIndicator("description")}>{this.state.product.description ? this.state.product.description : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "description" && 
                  <FontAwesomeIcon 
                    icon={faEdit} 
                    onClick={() => this.showEditModal("description")} 
                  />
                }
            </div>
            <div className="relative">
              Short Description: <a className="inline" onClick={() => this.showEditIndicator("short_description")}>{this.state.product.short_description ? this.state.product.short_description : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "short_description" && 
                  <FontAwesomeIcon 
                    icon={faEdit} 
                    onClick={() => this.showEditModal("short_description")} 
                  />
                }
            </div>
            <div className="relative">
              Inventory Count: <a className="inline" onClick={() => this.showEditIndicator("inventory_count")}>{this.state.product.inventory_count ? this.state.product.inventory_count : 0}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "inventory_count" && 
                  <FontAwesomeIcon 
                    icon={faEdit} 
                    onClick={() => this.showEditModal("inventory_count")} 
                  />
                }
            </div>
            <div className="relative">
              Price: <a className="inline" onClick={() => this.showEditIndicator("price")}>{this.state.product.price}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "price" && 
                  <FontAwesomeIcon 
                    icon={faEdit} 
                    onClick={() => this.showEditModal("price")} 
                  />
                }
            </div>
            <div className="relative">
              Height: <a className="inline" onClick={() => this.showEditIndicator("height")}>{this.state.product.dimensions.height ? this.state.product.dimensions.height : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "height" && 
                  <FontAwesomeIcon 
                    icon={faEdit} 
                    onClick={() => this.showEditModal("height")} 
                  />
                }
            </div>
            <div className="relative">
              Width: <a className="inline" onClick={() => this.showEditIndicator("width")}>{this.state.product.dimensions.width ? this.state.product.dimensions.width : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "width" && 
                  <FontAwesomeIcon 
                    icon={faEdit} 
                    onClick={() => this.showEditModal("width")} 
                  />
                }
            </div>
            <div className="relative">
              Depth: <a className="inline" onClick={() => this.showEditIndicator("depth")}>{this.state.product.dimensions.depth ? this.state.product.dimensions.depth : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "depth" && 
                  <FontAwesomeIcon 
                    icon={faEdit} 
                    onClick={() => this.showEditModal("depth")} 
                  />
                }
            </div>
            <div className="relative">
              Weight: <a className="inline" onClick={() => this.showEditIndicator("weight")}>{this.state.product.weight ? this.state.product.weight : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "weight" && 
                  <FontAwesomeIcon 
                    icon={faEdit} 
                    onClick={() => this.showEditModal("weight")} 
                  />
                }
            </div>
            <div>
              <Form 
                onSubmit={this.handleCategoryUpdate}
                submitButtonText={"Update Categories"}
                formFields={fields}
                form='update_product_category_form'
                initialValues={fields}
                validation={validate}
              />            
            </div>
            <div>
              Display: {this.state.product.display ? <FontAwesomeIcon onClick={() => this.changeBoolean("display", !this.state.product.display)} icon={faEye} /> : <FontAwesomeIcon onClick={() => this.changeBoolean("display", !this.state.product.display)} icon={faEyeSlash} /> }
            </div>
            <div>
              Home Page Promotion: {this.state.product.home_promotion ? <FontAwesomeIcon onClick={() => this.changeBoolean("home_promotion", !this.state.product.home_promotion)} icon={faEye} /> : <FontAwesomeIcon onClick={() => this.changeBoolean("home_promotion", !this.state.product.home_promotion)} icon={faEyeSlash} /> }
            </div>
            <div>
              Backorderable: {this.state.product.backorderable ? <FontAwesomeIcon onClick={() => this.changeBoolean("backorderable", !this.state.product.backorderable)} icon={faCheck} /> : <FontAwesomeIcon onClick={() => this.changeBoolean("backorderable", !this.state.product.backorderable)} icon={faTimes} /> }
            </div>

            {
              this.state.editForm && 
                <div>
                  <FormModal
                    onSubmit={this.state.editForm.onSubmit}
                    cancel={this.state.editForm.cancel}
                    submitButtonText={this.state.editForm.submitButtonText}
                    formFields={this.state.editForm.formFields}
                    form={this.state.editForm.form}
                    validation={this.state.editForm.validation}
                    title={"Updating Shipping Property"}
                    initialValues={this.state.editForm.initialValues}
                  />
                </div>
            }
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
