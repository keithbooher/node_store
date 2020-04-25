import React, { Component } from 'react'
import { getAllOrders } from "../../utils/API"
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
      chosen_order: null
    }
  }
  
  async componentDidMount() {
    const orders = await getAllOrders("none", "none")
    console.log(orders)
    this.setState({ orders: orders.data })
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

  async changePage(direction_reference_id, direction) {
    const orders = await getAllOrders(direction_reference_id, direction)
    this.setState({ orders: orders.data })
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
    return (
      <div>
        {this.state.orders.length !== 0 ? this.renderOrders() : <img className="loadingGif" src={loadingGif} /> }
        <PageChanger list_items={this.state.orders} requestMore={this.changePage} />
      </div>
    )
  }
}


export default Orders