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
      <td colspan="3">
        <div  className={`theme-background-4 margin-auto-h w-90 ${this.props.mobile ? "padding-xs" : "padding-s"}`} style={this.props.mobile ? {} : { fontSize: "18px" }}>
          <h2 className="margin-xs-v">Products Purchased</h2>
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
                    <h3 className="margin-s-v"><Link to={line_item.product_path} style={this.props.mobile ? {} : { fontSize: "25px" }}>{line_item.product_name}</Link></h3>
                    <div><span className="store_text_color">Price:</span> {line_item.product_price}</div>
                    <div><span className="store_text_color">Quantity:</span> {line_item.quantity}</div>
                    <LeaveReview order_id={order._id} line_item={line_item} />
                  </div>
                </div>
                <hr />
              </>
            )
          })}
          <div><span className="bold store_text_color">Sub Total:</span> ${formatMoney(order.sub_total)}</div>
          <div><span className="bold store_text_color">Tax:</span> ${formatMoney(order.tax)}</div>
          <div><span className="bold store_text_color">Shipping:</span> ${formatMoney(order.shipment.chosen_rate.cost)}</div>
          <div><span className="store_text_color bold">Total:</span> ${formatMoney(order.total)}</div>
          <div><span className="store_text_color bold">Date Place:</span> {date}</div>
        </div>
      </td>
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
        <>
          <tr key={index} style={this.props.mobile ? { backgroundColor: 'rgb(45, 45, 45)' } : { fontSize: "26px", backgroundColor: 'rgb(45, 45, 45)' }} data-order-tab={order._id}>
              <td className={`flex ${this.props.mobile ? "padding-s" : "padding-xs" }`}>
                <FontAwesomeIcon className="store_text_color hover hover-color-5" icon={faCaretDown} onClick={ () => this.setOrder(order) } />
                <div className="margin-s-h">{this.props.mobile ? "..." + order._id.substr(order._id.length - 8) : order._id }</div>
              </td>
              <td className={`text-align-center ${this.props.mobile ? "padding-s" : "padding-xs" }`}>{date}</td>
              <td className={`text-align-center ${this.props.mobile ? "padding-s" : "padding-xs" }`}><Link to={`/order/${order._id}`}><FontAwesomeIcon icon={faExternalLinkAlt} onClick={ () => this.setOrder(order) } /></Link></td>
          </tr>
          { this.state.chosen_order === order._id ? <tr>{this.orderData(order)}</tr> : "" }
        </>
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
        <div>
          <table style={ this.props.mobile ? { width: "100%", margin: "20px auto" } : { margin: "30px auto", minWidth: "625px", width: "80%" } }>
            <thead>
              <tr className="theme-background-2" style={this.props.mobile ? {} : { fontSize: "25px" }}>
                <th className="store_text_color text-align-left" style={this.props.mobile ? { padding: "10px 5px" } :{ padding: "15px 5px 15px 10px" }}>{this.props.mobile ? "Order #" : "Order Number"}</th>
                <th className="store_text_color" style={this.props.mobile ? { padding: "10px 5px" } :{ padding: "15px 5px" }}>Placed On</th>
                <th className="store_text_color" style={this.props.mobile ? { padding: "10px 5px" } :{ padding: "15px 5px" }}>Link</th>
              </tr>
            </thead>
            <tbody>
              {this.state.orders.length !== 0 ? this.renderOrders() : <FontAwesomeIcon icon={faSpinner} className="loadingGif loadingGifCenterScreen" spin /> }
            </tbody>
          </table>
          <PageChanger 
            page_number={this.state.page_number} 
            list_items={this.state.orders} 
            requestMore={this.changePage} 
            lastPossibleItem={lastPossibleItem}           
            />
        </div>
      </div>
    )
  }
}

function mapStateToProps({ auth, mobile }) {
  return { auth, mobile }
}

const actions = { getUsersOrders, lastOrder }

export default connect(mapStateToProps, actions)(Orders)