import React, { Component } from 'react'
import { paginatedOrders, lastOrder } from "../../../utils/API"
import LineItem from "../../shared/LineItem"
import loadingGif from '../../../images/pizzaLoading.gif'
import PageChanger from "../../shared/PageChanger"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEdit } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"

class Orders extends Component {
  constructor(props) {
    super()
    this.changePage = this.changePage.bind(this)
    this.state = {
      orders: [],
      page_number: 1,
      chosen_order: null,
      last_order: null
    }
  }
  
  async componentDidMount() {
    const orders = await paginatedOrders("none", "none")
    const last_order = await lastOrder()
    this.setState({ orders: orders.data, last_order: last_order.data })
  }

  // figuring out which hidden order tab to show when selected
  setOrder(order) {
    order = {...order}
    switch (this.state.chosen_order) {
      case order._id:
        this.setState({ chosen_order: null })        
        break;
      case null:
        this.setState({ chosen_order: order._id })        
        break;
      default:
        this.setState({ chosen_order: order._id })
        break;
    }
  }

  orderData(order) {
    return  (
      <div className="padding-s " style={{ backgroundColor: 'rgb(111, 111, 111)', width: '93%', margin: '0px auto', padding: '10px' }}>
        <h4 className="margin-xs-v">Line Items:</h4>
        <div className="margin-xs-h">{order.line_items.map((line_item) => <LineItem admin={true} order_id={order._id} line_item={line_item} />)}</div>
        <h4 className="margin-xs-v">Adress Info:</h4>
        <div className="margin-xs-h">{order.shipment.billing_address.first_name}</div>
        <div className="margin-xs-h">{order.shipment.billing_address.last_name}</div>
        <div className="margin-xs-h">{order.shipment.billing_address.company}</div>
        <div className="margin-xs-h">{order.shipment.billing_address.street_address_1}</div>
        <div className="margin-xs-h">{order.shipment.billing_address.street_address_2}</div>
        <div className="margin-xs-h">{order.shipment.billing_address.city}</div>
        <div className="margin-xs-h">{order.shipment.billing_address.state}</div>
        <div className="margin-xs-h">{order.shipment.billing_address.zip_code}</div>
      </div>
    )
  }

  async changePage(direction_reference_id, direction, page_increment) {
    const orders = await paginatedOrders(direction_reference_id, direction)
    this.setState({ orders: orders.data, page_number: this.state.page_number + page_increment })
  }

  renderOrders() {
    return this.state.orders.map((order) => {
      return (
        <>
          <tr className="clickable margin-xs-v color-white" style={{ backgroundColor: 'rgb(45, 45, 45)' }} data-order-tab={order._id} >
            <td  onClick={ () => this.setOrder(order)} class="flex justify-content-space-between">
              <a><FontAwesomeIcon icon={faEye} /></a>
            </td><td>
              <Link  style={{ display: "inline"}} to={`/admin/orders/${order._id}`}><FontAwesomeIcon icon={faEdit} style={{ display: "inline"}} />{order._id}</Link>
            </td><td>
              <Link to={`/admin/users/${order._user_id}`}>{order.email}</Link>
            </td><td>
              <span>{new Date(order.date_placed).toDateString()}</span>
            </td><td>
              <span>${order.total}</span>
            </td><td>
              <span>{order.status}</span>
            </td>
          </tr>
          
          <tr>
            <td colspan="6">{this.state.chosen_order === order._id ? this.orderData(order) : ""}</td>
          </tr>
        </>
      )
    })
  }

  render() {
    let lastPossibleItem = false
    if (this.state.orders.length > 0) {
      if (this.state.orders[this.state.orders.length - 1]._id === this.state.last_order._id) {
        lastPossibleItem = true
      }
    }
    return (
      <div>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th style={{ wordWrap: "normal" }}>Quick View</th>
              <th>Order Numer</th>
              <th>Customer Email</th>
              <th>Date Placed</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {this.state.orders.length !== 0 ? this.renderOrders() : <img className="loadingGif" src={loadingGif} /> }
          </tbody>
        </table>
        <PageChanger page_number={this.state.page_number} list_items={this.state.orders} requestMore={this.changePage} lastPossibleItem={lastPossibleItem} />
      </div>
    )
  }
}


export default Orders