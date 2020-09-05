import React, { Component } from 'react'
import { connect } from 'react-redux'
import { capitalizeFirsts } from "../../../../../utils/helpFunctions"
import { updateUser, dispatchObj } from "../../../../../actions"
import { validatePresenceOnAll } from "../../../../../utils/validations"
import FormModal from "../../../../shared/Form/FormModal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faSpinner, faTimesCircle } from "@fortawesome/free-solid-svg-icons"
import AddressCard from '../../../components/AddressCard'
import NewAddress from './NewAddress'
import { reset } from "redux-form"

class Details extends Component {
  constructor(props) {
    super()
    this.finishUploading = this.finishUploading.bind(this)
    this.showAddressForm = this.showAddressForm.bind(this)
    this.state = {
      editForm: null,
      propertyToEdit: null,
      showAddressForm: null
    }
  }

  async handleSubmit(key) {
    // takes in the user attribute that was tied to the form field that submitted this request
    // and dynamically pulls the value from that redux-form field value
    let user = this.props.auth
    user[key] = this.props.form["update_user_form"].values[key]
    this.props.updateUser(user)
    this.setState({ editForm: null, propertyToEdit: null })
  }


  async finishUploading(data) {
    let user = this.props.auth
    const src = data.filesUploaded[0].url
    user.photo = src
    await this.props.updateUser(user)
  }


  showEditIndicator(propertyToEdit) {
    this.setState({ propertyToEdit })
  }


  showEditModal(property) {
    let user = this.props.auth
    const form_object = {
      user,
      onSubmit: () => this.handleSubmit(property),
      cancel: () => {
        this.props.dispatchObj(reset("update_user_form"))
        this.setState({ editForm: null, propertyToEdit: null })
      },
      submitButtonText: "Update User Property",
      formFields: [
        { label: capitalizeFirsts(property), name: property, noValueError: `You must provide a value` },
      ],
      form: "update_user_form",
      validation: validatePresenceOnAll,
      initialValues: {
          [property]: user[property]
        }
    }
    this.setState({ editForm: form_object })
  }


  showAddressForm(bill_or_ship) {
    this.setState({ showAddressForm: bill_or_ship })
  }

  render() {
    let mobileFontSize = "1em"
    let mobileMargin = "0px"
    let emailMargin = "1em 0em"
    if (!this.props.mobile) {
      mobileFontSize = "25px"
      mobileMargin = ".5em 40px"
      emailMargin = "40px"
    }
    return (
      <div>
        { this.props.auth ?
          <>
            <h4 style={{ fontSize: mobileFontSize, margin: emailMargin }}>Email: {this.props.auth.email}</h4>
            <div className="relative" style={{ margin: mobileMargin }}>
              <span style={{ fontSize: mobileFontSize }} className="bold" >First Name: </span>
              <a style={{ fontSize: mobileFontSize }} className="inline" onClick={() => this.showEditIndicator("first_name")}>{this.props.auth.first_name}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "first_name" && 
                <FontAwesomeIcon 
                  icon={faEdit} 
                  onClick={() => this.showEditModal("first_name")} 
                  style={{ fontSize: mobileFontSize }}
                  className="margin-s-h hover hover-color-2"
                />
              }
            </div>
            <div className="relative" style={{ margin: mobileMargin }}>
              <span style={{ fontSize: mobileFontSize }} className="bold" >Last Name: </span> 
              <a style={{ fontSize: mobileFontSize }} className="inline" onClick={() => this.showEditIndicator("last_name")}>{this.props.auth.last_name}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "last_name" && 
                <FontAwesomeIcon 
                  icon={faEdit} 
                  onClick={() => this.showEditModal("last_name")} 
                />
              }
            </div>


            {this.state.showAddressForm &&
              <FontAwesomeIcon 
                className="hover"
                onClick={() => this.showAddressForm(null)} 
                icon={faTimesCircle}
                style={{ marginBottom: "-40px" }}
              />
            }
            {this.state.showAddressForm === null ?
              <div>
                <AddressCard showForm={this.showAddressForm} bill_or_ship="billing_address" />    
                <AddressCard showForm={this.showAddressForm} bill_or_ship="shipping_address" />    
              </div>
            : ""}
            
            {this.state.showAddressForm === "billing_address" && 
              <NewAddress showForm={this.showAddressForm} bill_or_ship={"billing"} />
            }
            {this.state.showAddressForm === "shipping_address" && 
              <NewAddress showForm={this.showAddressForm} bill_or_ship={"shipping"} />
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
          </>
          : <FontAwesomeIcon className="loadingGif loadingGifCenterScreen" icon={faSpinner} spin />
        }
      </div>
    )
  }
}

function mapStateToProps({ auth, form, mobile }) {
  return { auth, form, mobile }
}

const actions = { updateUser, dispatchObj }

export default connect(mapStateToProps, actions)(Details)