import React, { Component } from 'react'
import { Link } from "react-router-dom"
import Key from "../../shared/Key"
import { LazyLoadImage } from 'react-lazy-load-image-component'

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
        <h3 className="margin-xs-v">User Email:</h3>
        <div className="margin-xs-h"><Link to={`/admin/users/${order._user_id}`}>{order.email}</Link></div>
        <h3 className="margin-xs-v">Line Items:</h3>
        <div className="margin-xs-h">
          {order.shipment.line_items.map((line_item, index) => {
              return (<div key={index} className="flex align-items-center">
                        <div className="margin-auto-v flex justify-center align-items-center background-color-black" style={{ maxHeight: "75px", maxWidth: "75px", minHeight: "75px", minWidth: "75px", marginRight: "10px" }}>
                          <LazyLoadImage
                            style={{ height: "auto", width: "auto", maxHeight: "75px", maxWidth: "75px" }}
                            src={line_item.image}
                          />
                        </div>
                        <div>
                          <Link to={`/admin/products/form/update/${line_item.product_path.split("/")[line_item.product_path.split("/").length - 1]}`}><h3 className="margin-s-v">{line_item.product_name}</h3></Link>
                          <div><Key>Quantity: </Key>{line_item.quantity}</div>
                        </div>
                      </div>
                      )
          })}
        </div>
        <h3 className="margin-xs-v">Shipping Address:</h3>
        <div className="margin-xs-h"><Key>First Name: </Key>{order.shipment.shipping_address.first_name}</div>
        <div className="margin-xs-h"><Key>Last Name: </Key>{order.shipment.shipping_address.last_name}</div>
        <div className="margin-xs-h"><Key>Company: </Key>{order.shipment.shipping_address.company}</div>
        <div className="margin-xs-h"><Key>Street Address 1: </Key>{order.shipment.shipping_address.street_address_1}</div>
        <div className="margin-xs-h"><Key>Street Address 2: </Key>{order.shipment.shipping_address.street_address_2}</div>
        <div className="margin-xs-h"><Key>City: </Key>{order.shipment.shipping_address.city}</div>
        <div className="margin-xs-h"><Key>State: </Key>{order.shipment.shipping_address.state}</div>
        <div className="margin-xs-h"><Key>Zip Code: </Key>{order.shipment.shipping_address.zip_code}</div>
        <div className="margin-xs-h"><Key>Country: </Key>{order.shipment.shipping_address.country}</div>
        <h3 className="margin-xs-v">Date Placed:</h3>
        <div className="margin-xs-h">{new Date(order.date_placed).toDateString()}</div>
        <h3 className="margin-xs-v">Total:</h3>
        <div className="margin-xs-h">${order.total}</div>
      </div>
    )
  }
}

export default QuickView