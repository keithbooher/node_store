import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getOrder } from "../../../../utils/API"
import { Link } from "react-router-dom"
import LeaveReview from "../../../shared/LeaveReview"
import AddressDisplay from "../../../shared/AddressDisplay"
import MetaTags from 'react-meta-tags'
import { formatMoney } from "../../../../utils/helpFunctions"
class OrderPage extends Component {
  constructor(props) {
    super()
    this.routeParamOrderId = props.match.params.id

    this.state = {
      order: null
    }
  }

  async componentDidMount() {
    const { data } = await this.props.getOrder(this.routeParamOrderId)

    this.setState({ order: data })
  }

  render() {
    const order = this.state.order

    return (
      <div style={{ paddingBottom: "80px" }}>
        <MetaTags>
          <title>Node Store Order Review</title>
          <meta name="description" content="Review a past order" />
          <meta name="keywords" content="" />
        </MetaTags>
        <h1>Your Order</h1>
        {order &&
          <div style={this.props.mobile ? {} : {fontSize: "20px"} }>
            <div className={!this.props.mobile && "flex"}>
              <div className={!this.props.mobile && "w-50"}>
                <div><span className="store_text_color">Order ID:</span> {order._id}</div>
                <div><span className="store_text_color">Status:</span> {order.status}</div>
                <div><span className="store_text_color">Customer:</span> {order.email}</div>
                <div><span className="store_text_color">Date Placed:</span> {order.date_placed}</div>
              </div>

              <div className={!this.props.mobile && "w-50"}>
                <div><span className="store_text_color">Sub Total:</span> ${formatMoney(order.sub_total)}</div>
                <div><span className="store_text_color">Tax:</span> ${formatMoney(order.tax)}</div>
                <div><span className="store_text_color">Shipping:</span> ${formatMoney(order.shipment.chosen_rate.cost)}</div>
                <div><span className="store_text_color">Total:</span> {formatMoney(order.total)}</div>
              </div>
            </div>

            <hr/>
            <h2>Items Purchased</h2>
            {this.props.mobile ? <MobileLineItems order={order} line_items={order.shipment.line_items} /> : <DesktopLineItems order={order} line_items={order.shipment.line_items} /> }


            <h2>Billing</h2>
            <AddressDisplay address={order.shipment.billing_address} />
            <h2>Shipping</h2>
            <AddressDisplay address={order.shipment.shipping_address} />
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps({ mobile }) {
  return { mobile }
}

const actions = { getOrder }

export default connect(mapStateToProps, actions)(OrderPage)


const MobileLineItems = ({ line_items, order }) => {

  return (
    <>
      {line_items.map((item, index) => {
        return (
          <div key={index} className="flex flex_column align-items-center">
            <div className="border-radius-s flex flex_column justify-center background-color-black" style={{ height: "300px", width: "300px", maxHeight: "300px", maxWidth: "300px" }}>
              <img style={{ height: "auto", width: "auto", maxHeight: "300px", maxWidth: "300px" }} src={item.image} />
            </div>
            <div className="flex space-evenly w-90" style={{ margin: ".9em auto" }}>
              <div>
                <div className="bold"><Link to={item.product_path}>{item.product_name}</Link></div>
                <div><span className="store_text_color bold">Quantity:</span> {item.quantity}</div>
                <div><span className="store_text_color bold">Price Each:</span> ${item.product_price}</div>
              </div>
              <LeaveReview order_id={order._id} line_item={item} />
            </div>
          </div>
        )
      })}
    </>
  )
}


const DesktopLineItems = ({ line_items, order }) => {

  return (
    <div className="flex" style-={{ }}>
      {line_items.map((item, index) => {
        return (
          <div key={index} className="flex flex_column align-items-center st-product-card-background padding-s" style={{ width: "15em", margin: "10px" }}>
            <div className="border-radius-s flex justify-center background-color-black"  style={{ height: "300px", width: "300px", maxHeight: "300px", maxWidth: "300px" }} >
              <img style={{ height: "auto", width: "auto", maxHeight: "300px", maxWidth: "300px" }} src={item.image} />
            </div>
            <div className="flex space-evenly w-90" style={{ margin: ".9em auto" }}>
              <div>
                <div className="bold"><Link to={item.product_path}>{item.product_name}</Link></div>
                <div><span className="store_text_color bold">Quantity:</span> {item.quantity}</div>
                <div><span className="store_text_color bold">Price Each:</span> ${item.product_price}</div>
              </div>
              <LeaveReview order_id={order._id} line_item={item} />
            </div>
          </div>
        )
      })}
    </div>
  )
}