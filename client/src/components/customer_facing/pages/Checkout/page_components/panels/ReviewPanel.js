import React, { Component } from 'react'
import { connect } from 'react-redux'
import { convertCart, createCart } from '../../../../../../actions'
import { orderConfirmation, getCurrentCart, ownerEmail } from "../../../../../../utils/API"
import { Link } from "react-router-dom"
import { LazyLoadImage } from 'react-lazy-load-image-component'

const newCart = (email, user_id) => {
  let date = new Date()
  const today = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()

  let replacement_cart = {
    checkout_state: "shopping",
    line_items: [],
    email: email,
    _user_id: user_id,
    sub_total: 0,
    total: 0,
    billing_address: null,
    shipping_address: null,
    created_at: today,
    deleted_at: null,
    chosen_rate: null,
    tax: 0
  }

  return replacement_cart
}

class ReviewPanel extends Component  {
  constructor(props) {
    super()
    this.state = {

    }
  }

  async componentDidMount() {
    this.props.orderConfirmation(this.props.new_order.email, this.props.new_order._id)
    this.props.ownerEmail(this.props.new_order._id)
    this.props.convertCart(null)
    // create new cart for customer or guest to replace cart (to avoid errors)
    if (this.props.auth === "000000000000000000000000") {
      // if guest, then create a new cart for them
      await this.props.createCart(newCart(this.props.new_order.email, this.props.auth._id))
    } else {
      // if returning customer, then create a new cart for them if they dont have any open carts. 
      // Otherwise just make a new cart.
      let users_cart = await this.props.getCurrentCart(this.props.auth._id)
      if (!users_cart || !users_cart.data) {
        await this.props.createCart(newCart(this.props.new_order.email, this.props.auth._id))
      } else {
        this.props.convertCart(users_cart.data)
      }
    }
    

  }
  
  render() {
    // This panel is for show the user that they have successfully placed 
    // their order and to show them their order number
    return (
      <div>

        <h1>Thank you for your order!</h1>

        <h2>An order confirmation email has been sent to your inbox. If you dont immediately see the email please check your spam!</h2>

        <div>Order #: <Link to={`/order/${this.props.new_order._id}`}>{this.props.new_order._id}</Link></div>

        <h2>Products Purchased</h2>
        <div>
          {this.props.new_shipment.line_items.map((line_item, index) => {
            return (
              <div className="flex align-items-center margin-s-v">
                <div className="margin-auto-v flex justify-center align-items-center background-color-black" style={{ maxHeight: "150px", maxWidth: "150px", minHeight: "150px", minWidth: "150px" }}>
                  <LazyLoadImage
                    style={{ height: "auto", width: "auto", maxHeight: "150px", maxWidth: "150px" }}
                    src={line_item.image}
                    onClick={() => this.enlargeImage(line_item.image, line_item.product_path)}
                  />
                </div>
                <div className="color-white">
                  <h3 className="margin-s-v">{line_item.product_name}</h3>
                  <div><span className="store_text_color">Quantity: </span>{line_item.quantity}</div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    )
  }
}

function mapStateToProps({ cart, auth }) {
  return { cart, auth }
}

const actions = { ownerEmail, convertCart, orderConfirmation, createCart, getCurrentCart }

export default connect(mapStateToProps, actions)(ReviewPanel)