import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateCart } from "../../actions"
import mobile from "is-mobile"
import Modal from "./Modal"
import { calculateSubtotal, formatMoney } from '../../utils/helpFunctions'

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
    console.log(out_of_stock_items)

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
      
      cart.line_items = cart.line_items.filter((item) => item !== null)


      let sub_total = calculateSubtotal(cart)
      let tax = sub_total * .08
      let shipping = cart.chosen_rate ? cart.chosen_rate.cost : 0

      cart.sub_total = formatMoney(sub_total)
      cart.tax = formatMoney(tax)
      cart.total = formatMoney(sub_total + tax + shipping)
  
      let update_cart = await this.props.updateCart(cart)
      if (this.props.update) {
        this.props.update(update_cart)
      }
    }

  }


  render() {
    return (
      <Modal cancel={this.props.cancel} >
        <h3>{this.props.title}</h3>
        {this.props.out_of_stock_items.filter((item) => item !== null).map((item) => {
          return (
            <p style={{ fontSize: "18px" }}>{item.product_name}</p>
          )
        })}

        <button onClick={this.props.cancel} className="margin-auto-h">Okay</button>
      </Modal>

    )
  }
}

const actions = { updateCart }

export default connect(null, actions)(LowInventory)