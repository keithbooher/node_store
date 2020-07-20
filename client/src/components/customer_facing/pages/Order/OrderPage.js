import React, { Component } from 'react'
import { getOrder } from "../../../../utils/API"
import { Link } from "react-router-dom"
import LeaveReview from "../../../shared/LeaveReview"
import AddressDisplay from "../../../shared/AddressDisplay"
class OrderPage extends Component {
  constructor(props) {
    super()
    this.routeParamOrderId = props.match.params.id

    this.state = {
      order: null
    }
  }

  async componentDidMount() {
    const { data } = await getOrder(this.routeParamOrderId)

    this.setState({ order: data })
  }

  render() {
    const order = this.state.order

    return (
      <div>
        {order &&
          <>
            <div>Order ID: {order._id}</div>
            <div>Status: {order.status}</div>
            <div>Customer: <Link style={{ display: "inline" }} to={`/admin/users/${order._user_id}`} >{order.email}</Link></div>
            <div>Date Placed: {order.date_placed}</div>
            <div>Total: {order.total}</div>
            <hr/>
            <h2>Items Purchased</h2>
            {order.shipment.line_items.map((item, index) => {
              return (
                <div key={index}>
                  <img style={{ height: "auto", width: "auto", maxHeight: "200px", maxWidth: "200px" }} src={item.image} />
                  <div className="flex flex_column">
                    <div>Quantity: x{item.quantity}</div>
                    <div>Price Each: ${item.product_price}</div>
                    <div>Combined Total: ${item.quantity * item.product_price}</div>
                    <LeaveReview order_id={order._id} line_item={item} />
                  </div>
                </div>
              )
            })}
            <h2>Billing</h2>
            <AddressDisplay address={order.shipment.billing_address} />
            <h2>Shipping</h2>
            <AddressDisplay address={order.shipment.shipping_address} />
          </>
        }
      </div>
    )
  }
}

export default OrderPage