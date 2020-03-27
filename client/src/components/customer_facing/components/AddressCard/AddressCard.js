import React, { Component } from 'react'
import { connect } from 'react-redux'


class AddressCard extends Component {
  constructor(props) {
    super()
    this.state = {}
  }

  async handleSubmit() {
    // some request to update the users general info
  }

  render() {
    return (
      <>
        {this.props.auth[this.props.bill_or_ship].map((address) => {
          return <div className="address_card_container">
                  <div>first name: {address.first_name ? address.first_name : "" }</div>
                  <div>last name: {address.last_name ? address.first_name : "" }</div>
                  <div>company: {address.company ? address.company : "" }</div>
                  <div>street address 1: {address.street_address_1 ? address.street_address_1 : "" }</div>
                  <div>street address 2: {address.street_address_2 ? address.street_address_2 : "" }</div>
                  <div>city: {address.city ? address.city : "" }</div>
                  <div>state: {address.state ? address.state : "" }</div>
                  <div>zip code: {address.zip_code ? address.zip_code : "" }</div>
                  <div>phone number: {address.phone_number ? address.phone_number : "" }</div>
                  { this.props.actionBox ? <label><input onChange={this.props.actionBox(address)} type="checkbox" /></label> : "" }
                </div>
        })}
      </>
    )
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(mapStateToProps, null)(AddressCard)