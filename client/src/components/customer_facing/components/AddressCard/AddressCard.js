import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateUser, dispatchObj } from '../../../../actions'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faTrash, faPlusCircle, faEdit} from "@fortawesome/free-solid-svg-icons"
import { reset } from 'redux-form'
import { capitalizeFirsts } from "../../../../utils/helpFunctions"
import Carousel from "../../../shared/Carousel/Carousel"
import { validatePresenceOnAll } from "../../../../utils/validations"
import FormModal from "../../../shared/Form/FormModal"

class AddressCard extends Component {
  constructor(props) {
    super()
    this.state = {
      checked_box: null,
      propertyToEdit: null,
      editForm: null,
      checked_box: null
    }
  }

  checkBox = (address) => {
    this.props.actionBox(address)
    if (address.bill_or_ship === "billing") {
      reset("billing_checkout_form")
    } else {
      reset("shipping_checkout_form")
    }
    if (this.state.checked_box === address._id) {
      this.setState({ checked_box: null })
    } else {
      this.setState({ checked_box: address._id })

    }
  }

  title = () => {
    let title
    if (this.props.bill_or_ship.indexOf('billing') > -1) {
      title = "Billing"
    } else {
      title = "Shipping"
    }
    return (
      <h4>
        <span style={{ marginRight: "5px" }}>{capitalizeFirsts(title)} Addresses</span>
        {this.props.hideCreate ? "" : 
          <FontAwesomeIcon 
            className="hover store_text_color hover-color-12"
            onClick={() => this.props.showForm(this.props.bill_or_ship)} 
            icon={faPlusCircle} 
          />
        }
      </h4>
    )
  }
  
  check_highlight = (address) => {
    if (this.state.checked_box === address._id) {
      return true
    } else {
      return false
    }
  }

  deleteAddress = (address) => {
    let user = this.props.auth ? this.props.auth : this.props.fedUser
    let address_to_be_deleted = address
    let new_bill = user.billing_address.filter(address => address_to_be_deleted._id !== address._id)
    let new_ship = user.shipping_address.filter(address => address_to_be_deleted._id !== address._id)
    user.billing_address = new_bill
    user.shipping_address = new_ship
    this.props.updateUser(user)
  }

  updateAddressProperty = async (address, property) => {
    const form_value = this.props.form['edit_address_property_form'].values[property]
    console.log(form_value)
    let user = this.props.auth ? this.props.auth : this.props.fedUser

    user[this.props.bill_or_ship].map((addy) => {
      if (addy._id === address._id) {
        addy[property] = form_value
      }
      return addy
    })
    // update user
    await this.props.updateUser(user)


    this.setState({ editForm: null, propertyToEdit: null })
    dispatchObj(reset("edit_address_property_form"))
  }

  showEditModal = (property, address) => {
    const form_object = {
      address,
      onSubmit: () => this.updateAddressProperty(address, property),
      cancel: () => {
        this.props.dispatchObj(reset("edit_address_property_form"))
        this.setState({ editForm: null, propertyToEdit: null })
      },
      submitButtonText: "Update Address Property",
      formFields: [
        { label: capitalizeFirsts(property), name: property, noValueError: `You must provide a value` },
      ],
      form: "edit_address_property_form",
      validation: validatePresenceOnAll,
      initialValues: {
          [property]: address[property]
        }
    }
    if (property === "country") {
      form_object.formFields[0].typeOfComponent = "countries"
    } else if (property === "state") {
      form_object.formFields[0].typeOfComponent = "states"
    } else if (property === "phone_number") {
      form_object.formFields[0].typeOfComponent = "number"
    }
    this.setState({ editForm: form_object })
  }

  showEditIndicator = (property, bill_or_ship, id) => {
    let propertyToEdit = {
      property,
      bill_or_ship,
      id
    }
    this.setState({ propertyToEdit })
  }

