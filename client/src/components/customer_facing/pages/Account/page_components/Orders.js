import React, { Component } from 'react'
import { connect } from 'react-redux'
import loadingGif from '../../../../../images/pizzaLoading.gif'
import API from "../../../../../utils/API"

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

  showOrderInfo(order) {
    console.log(order)
  }

  renderOrders() {
    return this.state.orders.map((order) => {
      return (
        <div>
          <div className="clickable" onClick={ () => this.showOrderInfo(order) }>{order._id}</div>
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