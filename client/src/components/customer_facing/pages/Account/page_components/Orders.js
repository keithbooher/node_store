import React, { Component } from 'react'
import { connect } from 'react-redux'
import loadingGif from '../../../../../images/pizzaLoading.gif'
import { getUsersOrders } from "../../../../../utils/API"
import LineItem from "../../../../shared/LineItem"
import PageChanger from "../../../../shared/PageChanger"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom"
class Orders extends Component {
  constructor(props) {
    super()
    this.changePage = this.changePage.bind(this)
    this.state = {
      orders: [],
      page_number: 1,
      chosen_order: null,
      retry: 0
    }
  }

  async componentDidMount() {
    if (this.props.auth) {
      const orders = await getUsersOrders(this.props.auth._id, "none", "none")
      this.setState({ orders: orders.data })
    }
  }

  async componentDidUpdate() {
    if (this.state.orders.length === 0 && this.state.retry < 3) {
      const orders = await getUsersOrders(this.props.auth._id, "none", "none")
      this.setState({ orders: orders.data, retry: this.state.retry + 1 })
    }
  }

  setOrder(order) {
    this.setState({ 
      chosen_order: order._id,
    })
  }

  orderData(order) {
    var date = order.date_placed.split("T")[0]
    return  (
      <div style={{ backgroundColor: 'rgb(111, 111, 111)', width: '93%', margin: '0px auto' }}>
        <div>{order.shipment.line_items.map((line_item) => <LineItem order_id={order._id} line_item={line_item} />)}</div>
        <div>Total: ${order.total}</div>
        <div>Date Place: {date}</div>
      </div>
    )
  }

  async changePage(direction_reference_id, direction, page_increment) {
    const orders = await getUsersOrders(this.props.auth._id, direction_reference_id, direction)
    this.setState({ orders: orders.data, page_number: this.state.page_number + page_increment })
  }

  renderOrders() {
    return this.state.orders.map((order) => {
      var date = order.date_placed.split("T")[0]
      return (
        <div>
          <div className="flex space-between margin-xs-v padding-s" style={{ backgroundColor: 'rgb(45, 45, 45)' }} data-order-tab={order._id}>        
            <FontAwesomeIcon icon={faCaretDown} onClick={ () => this.setOrder(order) } />
            <div>{"..." + order._id.substr(order._id.length - 8)}</div>
            <div>{date}</div>
            <Link to={`/order/${order._id}`}><FontAwesomeIcon icon={faExternalLinkAlt} onClick={ () => this.setOrder(order) } /></Link>
          </div>
          { this.state.chosen_order === order._id ? this.orderData(order) : ""}
        </div>
      )
    })
  }

  render() {
    return (
      <div>
        {this.state.orders.length !== 0 ? this.renderOrders() : <img className="loadingGif" src={loadingGif} /> }
        <PageChanger page_number={this.state.page_number} list_items={this.state.orders} requestMore={this.changePage} />
      </div>
    )
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(mapStateToProps, null)(Orders)