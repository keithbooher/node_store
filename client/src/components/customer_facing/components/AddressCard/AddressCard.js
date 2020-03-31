import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateUser } from '../../../../actions'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faTrash} from "@fortawesome/free-solid-svg-icons"
import { reset } from 'redux-form'

class AddressCard extends Component {
  constructor(props) {
    super()
    this.checkBox = this.checkBox.bind(this)
    this.state = {checked_box: null}
  }

  checkBox(address) {
    this.props.actionBox(address)
    if (address.bill_or_ship === "billing") {
      this.props.reset("billing_checkout_form")
    } else {
      this.props.reset("shipping_checkout_form")
    }
    if (this.state.checked_box === address._id) {
      this.setState({ checked_box: null })
    } else {
      this.setState({ checked_box: address._id })
    }
  }

  title() {
    let title
    if (this.props.bill_or_ship.indexOf('billing') > -1) {
      title = "Billing"
    } else {
      title = "Shipping"
    }
    return <h5>Past {title} Addresses</h5>
  }
  
  check_highlight(address) {
    if (this.state.checked_box === address._id) {
      return true
    } else {
      return false
    }
  }

  deleteAddress(address) {
    let user = this.props.auth
    let address_to_be_deleted = address
    let new_bill = user.billing_address.filter(address => address_to_be_deleted._id !== address._id)
    let new_ship = user.shipping_address.filter(address => address_to_be_deleted._id !== address._id)
    user.billing_address = new_bill
    user.shipping_address = new_ship
    console.log(user)
    this.props.updateUser(user)
  }

  render() {
    // console.log(this.state)
    return (
      <div style={{ position: 'relative' }}>
        {/* delete icon */}
        {this.title()}
        <div style={{ display: 'flex' }}>
          {this.props.auth[this.props.bill_or_ship].map((address) => {
            return <div data-address-id={address._id} style={ this.check_highlight(address) ? { backgroundColor: "rgba(1,1,1,0.5)" } :  {}} className="address_card_container">
                    <div>first name: {address.first_name ? address.first_name : "" }</div>
                    <div>last name: {address.last_name ? address.first_name : "" }</div>
                    <div>company: {address.company ? address.company : "" }</div>
                    <div>street address 1: {address.street_address_1 ? address.street_address_1 : "" }</div>
                    <div>street address 2: {address.street_address_2 ? address.street_address_2 : "" }</div>
                    <div>city: {address.city ? address.city : "" }</div>
                    <div>state: {address.state ? address.state : "" }</div>
                    <div>zip code: {address.zip_code ? address.zip_code : "" }</div>
                    <div>phone number: {address.phone_number ? address.phone_number : "" }</div>
                    <div>bill_or_ship: {address.bill_or_ship ? address.bill_or_ship : "" }</div>
                    <button onClick={() => this.deleteAddress(address)}><FontAwesomeIcon icon={faTrash} /></button>
                    { this.props.actionBox ? <button onClick={() => this.checkBox(address)}>Use this address </button> : "" }
                  </div>
          })}
        </div>

      </div>
    )
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

const actions = { updateUser, reset }

export default connect(mapStateToProps, actions)(AddressCard)