import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { updateUser } from '../../../../actions'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faTrash, faPlusCircle, faCaretRight, faCaretLeft} from "@fortawesome/free-solid-svg-icons"
import { reset } from 'redux-form'
import { capitalizeFirsts } from "../../../../utils/helpFunctions"
import Carousel from "../../../shared/Carousel"

const AddressCard = ({ auth, actionBox, reset, bill_or_ship, hideCreate, showForm, fedUser, updateUser }) => {
  const [checked_box, set_checked_box] = useState(null)

  const checkBox = (address) => {
    actionBox(address)
    if (address.bill_or_ship === "billing") {
      reset("billing_checkout_form")
    } else {
      reset("shipping_checkout_form")
    }
    if (checked_box === address._id) {
      set_checked_box(null)
    } else {
      set_checked_box(address._id)
    }
  }

  const title = () => {
    let title
    if (bill_or_ship.indexOf('billing') > -1) {
      title = "Billing"
    } else {
      title = "Shipping"
    }
    return (
      <h4>
        <span className="store_text_color" style={{ marginRight: "5px" }}>{capitalizeFirsts(title)} Addresses</span>
        {hideCreate ? "" : 
          <FontAwesomeIcon 
            className="hover"
            onClick={() => showForm(bill_or_ship)} 
            icon={faPlusCircle} 
          />
        }
      </h4>
    )
  }
  
  const check_highlight = (address) => {
    if (checked_box === address._id) {
      return true
    } else {
      return false
    }
  }

  const deleteAddress = (address) => {
    let user = auth ? auth : fedUser
    let address_to_be_deleted = address
    let new_bill = user.billing_address.filter(address => address_to_be_deleted._id !== address._id)
    let new_ship = user.shipping_address.filter(address => address_to_be_deleted._id !== address._id)
    user.billing_address = new_bill
    user.shipping_address = new_ship
    updateUser(user)
  }

  const renderAddressCards = () => {
    return user[bill_or_ship].map((address, index) => {
      return (      
      <div 
        key={index} 
        data-address-id={address._id} 
        style={ check_highlight(address) ? { backgroundColor: "rgb(160 169 212)" } :  {}} 
        className="address_card_container padding-s-h padding-s-bottom padding-l-top color-black border-radius-s theme-background-4 relative"
      >
        <div className="margin-xs-v"><span className="bold">First Name:</span> {address.first_name ? address.first_name : "" }</div>
        <div className="margin-xs-v"><span className="bold">Last Name:</span> {address.last_name ? address.first_name : "" }</div>
        <div className="margin-xs-v"><span className="bold">Company:</span> {address.company ? address.company : "" }</div>
        <div className="margin-xs-v"><span className="bold">Street Address 1:</span> {address.street_address_1 ? address.street_address_1 : "" }</div>
        <div className="margin-xs-v"><span className="bold">Street Address 2:</span> {address.street_address_2 ? address.street_address_2 : "" }</div>
        <div className="margin-xs-v"><span className="bold">City:</span> {address.city ? address.city : "" }</div>
        <div className="margin-xs-v"><span className="bold">State:</span> {address.state ? address.state : "" }</div>
        <div className="margin-xs-v"><span className="bold">Zip Code:</span> {address.zip_code ? address.zip_code : "" }</div>
        <div className="margin-xs-v"><span className="bold">Phone Number:</span> {address.phone_number ? address.phone_number : "" }</div>
        <button className="absolute" style={{ top: "3px", right: "3px" }} onClick={() => deleteAddress(address)}><FontAwesomeIcon icon={faTrash} /></button>
        { actionBox ? <button style={{ marginTop: '10px' }} onClick={() => checkBox(address)}>Use this address </button> : "" }
      </div>
      )
    })
  }

  let user
  if (auth) {
    user = auth
  } else {
    user = fedUser
  }

  return (
    <div style={{ position: 'relative' }}>
      <div className="flex">
        {title()}
      </div>

      {user && user[bill_or_ship] && user[bill_or_ship].length > 0 ?
        <div className="flex space-evenly">
          <div className="w-100 relative">
            {user && user[bill_or_ship] && <Carousel children={renderAddressCards()} />}
          </div>
        </div>
      : ""}


    </div>
  )
}

function mapStateToProps({ auth }) {
  return { auth }
}

const actions = { updateUser, reset }

export default connect(mapStateToProps, actions)(AddressCard)