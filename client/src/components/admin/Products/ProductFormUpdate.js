import React, { Component } from 'react'
import { updateProduct, getAllCategories, getProductByPathName } from '../../../utils/API'
import { dispatchObj } from '../../../actions'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes, faEdit, faEye, faEyeSlash, faArrowAltCircleLeft, faCheck, faArrowAltCircleRight } from "@fortawesome/free-solid-svg-icons"
import { injectCategoryDataIntoFormFields, validate } from "./formFields"
import Form from "../../shared/Form"
import { reset } from "redux-form"
import { validatePresenceOnAll } from "../../../utils/validations"
import { capitalizeFirsts } from "../../../utils/helpFunctions"
import FormModal from "../../shared/Form/FormModal"
import ReactFilestack from "filestack-react"
import Key from "../../shared/Key"

// TO DO
// need to make a reusable component for the attributes

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
    let categories = await this.props.getAllCategories()

    const split_paths = window.location.pathname.split( '/' )
    const product_path_name = split_paths[split_paths.length - 1]
    let { data } = await this.props.getProductByPathName(product_path_name)

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

    let { data } = await this.props.updateProduct(update_product_info)
    this.props.dispatchObj(reset("update_product_form"))
    this.setState({ editForm: null, propertyToEdit: null, product: data })
  }


  async handleCategoryUpdate() {
    const category_values = this.props.form['update_product_category_form'].values
    let update_product_info = this.state.product
    update_product_info.categories = category_values.NaN.map((cat) => cat._id)

    let { data } = await this.props.updateProduct(update_product_info)
    this.props.dispatchObj(reset("update_product_category_form"))
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
        this.props.dispatchObj(reset("update_product_form"))
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
    let { data } = await this.props.updateProduct(product)
    this.setState({ product: data })
  }

  async changeBoolean(property, boolean) {
    let product = this.state.product
    product[property] = boolean
    let { data } = await this.props.updateProduct(product)
    this.setState({ product: data })
  }


  render() {
    let fields = injectCategoryDataIntoFormFields(this.state.categories, this.state.product)
    return (
      <>
       {this.state.categories.length > 0 ?
          <>
            <div className="flex">
              <Link to="/admin/products" className="w-50 text-align-center theme-background-2 padding-s" style={{ borderRight: "solid 1px lightgrey", borderRadius: "4px 0px 0px 4px" }}>
                <FontAwesomeIcon style={{ fontSize: "30px", marginTop: "5px" }} icon={faArrowAltCircleLeft} />
                <h3 className="margin-xs-v">Back to products</h3>
              </Link>
              <Link to={`/admin/product/related_products/${this.state.product._id}`} className="w-50 text-align-center theme-background-2 padding-s" style={{ borderRadius: "0px 4px 4px 0px" }}>
                <FontAwesomeIcon style={{ fontSize: "30px", marginTop: "5px" }} icon={faArrowAltCircleRight} /> 
                <h3 className="margin-xs-v">Related Products</h3>
                </Link>
            </div>
              <div className="margin-auto-h flex justify-center align-items-center background-color-black" style={{ maxHeight: "300px", maxWidth: "300px", minHeight: "300px", minWidth: "300px", marginTop: "10px" }}>
                <img style={{ height: "300px", width: "auto", maxHeight: "300px", maxWidth: "300px" }} src={this.state.product.image ? this.state.product.image : ""} />
              </div>
              <ReactFilestack
                apikey={process.env.REACT_APP_FILESTACK_API}
                customRender={({ onPick }) => (
                  <div>
                    <button onClick={onPick}>Upload image</button>
                  </div>
                )}
                onSuccess={this.finishUploading}
              />
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Name:</span> <a className="inline" onClick={() => this.showEditIndicator("name")}>{this.state.product.name}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "name" && 
                  <FontAwesomeIcon 
                    className="margin-s-h"
                    icon={faEdit} 
                    onClick={() => this.showEditModal("name")} 
                  />
                }
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Path Name:</span> {this.state.product.path_name}
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Sku:</span> <a className="inline" onClick={() => this.showEditIndicator("sku")}>{this.state.product.sku ? this.state.product.sku : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "sku" && 
                  <FontAwesomeIcon 
                    className="margin-s-h"
                    icon={faEdit} 
                    onClick={() => this.showEditModal("sku")} 
                  />
                }
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Description:</span> <a className="inline" onClick={() => this.showEditIndicator("description")}>{this.state.product.description ? this.state.product.description : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "description" && 
                  <FontAwesomeIcon 
                    className="margin-s-h"
                    icon={faEdit} 
                    onClick={() => this.showEditModal("description")} 
                  />
                }
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Short Description:</span> <a className="inline" onClick={() => this.showEditIndicator("short_description")}>{this.state.product.short_description ? this.state.product.short_description : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "short_description" && 
                  <FontAwesomeIcon 
                    className="margin-s-h"
                    icon={faEdit} 
                    onClick={() => this.showEditModal("short_description")} 
                  />
                }
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Meta Title:</span> <a className="inline" onClick={() => this.showEditIndicator("meta_title")}>{this.state.product.meta_title ? this.state.product.meta_title : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "meta_title" && 
                  <FontAwesomeIcon 
                    className="margin-s-h"
                    icon={faEdit} 
                    onClick={() => this.showEditModal("meta_title")} 
                  />
                }
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Meta Description:</span> <a className="inline" onClick={() => this.showEditIndicator("meta_description")}>{this.state.product.meta_description ? this.state.product.meta_description : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "meta_description" && 
                  <FontAwesomeIcon 
                    className="margin-s-h"
                    icon={faEdit} 
                    onClick={() => this.showEditModal("meta_description")} 
                  />
                }
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Meta Keywords:</span> <a className="inline" onClick={() => this.showEditIndicator("meta_keywords")}>{this.state.product.meta_keywords ? this.state.product.meta_keywords : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "meta_keywords" && 
                  <FontAwesomeIcon 
                    className="margin-s-h"
                    icon={faEdit} 
                    onClick={() => this.showEditModal("meta_keywords")} 
                  />
                }
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Inventory Count:</span> <a className="inline" onClick={() => this.showEditIndicator("inventory_count")}>{this.state.product.inventory_count ? this.state.product.inventory_count : 0}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "inventory_count" && 
                  <FontAwesomeIcon 
                    className="margin-s-h"
                    icon={faEdit} 
                    onClick={() => this.showEditModal("inventory_count")} 
                  />
                }
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Price:</span> <a className="inline" onClick={() => this.showEditIndicator("price")}>{this.state.product.price}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "price" && 
                  <FontAwesomeIcon 
                    className="margin-s-h"
                    icon={faEdit} 
                    onClick={() => this.showEditModal("price")} 
                  />
                }
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Height:</span> <a className="inline" onClick={() => this.showEditIndicator("height")}>{this.state.product.dimensions.height ? this.state.product.dimensions.height : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "height" && 
                  <FontAwesomeIcon 
                    className="margin-s-h"
                    icon={faEdit} 
                    onClick={() => this.showEditModal("height")} 
                  />
                }
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Width:</span> <a className="inline" onClick={() => this.showEditIndicator("width")}>{this.state.product.dimensions.width ? this.state.product.dimensions.width : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "width" && 
                  <FontAwesomeIcon 
                    className="margin-s-h"
                    icon={faEdit} 
                    onClick={() => this.showEditModal("width")} 
                  />
                }
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Depth:</span> <a className="inline" onClick={() => this.showEditIndicator("depth")}>{this.state.product.dimensions.depth ? this.state.product.dimensions.depth : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "depth" && 
                  <FontAwesomeIcon 
                    className="margin-s-h"
                    icon={faEdit} 
                    onClick={() => this.showEditModal("depth")} 
                  />
                }
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Weight:</span> <a className="inline" onClick={() => this.showEditIndicator("weight")}>{this.state.product.weight ? this.state.product.weight : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "weight" && 
                  <FontAwesomeIcon 
                    className="margin-s-h"
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
            <div className="margin-s-v">
              <button className="w-100">Display {this.state.product.display ? <FontAwesomeIcon onClick={() => this.changeBoolean("display", !this.state.product.display)} icon={faEye} /> : <FontAwesomeIcon onClick={() => this.changeBoolean("display", !this.state.product.display)} icon={faEyeSlash} /> }</button>
            </div>
            <div className="margin-s-v">
              <button className="w-100">Home Page Promotion {this.state.product.home_promotion ? <FontAwesomeIcon onClick={() => this.changeBoolean("home_promotion", !this.state.product.home_promotion)} icon={faEye} /> : <FontAwesomeIcon onClick={() => this.changeBoolean("home_promotion", !this.state.product.home_promotion)} icon={faEyeSlash} /> }</button>
            </div>
            <div className="margin-s-v">
              <button className="w-100">Backorderable {this.state.product.backorderable ? <FontAwesomeIcon onClick={() => this.changeBoolean("backorderable", !this.state.product.backorderable)} icon={faCheck} /> : <FontAwesomeIcon onClick={() => this.changeBoolean("backorderable", !this.state.product.backorderable)} icon={faTimes} /> }</button>
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

const actions = { getAllCategories, dispatchObj, getProductByPathName, updateProduct }

export default connect(mapStateToProps, actions)(ProductForm)
