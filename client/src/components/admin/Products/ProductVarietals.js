import React, { Component } from 'react'
import { connect } from 'react-redux'
import VarietalOptions from "./VarietalOptions"
import CreateVarietal from "./CreateVarietal"
import Modal from "../../shared/Modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle, faSpinner, faArrowLeft, faEdit } from "@fortawesome/free-solid-svg-icons"
import { getProductbyId, updateVarietal, updateProduct, getAllVarietalOptions } from '../../../utils/API'
import { Link } from 'react-router-dom'
import ReactFilestack from "filestack-react"
import { reset } from "redux-form"
import { dispatchObj } from '../../../actions'
import FormModal from "../../shared/Form/FormModal"
import Form from "../../shared/Form/Form"
import { capitalizeFirsts } from "../../../utils/helpFunctions"
import { validatePresenceOnAll } from "../../../utils/validations"
import varietalSort from "./varietalSort"
import colorDropDownItem from "./colorDropDownItem"

class ProductVarietals extends Component {
  constructor(props) {
    super()
    this.routeParamID = props.match.params.product_id

    this.finishUploading = this.finishUploading.bind(this)
    this.updateVarietal = this.updateVarietal.bind(this)
    this.changeVarietalColor = this.changeVarietalColor.bind(this)
    this.changeVarietalSize = this.changeVarietalSize.bind(this)

    this.state = {
      product: null,
      showVarietalModal: false,
      showCreateModal: false,
      edit_image: null,
      editForm: null,
      propertyToEdit: null,
      colorModal: false,
      sizeModal: false,
      options: []
    }
  }

  async componentDidMount() {
    let { data } = await this.props.getProductbyId(this.routeParamID)
    const options = await this.props.getAllVarietalOptions(this.routeParamID)

    const organize_varietals = varietalSort(options.data)
    let colors = organize_varietals.colors
    let sizes = organize_varietals.sizes

    this.setState({ product: data, options: options.data, color_options: colors, size_options: sizes })
  }

  async finishUploading(fsData) {
    let product = this.state.product
    let varietal
    product.varietals.map(v => {
      if (v._id === this.state.edit_image.varietal_id) {
        const src = fsData.filesUploaded[0].url
        v.images[this.state.edit_image.image_key] = src
        varietal = v
      }
      return v
    })

    await this.props.updateVarietal(varietal)
    let { data } = await this.props.updateProduct(product)
    this.setState({ product: data })
  }

  showEditIndicator(propertyToEdit) {
    this.setState({ propertyToEdit })
  }


  showEditModal(property) {
    let varietal = this.state.propertyToEdit.v

    let form_object = {
        varietal,
        onSubmit: this.updateVarietal,
        cancel: () => {
          this.props.dispatchObj(reset("update_varietal_form"))
          this.setState({ editForm: null, propertyToEdit: null })
        },
        submitButtonText: "Update Product Property",
        formFields: [
          { label: capitalizeFirsts(property), name: property, typeOfComponent: "number", noValueError: `You must provide a value` },
        ],
        form: "update_varietal_form",
        validation: validatePresenceOnAll,
        initialValues: {
            [property]: varietal[property]
          }
      }

    console.log(form_object)
    this.setState({ editForm: form_object })
  }

  showColorEditModal() {
    // show modal containing the varietal color options in a drop down to choose as replacements
  }

  showSizeEditModal() {
    // show modal containing the varietal size options in a drop down to choose as replacements
  }

  // basically just fo updating inventory right now... thats why im using parseInt
  async updateVarietal() {
    let values = this.props.form.update_varietal_form.values
    let product = this.state.product
    product.varietals = product.varietals.map(v => {
      if (v._id === this.state.propertyToEdit.v._id) {
        v[this.state.propertyToEdit.att] = parseInt(values[this.state.propertyToEdit.att])
      }
      return v
    })

    let { data } = await this.props.updateProduct(product)
    this.setState({ product: data, editForm: null })
  }

