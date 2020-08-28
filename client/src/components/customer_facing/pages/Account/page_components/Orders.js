import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUsersOrders, lastOrder } from "../../../../../utils/API"
import LeaveReview from "../../../../shared/LeaveReview"
import PageChanger from "../../../../shared/PageChanger"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faExternalLinkAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom"
import { formatMoney } from "../../../../../utils/helpFunctions"
class Orders extends Component {
  constructor(props) {
    super()
    this.changePage = this.changePage.bind(this)
    this.state = {
      orders: [],
      page_number: 1,
      chosen_order: null,
      retry: 0,
      last_order: null
    }
  }

  async componentDidMount() {
    if (this.props.auth) {
      const orders = await this.props.getUsersOrders(this.props.auth._id, "none", "none")
      const last_order = await this.props.lastOrder(this.props.auth._id).then(res => res.data)

      this.setState({ orders: orders.data, last_order })
    }
  }

  async componentDidUpdate() {
    if (this.state.orders.length === 0 && this.state.retry < 3) {
      const orders = await this.props.getUsersOrders(this.props.auth._id, "none", "none")
      this.setState({ orders: orders.data, retry: this.state.retry + 1 })
    }
  }

  setOrder(order) {
    if (order._id === this.state.chosen_order) {
      this.setState({ chosen_order: null })
    } else {
      this.setState({ chosen_order: order._id })
    }
  }

  orderData(order) {
    var date = order.date_placed.split("T")[0]
    return  (
      <div className="w-95 margin-auto-h padding-xs" style={{ backgroundColor: 'rgb(111, 111, 111)' }}>
        <div>
          <h2 className="margin-xs-v underline">Line Items</h2>
          {order.shipment && order.shipment.line_items.map((line_item, index) => {
            return (
              <>
                <div key={index} className="flex align-items-center">
                  <div>
                    <div className="margin-auto-v flex justify-center align-items-center background-color-black" style={{ maxHeight: "125px", maxWidth: "125px", minHeight: "125px", minWidth: "125px",  marginRight: "10px" }}>
                      <img className="h-w-auto margin-auto-h" style={{ maxHeight: "125px", maxWidth: "125px" }} src={line_item.image}  />
                    </div>
                  </div>
                  <div className="margin-s-h">
                    <h3 className="margin-s-v"><Link to={line_item.product_path}>{line_item.product_name}</Link></h3>
                    <div><span className="store_text_color">Price:</span> {line_item.product_price}</div>
                    <div><span className="store_text_color">Quantity:</span> {line_item.quantity}</div>
                    <LeaveReview order_id={order._id} line_item={line_item} />
                  </div>
                </div>
                <hr />
              </>
            )
          })}
        </div>
        <div><span className="bold store_text_color">Sub Total:</span> ${formatMoney(order.sub_total)}</div>
        <div><span className="bold store_text_color">Tax:</span> ${formatMoney(order.tax)}</div>
        <div><span className="bold store_text_color">Shipping:</span> ${formatMoney(order.shipment.chosen_rate.cost)}</div>
        <div><span className="store_text_color bold">Total:</span> ${formatMoney(order.total)}</div>
        <div><span className="store_text_color bold">Date Place:</span> {date}</div>
      </div>
    )
  }

  async changePage(direction_reference_id, direction, page_increment) {
    const orders = await this.props.getUsersOrders(this.props.auth._id, direction_reference_id, direction)
    this.setState({ orders: orders.data, page_number: this.state.page_number + page_increment })
  }

  renderOrders() {
    return this.state.orders.map((order, index) => {
      var date = order.date_placed.split("T")[0]
      return (
        <div key={index}>
          <div className="flex space-between margin-xs-v padding-s" style={{ backgroundColor: 'rgb(45, 45, 45)' }} data-order-tab={order._id}>        
            <FontAwesomeIcon className="store_text_color" icon={faCaretDown} onClick={ () => this.setOrder(order) } />
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
    let lastPossibleItem = false
    if (this.state.orders && this.state.orders.length > 0 && this.state.last_order) {
      if (this.state.orders[this.state.orders.length - 1]._id === this.state.last_order._id) {
        lastPossibleItem = true
      }
    }
    return (
      <div>
        {this.state.orders.length !== 0 ? this.renderOrders() : <FontAwesomeIcon icon={faSpinner} className="loadingGif loadingGifCenterScreen" spin /> }
        <PageChanger 
          page_number={this.state.page_number} 
          list_items={this.state.orders} 
          requestMore={this.changePage} 
          lastPossibleItem={lastPossibleItem}           
          />
      </div>
    )
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

const actions = { getUsersOrders, lastOrder }

export default connect(mapStateToProps, actions)(Orders)