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
    this.displayDiscount = this.displayDiscount.bind(this)
    this.discountDisplaySwitch = this.discountDisplaySwitch.bind(this)
    this.state = {
      order: null
    }
  }

  async componentDidMount() {
    const { data } = await this.props.getOrder(this.routeParamOrderId)

    this.setState({ order: data })
  }

  displayDiscount(line_item) {
    let discount_amount = 0
    if (this.state.order.discount_codes && this.state.order.discount_codes.length > 0) {
      if (this.state.order.discount_codes[0].flat_price !== null) {
        discount_amount = line_item.product_price - line_item.discount
      } else {
        discount_amount = line_item.product_price * (line_item.discount/100)
      }
    }
    return discount_amount
  }

  discountDisplaySwitch(line_item) {
    if (!line_item.discount || line_item.discount === null || line_item.discount === 0 || line_item.discount === NaN ) {
      return false
    }
    return true
  }

  render() {
    const order = this.state.order
    console.log(order)
    return (
      <div className={`${ this.props.mobile ? "" : "max-customer-container-width margin-auto-h" }`} style={{ padding: ".4em .4em 100px .4em" }}>
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
                <div className="margin-xs-v"><span className="store_text_color">Order ID:</span> {order._id}</div>
                <div className="margin-xs-v"><span className="store_text_color">Status:</span> {order.status}</div>
                <div className="margin-xs-v"><span className="store_text_color">Customer:</span> {order.email}</div>
                <div className="margin-xs-v"><span className="store_text_color">Date Placed:</span> {order.date_placed}</div>
              </div>
              {this.props.mobile && 
                <>
                  <br />
                  <hr />
                  <br />
                </>
              }
              <div className={!this.props.mobile && "w-50"}>
                <div className="margin-xs-v"><span className="store_text_color">Sub Total:</span> ${formatMoney(order.sub_total)}</div>
                <div className="margin-xs-v"><span className="store_text_color">Tax:</span> ${formatMoney(order.tax)}</div>
                <div className="margin-xs-v"><span className="store_text_color">Shipping:</span> ${formatMoney(order.shipment.chosen_rate.cost)}</div>
                <div className="margin-xs-v"><span className="store_text_color">Total:</span> {formatMoney(order.total)}</div>
                {order.discount_codes.length > 0 && 
                  <div><span className="store_text_color">Discount Code:</span> {order.discount_codes[0].affect_order_total ?
                    <span>{order.discount_codes[0].discount_code} - {order.discount_codes[0].flat_price !== null ? "$" + order.discount_codes[0].flat_price : order.discount_codes[0].percentage + "%"} off entire cart</span>
                  :
                    <span>{order.discount_codes[0].discount_code} - {order.discount_codes[0].flat_price !== null ? "$" + order.discount_codes[0].flat_price : order.discount_codes[0].percentage + "%"} off select product(s)</span>
                  }
                  </div>
                }
              </div>
            </div>
            {this.props.mobile && <br />}
            <hr/>
            <h2>Items Purchased</h2>
            {this.props.mobile ? <MobileLineItems discountDisplaySwitch={this.discountDisplaySwitch} displayDiscount={this.displayDiscount} order={order} line_items={order.shipment.line_items} /> : <DesktopLineItems discountDisplaySwitch={this.discountDisplaySwitch} displayDiscount={this.displayDiscount} order={order} line_items={order.shipment.line_items} /> }

            {order.customer_notes &&
              <>
                <h2>Order Notes</h2>
                <div>{order.customer_notes}</div>
              </>
            }
            
            <div className={!this.props.mobile && "flex margin-s-h"}>
              <div className={!this.props.mobile && "w-50"}>
                <h2>Billing</h2>
                <AddressDisplay address={order.shipment.billing_address} />
              </div>
              <div className={!this.props.mobile && "w-50"}>
                <h2>Shipping</h2>
                <AddressDisplay address={order.shipment.shipping_address} />
              </div>
            </div>
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


const MobileLineItems = ({ line_items, order, discountDisplaySwitch, displayDiscount }) => {

  return (
    <>
      {line_items.map((item, index) => {
        return (
          <div key={index} className="color-white flex flex_column align-items-center">
            <div className="border-radius-s flex flex_column justify-center background-color-black" style={{ height: "300px", width: "300px", maxHeight: "300px", maxWidth: "300px" }}>
              <img style={{ height: "auto", width: "auto", maxHeight: "300px", maxWidth: "300px" }} src={item.image} />
            </div>
            <div className="flex space-between" style={{ margin: ".9em auto" }}>
              <div>
                <div className="bold"><Link to={item.product_path}>{item.product_name}</Link></div>
                {item.varietal && item.varietal.size !== null && <div><span className="bold">Size:</span> {item.varietal.size.value}</div>}
                {item.varietal && item.varietal.color !== null && <div><span className="bold">Color:</span> {item.varietal.color.name}</div>}
                <div><span className="store_text_color bold">Quantity:</span> {item.quantity}</div>
                <div><span className="store_text_color bold">Price:</span> ${item.product_price}</div>
                {discountDisplaySwitch(item) &&
                  <div><span className="store_text_color bold">discount:</span> ${formatMoney(displayDiscount(item))}</div>
                }    
              </div>
              <LeaveReview order_id={order._id} line_item={item} />
            </div>
          </div>
        )
      })}
    </>
  )
}


const DesktopLineItems = ({ line_items, order, discountDisplaySwitch, displayDiscount }) => {

  return (
    <div className="flex" style-={{ }}>
      {line_items.map((item, index) => {
        return (
          <div key={index} className="color-white flex flex_column align-items-center st-product-card-background padding-m border-radius-s" style={{ width: "15em", margin: "10px" }}>
            <div className="border-radius-s flex justify-center background-color-black"  style={{ height: "300px", width: "300px", maxHeight: "300px", maxWidth: "300px" }} >
              <img style={{ height: "auto", width: "auto", maxHeight: "300px", maxWidth: "300px" }} src={item.image} />
            </div>
            <div className="w-90" style={{ margin: ".9em auto" }}>
              <div>
                <div className="bold margin-s-v"><Link to={item.product_path}>{item.product_name}</Link></div>
                {item.varietal && item.varietal.size !== null && <div><span className="bold">Size:</span> {item.varietal.size.value}</div>}
                {item.varietal && item.varietal.color !== null && <div><span className="bold">Color:</span> {item.varietal.color.name}</div>}
                <div><span className="store_text_color bold">Quantity:</span> {item.quantity}</div>
                <div><span className="store_text_color bold">Price:</span> ${item.product_price}</div>
                {discountDisplaySwitch(item) &&
                  <div><span className="store_text_color bold">discount:</span> ${formatMoney(displayDiscount(item))}</div>
                }    
              </div>
              <div style={{ marginTop: "20px" }}>
                <LeaveReview order_id={order._id} line_item={item} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}