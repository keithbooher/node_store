import React, { Component } from 'react'
import { Link } from "react-router-dom"


class QuickView extends Component  {
  constructor(props) {
    super()
    this.state = {

    }
  }
  
  render() {
    let order = this.props.order
    return (
      <div className="padding-s " style={{ backgroundColor: 'rgb(111, 111, 111)', width: '93%', margin: '0px auto', padding: '10px' }}>
        <h4 className="margin-xs-v">User Email:</h4>
        <div className="margin-xs-h"><Link to={`/admin/users/${order._user_id}`}>{order.email}</Link></div>
        <h4 className="margin-xs-v">Line Items:</h4>
        <div className="margin-xs-h">{order.shipment.line_items.map((line_item, index) => <div key={index}>{line_item.product_name}</div>)}</div>
        <h4 className="margin-xs-v">Address Info:</h4>
        <div className="margin-xs-h">{order.shipment.billing_address.first_name}</div>
        <div className="margin-xs-h">{order.shipment.billing_address.last_name}</div>
        <div className="margin-xs-h">{order.shipment.billing_address.company}</div>
        <div className="margin-xs-h">{order.shipment.billing_address.street_address_1}</div>
        <div className="margin-xs-h">{order.shipment.billing_address.street_address_2}</div>
        <div className="margin-xs-h">{order.shipment.billing_address.city}</div>
        <div className="margin-xs-h">{order.shipment.billing_address.state}</div>
        <div className="margin-xs-h">{order.shipment.billing_address.zip_code}</div>
        <div className="margin-xs-h">{order.shipment.billing_address.country}</div>
        <h4 className="margin-xs-v">Date Placed:</h4>
        <div className="margin-xs-h">{new Date(order.date_placed).toDateString()}</div>
        <h4 className="margin-xs-v">Total:</h4>
        <div className="margin-xs-h">${order.total}</div>
      </div>
    )
  }
}

export default QuickView