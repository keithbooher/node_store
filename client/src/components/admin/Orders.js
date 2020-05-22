import React, { Component } from 'react'
import { getAllOrders, lastOrder } from "../../utils/API"
import LineItem from "../shared/LineItem"
import loadingGif from '../../images/pizzaLoading.gif'
import PageChanger from "../shared/PageChanger"
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
    const orders = await getAllOrders("none", "none")
    const last_order = await lastOrder()
    this.setState({ orders: orders.data, last_order: last_order.data })
  }

  setOrder(order) {
    this.setState({ 
      chosen_order: order._id,
    })
  }

  orderData(order) {
    return  (
      <div style={{ backgroundColor: 'rgb(111, 111, 111)', width: '93%', margin: '0px auto' }}>
        <div>{order.line_items.map((line_item) => <LineItem admin={true} order_id={order._id} line_item={line_item} />)}</div>
        <div>Total: ${order.total}</div>
        <div>Date Place: ${order.date_placed}</div>
      </div>
    )
  }

  async changePage(direction_reference_id, direction, page_increment) {
    const orders = await getAllOrders(direction_reference_id, direction)
    this.setState({ orders: orders.data, page_number: this.state.page_number + page_increment })
  }

  renderOrders() {
    return this.state.orders.map((order) => {
      return (
        <div>
          <div className="clickable margin-xs-v color-white" style={{ backgroundColor: 'rgb(45, 45, 45)' }} data-order-tab={order._id} onClick={ () => this.setOrder(order) }>{order._id}----{order.date_placed}</div>
          { this.state.chosen_order === order._id ? this.orderData(order) : ""}
        </div>
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
        {this.state.orders.length !== 0 ? this.renderOrders() : <img className="loadingGif" src={loadingGif} /> }
        <PageChanger page_number={this.state.page_number} list_items={this.state.orders} requestMore={this.changePage} lastPossibleItem={lastPossibleItem} />
      </div>
    )
  }
}


export default Orders