  async changeVarietalColor() {
    let value = this.props.form.color_update_form.values.color_option.value
    let varietal = this.state.colorModal.v
    let product = this.state.product

    product.varietals = product.varietals.map(v => {
      if (v._id === varietal._id) {
        v.color = value
      }
      return v
    })

    let { data } = await this.props.updateProduct(product)
    this.setState({ product: data, colorModal: false })
  }

  async changeVarietalSize() {
    let value = this.props.form.size_update_form.values.size_option.value
    let varietal = this.state.sizeModal.v
    let product = this.state.product

    product.varietals = product.varietals.map(v => {
      if (v._id === varietal._id) {
        v.size = value
      }
      return v
    })

    let { data } = await this.props.updateProduct(product)
    this.setState({ product: data, sizeModal: false })
  }

  render() {

    return (
      <div style={{ height: "100vh" }}>
        {this.state.product ? 
          <div>
            <Link to={`/admin/products/form/update/${this.state.product.path_name}`} className="absolute" style={{ top: "5px", left: "30px" }}><FontAwesomeIcon icon={faArrowLeft} /> Back</Link>
            <a onClick={() => this.setState({ showVarietalModal: true })} className="absolute" style={{ top: "5px", right: "5px" }}>Varietal Options <FontAwesomeIcon icon={faPlusCircle} /></a>


            <div className="margin-xl-v">
              <a onClick={() => this.setState({ showCreateModal: true })} className="w-95 text-align-center theme-background-3 padding-s hover-color-5 border-radius-s">
                <h3 className="margin-xs-v">Create Varietal</h3>
              </a>
            </div>


            <div>
              {this.state.product.varietals && this.state.product.varietals.map((v, i) => {
                return (
                  <>
                    {/* images */}
                    <>               
                      <div onClick={() => this.setState({ edit_image: { image_key: "i1", varietal_id: v._id } })} className={`margin-auto-h flex justify-center align-items-center background-color-black ${this.state.edit_image === "i1" && "st-selection-border"}`} style={{ maxHeight: "250px", maxWidth: "250px", minHeight: "250px", minWidth: "250px", marginTop: "10px" }}>
                        {!v.images.i1 && <FontAwesomeIcon style={this.props.mobile ? { fontSize: "30px" } : { fontSize: "35px" }} className="hover hover-color-12" icon={faEdit} />}
                        <img style={{ height: "250px", width: "auto", maxHeight: "250px", maxWidth: "250px" }} src={v.images.i1} />
                      </div>
                      <div className="flex flex-wrap justify-center">
                        {Object.keys(v.images).map((image_key, index) => {
                          if (image_key === "i1") {
                            return
                          } else {
                            return (
                              <div onClick={() => this.setState({ edit_image: { image_key, varietal_id: v._id } })}  key={index} className={`flex justify-center align-items-center background-color-black ${this.state.edit_image === image_key && "st-selection-border"}`} style={{ maxHeight: "150px", width: "40%", minHeight: "100px", margin: "10px 2px 0px 2px", flexBasis: "40%" }}>
                                {!v.images[image_key] && <FontAwesomeIcon style={this.props.mobile ? { fontSize: "20px" } : { fontSize: "25px" }} className="hover hover-color-12" icon={faEdit} />}
                                <img style={{ height: "auto", width: "auto", maxHeight: "150px", maxWidth: "100%" }} src={v.images[image_key]} />
                              </div>
                            )
                          }
                        })}
                      </div>
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
                    </>

                    {/* size */}
                    {v.size && 
                      <div className="flex align-items-center margin-s-v">
                        <div className="hover hover-color-12" onClick={() => this.showEditIndicator({ att: "size", v})}>{v.size.value}</div>
                        {this.state.propertyToEdit && this.state.propertyToEdit.v._id === v._id && this.state.propertyToEdit.att === "size" && 
                          <FontAwesomeIcon 
                            className="margin-s-h hover hover-color-11"
                            icon={faEdit} 
                            onClick={() => this.setState({ sizeModal: { v } })} 
                          />
                        }
                      </div>
                    }
                    
                    {/* color */}
                    {v.color &&                    
                      <div className="flex align-items-center margin-s-v">
                        <div className="hover hover-color-12" onClick={() => this.showEditIndicator({ att: "color", v})}>{v.color.name}</div>
                        <div className="hover hover-color-12" onClick={() => this.showEditIndicator({ att: "color", v })} style={{ height: "35px", width: "35px", backgroundColor: v.color.value }}></div>
                        {this.state.propertyToEdit && this.state.propertyToEdit.v._id === v._id && this.state.propertyToEdit.att === "color" && 
                          <FontAwesomeIcon 
                            className="margin-s-h hover hover-color-11"
                            icon={faEdit} 
                            onClick={() => this.setState({ colorModal: { v } })} 
                          />
                        }
                      </div>
                    }

                    {/* inventory count */}
                    <div className="flex margin-s-v">
                      <div className="hover hover-color-12" onClick={() => this.showEditIndicator({ att: "inventory_count", v })}>{v.inventory_count}</div>
                      {this.state.propertyToEdit && this.state.propertyToEdit.v._id === v._id && this.state.propertyToEdit.att === "inventory_count" && 
                        <FontAwesomeIcon 
                          className="margin-s-h hover hover-color-11"
                          icon={faEdit} 
                          onClick={() => this.showEditModal("inventory_count")} 
                        />
                      }
                    </div>
                    
                    <br />
                    <hr />
                    <br />
                  </>
                )
              })}
            </div>


            {this.state.showVarietalModal &&
              <Modal cancel={() => this.setState({ showVarietalModal: false })}>
                <VarietalOptions colors={this.state.color_options} sizes={this.state.size_options} options={this.state.options} product={this.state.product} cancel={() => this.setState({ showVarietalModal: false })} />
              </Modal>
            }

            {this.state.showCreateModal &&
              <Modal cancel={() => console.log('nothing')}>
                <CreateVarietal product={this.state.product} cancel={() => this.setState({ showCreateModal: false })} />
              </Modal>
            }

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

            {
              this.state.colorModal && 
                <Modal cancel={() => this.setState({ colorModal: false })}>
                  <Form
                    onSubmit={this.changeVarietalColor}
                    cancel={() => this.setState({ colorModal: false })}
                    submitButtonText={"Update"}
                    dropDownCustomItemComponent={colorDropDownItem}
                    formFields={[
                      { label: 'Choose Color', name: 'color', typeOfComponent: "dropdown", noValueError: 'You must provide an email', 
                        options: this.state.color_options.map(color => {
                          return (
                            {
                              default: color._id === this.state.colorModal.v.color._id ? true : false,
                              value: color,
                              name: color.name,
                              redux_field: "color_option"
                            }
                          )
                        })
                      },
                    ]}
                    form={"color_update_form"}
                  />
                </Modal>
            }

            {
              this.state.sizeModal && 
                <Modal cancel={() => this.setState({ sizeModal: false })}>
                  <Form
                    onSubmit={this.changeVarietalSize}
                    cancel={() => this.setState({ sizeModal: false })}
                    submitButtonText={"Update"}
                    formFields={[
                      { label: 'Choose Size', name: 'size', typeOfComponent: "dropdown", noValueError: 'You must provide an email', 
                        options: this.state.size_options.map(size => {
                          return (
                            {
                              default: size._id === this.state.sizeModal.v.size._id ? true : false,
                              value: size,
                              name: size.name,
                              redux_field: "size_option"
                            }
                          )
                        })
                      },
                    ]}
                    form={"size_update_form"}
                  />
                </Modal>
            }
          </div>
        :
          <FontAwesomeIcon className="loadingGif loadingGifCenterScreen" icon={faSpinner} spin />
        }
      </div>
    )
  }
}

function mapStateToProps({ mobile, form }) {
  return { mobile, form }
}

const actions = { dispatchObj, getAllVarietalOptions, getProductbyId, updateVarietal, updateProduct }

export default connect(mapStateToProps, actions)(ProductVarietals)