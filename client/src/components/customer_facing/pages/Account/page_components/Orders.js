import React, { Component } from 'react'
import { connect } from 'react-redux'
import loadingGif from '../../../../../images/pizzaLoading.gif'
import API from "../../../../../utils/API"
import { privateDecrypt } from 'crypto';

class Orders extends Component {
  constructor(props) {
    super()
    this.state = {orders: null}
  }

  async componentDidMount() {
    const orders = await API.getUsersOrders(this.props.auth._id, null)
    console.log(orders)
    this.setState({ orders: orders.data })
  }

  setOrder(order) {
    this.setState({ chosen_order: order._id })
  }

  orderData(order) {
    return  (
      <div style={{ backgroundColor: 'rgb(111, 111, 111)', width: '93%', margin: '0px auto' }}>
        <div>Total: ${order.total}</div>
        <div>Date Place: ${order.date_placed}</div>
      </div>
    )
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
      </div>
    )
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(mapStateToProps, null)(Orders)