  renderAddressCards = (user) => {
    return user[this.props.bill_or_ship].map((address, index) => {
      return (      
      <div 
        key={index} 
        data-address-id={address._id} 
        className={`${this.props.mobile ? "address_card_container" : "address_card_container_desktop"} color-white padding-s-h padding-s-bottom padding-l-top border-radius-s relative ${ this.check_highlight(address) ? "theme-background-4 st-border" : "theme-background-3" }`}
        style={ this.props.mobile ? {} : { fontSize: "20px" }}
      >
        <div className={`margin-xs-v`}>
          <span >First Name:</span> 
          <a className="inline margin-s-h hover-color-11" onClick={() => this.showEditIndicator("first_name", this.props.bill_or_ship, address._id)}>{address.first_name ? address.first_name : "" }</a>
          {this.state.propertyToEdit && this.state.propertyToEdit.id === address._id && this.state.propertyToEdit.property === "first_name" && this.state.propertyToEdit.bill_or_ship === this.props.bill_or_ship && 
            <FontAwesomeIcon 
              icon={faEdit} 
              className="hover-color-2 hover"
              onClick={() => this.showEditModal("first_name", address)} 
            />
          }
        </div>
        <div className={`margin-xs-v`}>
          <span >Last Name:</span> 
          <a className="inline margin-s-h hover-color-11" onClick={() => this.showEditIndicator("last_name", this.props.bill_or_ship, address._id)}>{address.last_name ? address.last_name : "" }</a>
          {this.state.propertyToEdit && this.state.propertyToEdit.id === address._id && this.state.propertyToEdit.property === "last_name" && this.state.propertyToEdit.bill_or_ship === this.props.bill_or_ship && 
            <FontAwesomeIcon 
              icon={faEdit} 
              className="hover-color-2 hover"
              onClick={() => this.showEditModal("last_name", address)} 
            />
          }
        </div>
        <div className={`margin-xs-v`}>
          <span >Company:</span> 
          <a className="inline margin-s-h hover-color-11" onClick={() => this.showEditIndicator("company", this.props.bill_or_ship, address._id)}>{address.company ? address.company : "" }</a>
          {this.state.propertyToEdit && this.state.propertyToEdit.id === address._id && this.state.propertyToEdit.property === "company" && this.state.propertyToEdit.bill_or_ship === this.props.bill_or_ship && 
            <FontAwesomeIcon 
              icon={faEdit} 
              className="hover-color-2 hover"
              onClick={() => this.showEditModal("company", address)} 
            />
          }
        </div>
        <div className={`margin-xs-v`}>
          <span >Street Address 1:</span> 
          <a className="inline margin-s-h hover-color-11" onClick={() => this.showEditIndicator("street_address_1", this.props.bill_or_ship, address._id)}>{address.street_address_1 ? address.street_address_1 : "" }</a>
          {this.state.propertyToEdit && this.state.propertyToEdit.id === address._id && this.state.propertyToEdit.property === "street_address_1" && this.state.propertyToEdit.bill_or_ship === this.props.bill_or_ship && 
            <FontAwesomeIcon 
              icon={faEdit} 
              className="hover-color-2 hover"
              onClick={() => this.showEditModal("street_address_1", address)} 
            />
          }
        </div>
        <div className={`margin-xs-v`}>
          <span >Street Address 2:</span> 
          <a className="inline margin-s-h hover-color-11" onClick={() => this.showEditIndicator("street_address_2", this.props.bill_or_ship, address._id)}>{address.street_address_2 ? address.street_address_2 : "" }</a>
          {this.state.propertyToEdit && this.state.propertyToEdit.id === address._id && this.state.propertyToEdit.property === "street_address_2" && this.state.propertyToEdit.bill_or_ship === this.props.bill_or_ship && 
            <FontAwesomeIcon 
              icon={faEdit} 
              className="hover-color-2 hover"
              onClick={() => this.showEditModal("street_address_2", address)} 
            />
          }
        </div>
        <div className={`margin-xs-v`}>
          <span >City:</span> 
          <a className="inline margin-s-h hover-color-11" onClick={() => this.showEditIndicator("city", this.props.bill_or_ship, address._id)}>{address.city ? address.city : "" }</a>
          {this.state.propertyToEdit && this.state.propertyToEdit.id === address._id && this.state.propertyToEdit.property === "city" && this.state.propertyToEdit.bill_or_ship === this.props.bill_or_ship && 
            <FontAwesomeIcon 
              icon={faEdit} 
              className="hover-color-2 hover"
              onClick={() => this.showEditModal("city", address)} 
            />
          }
        </div>
        <div className={`margin-xs-v`}>
          <span >State:</span> 
          <a className="inline margin-s-h hover-color-11" onClick={() => this.showEditIndicator("state", this.props.bill_or_ship, address._id)}>{address.state ? address.state : "" }</a>
          {this.state.propertyToEdit && this.state.propertyToEdit.id === address._id && this.state.propertyToEdit.property === "state" && this.state.propertyToEdit.bill_or_ship === this.props.bill_or_ship && 
            <FontAwesomeIcon 
              icon={faEdit} 
              className="hover-color-2 hover"
              onClick={() => this.showEditModal("state", address)} 
            />
          }
        </div>
        <div className={`margin-xs-v`}>
          <span >Zip Code:</span> 
          <a className="inline margin-s-h hover-color-11" onClick={() => this.showEditIndicator("zip_code", this.props.bill_or_ship, address._id)}>{address.zip_code ? address.zip_code : "" }</a>
          {this.state.propertyToEdit && this.state.propertyToEdit.id === address._id && this.state.propertyToEdit.property === "zip_code" && this.state.propertyToEdit.bill_or_ship === this.props.bill_or_ship && 
            <FontAwesomeIcon 
              icon={faEdit} 
              className="hover-color-2 hover"
              onClick={() => this.showEditModal("zip_code", address)} 
            />
          }
        </div>
        <div className={`margin-xs-v`}>
          <span >Phone Number:</span> 
          <a className="inline margin-s-h hover-color-11" onClick={() => this.showEditIndicator("phone_number", this.props.bill_or_ship)}>{address.phone_number ? address.phone_number : "" }</a>
          {this.state.propertyToEdit && this.state.propertyToEdit.id === address._id && this.state.propertyToEdit.property === "phone_number" && this.state.propertyToEdit.bill_or_ship === this.props.bill_or_ship && 
            <FontAwesomeIcon 
              icon={faEdit} 
              className="hover-color-2 hover"
              onClick={() => this.showEditModal("phone_number", address)} 
            />
          }
        </div>
        <div className={`margin-xs-v`}>
          <span >Country:</span> 
          <a className="inline margin-s-h hover-color-11" onClick={() => this.showEditIndicator("country", this.props.bill_or_ship)}>{address.country ? address.country : "" }</a>
          {this.state.propertyToEdit && this.state.propertyToEdit.id === address._id && this.state.propertyToEdit.property === "country" && this.state.propertyToEdit.bill_or_ship === this.props.bill_or_ship && 
            <FontAwesomeIcon 
              icon={faEdit} 
              className="hover-color-2 hover"
              onClick={() => this.showEditModal("country", address)} 
            />
          }
        </div>
        <FontAwesomeIcon className="absolute hover hover-color-11" style={{ top: "5px", right: "5px" }} onClick={() => this.deleteAddress(address)} icon={faTrash} />
        { this.props.actionBox ? <button style={{ marginTop: '10px' }} onClick={() => this.checkBox(address)}>Use this address </button> : "" }
      </div>
      )
    })
  }


  render() {
    let user
    if (this.props.auth) {
      user = this.props.auth
    } else {
      user = this.props.fedUser
    }
    return (
      <div style={{ position: 'relative' }}>
        <div style={this.props.mobile ? {} : { fontSize: "30px", width: "90%", margin: "0px auto" }} className="flex">
          {this.title()}
        </div>

        {this.props.mobile !== null && user && user[this.props.bill_or_ship] && user[this.props.bill_or_ship].length > 0 ?
          <div className={`flex space-evenly padding-m border-radius-s ${this.props.mobile ? "" : "w-90 margin-auto-h"}`}>
            <div className="w-100 relative">
              {user && user[this.props.bill_or_ship] && <Carousel mobile={this.props.mobile} children={this.renderAddressCards(user)} />}
            </div>
          </div>
        : ""}

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
                title={"Updating Address Property"}
                initialValues={this.state.editForm.initialValues}
              />
            </div>
        }
      </div>
    )
  }
}

function mapStateToProps({ auth, form, mobile }) {
  return { auth, form, mobile }
}

const actions = { updateUser, reset, dispatchObj }

export default connect(mapStateToProps, actions)(AddressCard)