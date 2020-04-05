import React, { Component } from 'react'
import { connect } from 'react-redux'
import loadingGif from '../../../../../images/pizzaLoading.gif'
import API from "../../../../../utils/API"
import LineItem from "./LineItem.js"

class Orders extends Component {
  constructor(props) {
    super()
    this.state = {
      orders: null,
      page_number: 1,
      chosen_order: null
    }
  }

  async componentDidMount() {
    const orders = await API.getUsersOrders(this.props.auth._id, "none", "none")
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
        <div>{order.line_items.map((line_item) => <LineItem auth={this.props.auth} line_item={line_item} />)}</div>
        <div>Total: ${order.total}</div>
        <div>Date Place: ${order.date_placed}</div>
      </div>
    )
  }

  async changePage(direction) {
    let direction_reference_order_id
    let page_increment
    if (direction === "next") {
      page_increment = 1
      direction_reference_order_id = this.state.orders[this.state.orders.length - 1]
    } else {
      page_increment = -1
      direction_reference_order_id = this.state.orders[0]
    }
    
    const orders = await API.getUsersOrders(this.props.auth._id, direction_reference_order_id._id, direction)
    this.setState({ orders: orders.data, page_number: this.state.page_number + page_increment })
  }

  renderOrders() {
    return this.state.orders.map((order) => {
      return (
        <div>
          <div className="clickable margin-xs-v" style={{ backgroundColor: 'rgb(45, 45, 45)' }} data-order-tab={order._id} onClick={ () => this.setOrder(order) }>{order._id}</div>
          { this.state.chosen_order === order._id ? this.orderData(order) : ""}
        </div>
      )
    })
  }

  render() {
    return (
      <div>
        {this.state.orders !== null ? this.renderOrders() : <img className="loadingGif" src={loadingGif} /> }
        <div className="flex">
          <button onClick={() => this.changePage('previous')} className="bare_button">Previous</button>
          <div className="font-size-1-3">{this.state.page_number}</div>
          <button onClick={() => this.changePage('next')} className="bare_button">Next</button>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(mapStateToProps, null)(Orders)