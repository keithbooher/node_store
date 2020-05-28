import React, { Component } from 'react'
import { paginatedOrders, lastOrder } from "../../../utils/API"
import loadingGif from '../../../images/pizzaLoading.gif'
import PageChanger from "../../shared/PageChanger"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEdit } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import QuickView from './QuickView';
import { runInThisContext } from 'vm';

class Orders extends Component {
  constructor(props) {
    super()
    this.changePage = this.changePage.bind(this)
    this.state = {
      orders: [],
      page_number: 1,
      chosen_order: null,
      last_order: null,
      status_filter: "pending"
    }
  }
  
  async componentDidMount() {
    const orders = await paginatedOrders("none", "none", "pending")
    const last_order = await lastOrder()
    console.log(orders)
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

  async changeOrderTab(status) {
    const orders = await paginatedOrders("none", "none", status)
    this.setState({ orders: orders.data, status_filter: status })
  }

  async changePage(direction_reference_id, direction, page_increment) {
    const orders = await paginatedOrders(direction_reference_id, direction, this.state.status_filter)
    this.setState({ orders: orders.data, page_number: this.state.page_number + page_increment })
  }

  renderOrders() {
    return this.state.orders.map((order) => {
      return (
        <>
          <tr className="clickable margin-xs-v color-white" style={{ backgroundColor: 'rgb(45, 45, 45)' }} data-order-tab={order._id} >
            <td onClick={ () => this.setOrder(order)} class="padding-xs flex justify-content-space-between quick-view">
              <a><FontAwesomeIcon icon={faEye} /></a>
            </td><td className="padding-xs">
              <Link  style={{ display: "inline"}} to={`/admin/orders/${order._id}`}>
                <FontAwesomeIcon icon={faEdit} style={{ display: "inline"}} /><span style={{  marginLeft: "5px" }}>...{order._id.substring(order._id.length - 4)}</span>
              </Link>
            </td><td className="padding-xs">
              <Link to={`/admin/users/${order._user_id}`}>{order.email}</Link>
            </td><td className="padding-xs">
              <span>{new Date(order.date_placed).toDateString()}</span>
            </td><td className="padding-xs">
              <span>${order.total}</span>
            </td><td className="padding-xs text-align-center">
              <span>{order.status}</span>
            </td>
          </tr>
          
          <tr>
            <td colspan="6">{this.state.chosen_order === order._id ? <QuickView order={order} /> : ""}</td>
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

    const highlightedColorStyle = {
      backgroundColor: "darkgray",
      padding: "5px"
    }

    return (
      <div>
        <div style={{ backgroundColor: "grey", color: "white", padding: "5px" }} className="flex space-evenly">
          <div style={ this.state.status_filter === "pending" ? highlightedColorStyle: {} } onClick={() => this.changeOrderTab("pending")}>Pending</div>
          <div style={ this.state.status_filter === "processing" ? highlightedColorStyle: {} } onClick={() =>this.changeOrderTab("processing")}>Processing Shipment</div>
          <div style={ this.state.status_filter === "complete" ? highlightedColorStyle: {} } onClick={() => this.changeOrderTab("complete")}>Complete</div>
          <div style={ this.state.status_filter === "cancelled" ? highlightedColorStyle: {} } onClick={() => this.changeOrderTab("cancelled")}>Cancelled</div>
          <div style={ this.state.status_filter === "returned" ? highlightedColorStyle: {} } onClick={() => this.changeOrderTab("returned")}>Returned</div>
          <div style={ this.state.status_filter === "all" ? highlightedColorStyle: {} } onClick={() => this.changeOrderTab("all")}>All</div>
        </div>
        <br/>
        <table>
          <thead>
            <tr>
              <th style={{ wordWrap: "normal", width: "2em" }}>Quick View</th>
              <th>Order Number</th>
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