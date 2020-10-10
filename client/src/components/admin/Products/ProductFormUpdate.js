import React, { Component } from 'react'
import { updateProduct, getAllCategories, getProductByPathName } from '../../../utils/API'
import { dispatchObj } from '../../../actions'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes, faEdit, faEye, faEyeSlash, faArrowAltCircleLeft, faCheck, faArrowAltCircleRight, faTrash } from "@fortawesome/free-solid-svg-icons"
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
      propertyToEdit: null,
      edit_image: null
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
    update_product_info.categories = await category_values.NaN.map((cat) => cat._id)

    // case for cat removal (keeping cat display numbers up to date)
    await Object.keys(update_product_info.category_display_order).forEach(key => {
      // if the display-cat-key is not within the cat array, 
      // then we remove the key value pair from the 
      // category_display_order object
      if (update_product_info.categories.indexOf(key) < 0) {
        delete update_product_info.category_display_order[key]
      }
    })

    // case for cat addition (keeping cat display numbers up to date)
    await update_product_info.categories.forEach(cat => {
      // if cat ID is not within the category_display_order object 
      // keys then we need to assign it a display order value
      if (Object.keys(update_product_info.category_display_order).indexOf(cat) < 0) {
        update_product_info.category_display_order[cat] = 0
      }
    })

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
    product.images[this.state.edit_image] = src
    let { data } = await this.props.updateProduct(product)
    this.setState({ product: data })
  }

  async changeBoolean(property, boolean) {
    let product = this.state.product
    product[property] = boolean
    let { data } = await this.props.updateProduct(product)
    this.setState({ product: data })
  }

  async removeImage(image_key) {
    let product = this.state.product
    product.images[image_key] = null
    let { data } = await this.props.updateProduct(product)
    this.setState({ product: data })
  }


  render() {
    console.log(this.state.product)
    let fields = injectCategoryDataIntoFormFields(this.state.categories, this.state.product)
    let fontSize = "1em"
    if (!this.props.mobile) {
      fontSize = "20px"
    }
    return (
      <div style={{ fontSize }}>
       {this.state.categories.length > 0 ?
          <>
            <div className="flex">
              <Link to="/admin/products" className="w-50 text-align-center theme-background-3 padding-s hover-color-5" style={{ borderRight: "solid 1px lightgrey", borderRadius: "4px 0px 0px 4px" }}>
                <FontAwesomeIcon style={{ fontSize: "30px", marginTop: "5px" }} icon={faArrowAltCircleLeft} />
                <h3 className="margin-xs-v">Back to products</h3>
              </Link>
              <Link to={`/admin/product/related_products/${this.state.product._id}`} className="w-50 text-align-center theme-background-3 padding-s hover-color-5" style={{ borderRadius: "0px 4px 4px 0px" }}>
                <FontAwesomeIcon style={{ fontSize: "30px", marginTop: "5px" }} icon={faArrowAltCircleRight} /> 
                <h3 className="margin-xs-v">Related Products</h3>
                </Link>
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "22px" }}>
              <span>Name:</span> <a className="inline" onClick={() => this.showEditIndicator("name")}>{this.state.product.name}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "name" && 
                  <FontAwesomeIcon 
                    className="margin-s-h hover hover-color-2"
                    icon={faEdit} 
                    onClick={() => this.showEditModal("name")} 
                  />
                }
            </div>
            <h2 className="margin-xs-v">Images</h2>
            {this.props.mobile ?
              <>               
                <div onClick={() => this.setState({ edit_image: "i1" })} className={`margin-auto-h flex justify-center align-items-center background-color-black ${this.state.edit_image === "i1" && "st-selection-border"}`} style={{ maxHeight: "300px", maxWidth: "300px", minHeight: "300px", minWidth: "300px", marginTop: "10px" }}>
                  {!this.state.product.images.i1 && <FontAwesomeIcon style={this.props.mobile ? { fontSize: "30px" } : { fontSize: "35px" }} className="hover hover-color-12" icon={faEdit} />}
                  <img style={{ height: "300px", width: "auto", maxHeight: "300px", maxWidth: "300px" }} src={this.state.product.images.i1} />
                </div>
                <div className="flex flex-wrap justify-center">
                  {Object.keys(this.state.product.images).map((image_key, index) => {
                    if (image_key === "i1") {
                      return
                    } else {
                      return (
                        <div onClick={() => this.setState({ edit_image: image_key })}  key={index} className={`flex justify-center align-items-center background-color-black ${this.state.edit_image === image_key && "st-selection-border"}`} style={{ maxHeight: "150px", width: "40%", minHeight: "100px", margin: "10px 2px 0px 2px", flexBasis: "40%" }}>
                          {!this.state.product.images[image_key] && <FontAwesomeIcon style={this.props.mobile ? { fontSize: "20px" } : { fontSize: "25px" }} className="hover hover-color-12" icon={faEdit} />}
                          <img style={{ height: "auto", width: "auto", maxHeight: "150px", maxWidth: "100%" }} src={this.state.product.images[image_key]} />
                        </div>
                      )
                    }
                  })}
                </div>
              </>
            : 
              <>
                <div onClick={() => this.setState({ edit_image: "i1" })} className={`relative flex justify-center align-items-center background-color-black ${this.state.edit_image === "i1" && "st-selection-border"}`} style={{ maxHeight: "500px", maxWidth: "500px", minHeight: "500px", minWidth: "500px", marginTop: "10px" }}>
                  <FontAwesomeIcon onClick={() => this.removeImage("i1")} icon={faTrash} className="absolute hover hover-color-12 " style={{ top: "5px", right: "5px" }} />
                  {!this.state.product.images.i1 && <FontAwesomeIcon style={this.props.mobile ? { fontSize: "30px" } : { fontSize: "35px" }} className="hover hover-color-12" icon={faEdit} />}
                  <img style={{ height: "500px", width: "auto", maxHeight: "500px", maxWidth: "500px" }} src={this.state.product.images.i1} />
                </div>
                <div className="flex flex-wrap">
                  {Object.keys(this.state.product.images).map((image_key, index) => {
                    if (image_key === "i1") {
                      return
                    } else {
                      return (
                        <div onClick={() => this.setState({ edit_image: image_key })}  key={index} className={`relative flex justify-center align-items-center background-color-black ${this.state.edit_image === image_key && "st-selection-border"}`} style={{ maxHeight: "300px", width: "23%", minHeight: "100px", margin: "10px 2px 0px 2px", flexBasis: "23%" }}>
                          <FontAwesomeIcon onClick={() => this.removeImage(image_key)} icon={faTrash} className="absolute hover hover-color-12 " style={{ top: "5px", right: "5px" }} />
                          {!this.state.product.images[image_key] && <FontAwesomeIcon style={this.props.mobile ? { fontSize: "20px" } : { fontSize: "25px" }} className="hover hover-color-12" icon={faEdit} />}
                          <img style={{ height: "auto", width: "auto", maxHeight: "300px", maxWidth: "100%" }} src={this.state.product.images[image_key]} />
                        </div>
                      )
                    }
                  })}
                </div>
              </>
            }
              
            {this.state.edit_image &&
              <div className={`${this.props.mobile && "text-align-center"} margin-s-v`}>
                <ReactFilestack
                  apikey={process.env.REACT_APP_FILESTACK_API}
                  customRender={({ onPick }) => (
                    <div>
                      <button onClick={onPick}>Upload image</button>
                    </div>
                  )}
                  onSuccess={this.finishUploading}
                />
              </div>

            }

            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Path Name:</span> {this.state.product.path_name}
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Sku:</span> <a className="inline" onClick={() => this.showEditIndicator("sku")}>{this.state.product.sku ? this.state.product.sku : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "sku" && 
                  <FontAwesomeIcon 
                    className="margin-s-h hover hover-color-2"
                    icon={faEdit} 
                    onClick={() => this.showEditModal("sku")} 
                  />
                }
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Description:</span> <a className="inline" onClick={() => this.showEditIndicator("description")}>{this.state.product.description ? this.state.product.description : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "description" && 
                  <FontAwesomeIcon 
                    className="margin-s-h hover hover-color-2"
                    icon={faEdit} 
                    onClick={() => this.showEditModal("description")} 
                  />
                }
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Short Description:</span> <a className="inline" onClick={() => this.showEditIndicator("short_description")}>{this.state.product.short_description ? this.state.product.short_description : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "short_description" && 
                  <FontAwesomeIcon 
                    className="margin-s-h hover hover-color-2"
                    icon={faEdit} 
                    onClick={() => this.showEditModal("short_description")} 
                  />
                }
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Meta Title:</span> <a className="inline" onClick={() => this.showEditIndicator("meta_title")}>{this.state.product.meta_title ? this.state.product.meta_title : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "meta_title" && 
                  <FontAwesomeIcon 
                    className="margin-s-h hover hover-color-2"
                    icon={faEdit} 
                    onClick={() => this.showEditModal("meta_title")} 
                  />
                }
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Meta Description:</span> <a className="inline" onClick={() => this.showEditIndicator("meta_description")}>{this.state.product.meta_description ? this.state.product.meta_description : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "meta_description" && 
                  <FontAwesomeIcon 
                    className="margin-s-h hover hover-color-2"
                    icon={faEdit} 
                    onClick={() => this.showEditModal("meta_description")} 
                  />
                }
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Meta Keywords:</span> <a className="inline" onClick={() => this.showEditIndicator("meta_keywords")}>{this.state.product.meta_keywords ? this.state.product.meta_keywords : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "meta_keywords" && 
                  <FontAwesomeIcon 
                    className="margin-s-h hover hover-color-2"
                    icon={faEdit} 
                    onClick={() => this.showEditModal("meta_keywords")} 
                  />
                }
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Inventory Count:</span> <a className="inline" onClick={() => this.showEditIndicator("inventory_count")}>{this.state.product.inventory_count ? this.state.product.inventory_count : 0}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "inventory_count" && 
                  <FontAwesomeIcon 
                    className="margin-s-h hover hover-color-2"
                    icon={faEdit} 
                    onClick={() => this.showEditModal("inventory_count")} 
                  />
                }
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Price:</span> <a className="inline" onClick={() => this.showEditIndicator("price")}>{this.state.product.price}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "price" && 
                  <FontAwesomeIcon 
                    className="margin-s-h hover hover-color-2"
                    icon={faEdit} 
                    onClick={() => this.showEditModal("price")} 
                  />
                }
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Height:</span> <a className="inline" onClick={() => this.showEditIndicator("height")}>{this.state.product.dimensions.height ? this.state.product.dimensions.height : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "height" && 
                  <FontAwesomeIcon 
                    className="margin-s-h hover hover-color-2"
                    icon={faEdit} 
                    onClick={() => this.showEditModal("height")} 
                  />
                }
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Width:</span> <a className="inline" onClick={() => this.showEditIndicator("width")}>{this.state.product.dimensions.width ? this.state.product.dimensions.width : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "width" && 
                  <FontAwesomeIcon 
                    className="margin-s-h hover hover-color-2"
                    icon={faEdit} 
                    onClick={() => this.showEditModal("width")} 
                  />
                }
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Depth:</span> <a className="inline" onClick={() => this.showEditIndicator("depth")}>{this.state.product.dimensions.depth ? this.state.product.dimensions.depth : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "depth" && 
                  <FontAwesomeIcon 
                    className="margin-s-h hover hover-color-2"
                    icon={faEdit} 
                    onClick={() => this.showEditModal("depth")} 
                  />
                }
            </div>
            <div className="relative margin-s-v theme-background-3 color-white padding-s border-radius-s" style={{ fontSize: "18px" }}>
              <span>Weight:</span> <a className="inline" onClick={() => this.showEditIndicator("weight")}>{this.state.product.weight ? this.state.product.weight : "N/A"}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "weight" && 
                  <FontAwesomeIcon 
                    className="margin-s-h hover hover-color-2"
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
              <button onClick={() => this.changeBoolean("display", !this.state.product.display)} style={this.props.mobile ? { width: "100%" } : { width: "200px"}}>Display {this.state.product.display ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} /> }</button>
            </div>
            <div className="margin-s-v">
              <button onClick={() => this.changeBoolean("home_promotion", !this.state.product.home_promotion)} style={this.props.mobile ? { width: "100%" } : { width: "200px"}} className="w-100">Home Page Promotion {this.state.product.home_promotion ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} /> }</button>
            </div>
            <div className="margin-s-v">
              <button onClick={() => this.changeBoolean("backorderable", !this.state.product.backorderable)}  style={this.props.mobile ? { width: "100%" } : { width: "200px"}} className="w-100">Backorderable {this.state.product.backorderable ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} /> }</button>
            </div>
            <div className="margin-s-v">
              <button onClick={() => this.changeBoolean("availability", !this.state.product.availability)}  style={this.props.mobile ? { width: "100%" } : { width: "200px"}} className="w-100">Availability {this.state.product.availability ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} /> }</button>
            </div>
            <div className="margin-s-v">
              <button onClick={() => this.changeBoolean("gift_note", !this.state.product.gift_note)} style={this.props.mobile ? { width: "100%" } : { width: "200px"}} className="w-100">Gift Note {this.state.product.gift_note ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} /> }</button>
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
      </div>
    )
  }
}

function mapStateToProps({ form, mobile }) {
  return { form, mobile }
}

const actions = { getAllCategories, dispatchObj, getProductByPathName, updateProduct }

export default connect(mapStateToProps, actions)(ProductForm)
