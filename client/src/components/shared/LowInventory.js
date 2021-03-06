import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateCart } from "../../actions"
import mobile from "is-mobile"
import Modal from "./Modal"
import { calculateSubtotal, formatMoney, discountCodeAssignments } from '../../utils/helpFunctions'

let isMobile = mobile()
class LowInventory extends Component {
  constructor(props) {
    super()

    this.state = {

    }
  }

  async componentDidMount() {
    let cart = this.props.cart
    let out_of_stock_items = this.props.out_of_stock_items

    if (this.props.adjust) {
      out_of_stock_items = out_of_stock_items.filter((item) => item !== null).map((item) => {
        return {_id: item._id, inventory_count: item.inventory_count}
      })
  
      cart.line_items = cart.line_items.map((item) => {
        let remove
  
        out_of_stock_items.forEach(oos_item => {
          if (oos_item._id === item._id && oos_item.inventory_count < 1) {
            remove = true
          } else if (oos_item._id === item._id) {
            item.quantity = oos_item.inventory_count
            remove = false
          } else {
            remove = false
          }
        })
  
        if (remove) {
          return null
        } else {
          return item
        }
      })

      let discount_code
      if (cart.discount_codes.length > 0) {
        discount_code = cart.discount_codes[0]
      }
      
      cart.line_items = cart.line_items.filter((item) => item !== null)

      let sub_total = Number(calculateSubtotal(cart))

      if (cart.discount_codes.length > 0) {
        if (discount_code.affect_order_total) {
          cart.discount = discount_code.percentage !== null ? discount_code.percentage : discount_code.flat_price
        } else {
          cart = discountCodeAssignments(discount_code, cart)
          sub_total = Number(calculateSubtotal(cart))
        }
      }

      if (sub_total < 0) {
        sub_total = 0
      }
      
      let tax = Number(sub_total * .08)
      if (this.props.noTaxSetting) {
        tax = 0
      }
      let shipping = Number(cart.chosen_rate ? cart.chosen_rate.cost : 0)
  
      cart.sub_total = sub_total
      cart.tax = tax

      if (discount_code && discount_code.affect_order_total && discount_code.percentage !== null) {
        cart.total = Number((sub_total + tax + shipping) * (cart.discount/100))
      } else if (discount_code && discount_code.affect_order_total && discount_code.flat_price !== null) {
        cart.total = Number(sub_total + tax + shipping - cart.discount)
      } else {
        cart.total = Number(sub_total + tax + shipping)
      }
      
      let update_cart = await this.props.updateCart(cart)
      if (this.props.update) {
        this.props.update(update_cart.data)
      }
    }

  }


  render() {
    return (
      <Modal cancel={this.props.cancel} >
        <h3>{this.props.title}</h3>
        {this.props.out_of_stock_items.filter((item) => item !== null).map((item, index) => {
          return (
            <p key={index} style={{ fontSize: "18px" }}>{item.product_name}</p>
          )
        })}

        <button onClick={this.props.cancel} className="margin-auto-h">Okay</button>
      </Modal>

    )
  }
}

function mapStateToProps({ noTaxSetting }) {
  return { noTaxSetting }
}

const actions = { updateCart }

export default connect(mapStateToProps, actions)(LowInventory)