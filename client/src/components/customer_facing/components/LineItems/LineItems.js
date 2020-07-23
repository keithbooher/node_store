import React, { Component } from 'react'
import { connect } from 'react-redux'
import './line_item.css.scss'
import { calculateSubtotal } from '../../../../utils/helperFunctions'
import { updateCart } from "../../../../actions"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faMinus, faTrash } from "@fortawesome/free-solid-svg-icons"
import { checkInventory } from "../../../../utils/API"
import LowInventory from "../../../shared/LowInventory"
class LineItems extends Component {
  constructor(props) {
    super()
    this.removeProduct = this.removeProduct.bind(this)
    this.alterLineItemQuantity = this.alterLineItemQuantity.bind(this)
    this.state = {
      inventory_limit: false
    }
  }

  async alterLineItemQuantity(incoming_line_item, operator) {
    const cart = this.props.cart
    let items = cart.line_items

    items.forEach(async (line_item) => {
      if(incoming_line_item._product_id === line_item._product_id && operator === 'addition') {
        let item = {...line_item}
        item.quantity += 1
        // CHECK IF NEW QUANTITY IS WITHIN STOCK LIMIT
        // IF NOT LET THEM KNOW THEY HIT LIMIT
        let { data } = await checkInventory([item])
        let out_of_stock = data.filter((oos_item) => oos_item !== null)
        console.log(out_of_stock)
        if (out_of_stock.length > 0) {
          console.log('here')
          this.setState({ inventory_limit: [line_item] })
          return
        }
      } else if (incoming_line_item._product_id === line_item._product_id && operator === 'subtraction') {
        line_item.quantity += -1
      }
    })

    
    console.log(cart.line_items)
    if (this.state.inventory_limit !== false) return

    // let removed_zero_quantity_items = cart.line_items.filter((line_item) => line_item.quantity > 0 )
    // cart.line_items = removed_zero_quantity_items
    
    // let sub_total = calculateSubtotal(cart)

    // cart.total = sub_total * .08
    // this.props.updateCart(cart)
  }

  removeProduct(incoming_line_item) {
    const cart = this.props.cart

    const current_cart_line_items = cart.line_items

    let updated_line_items = current_cart_line_items.filter((line_item) => {
      return incoming_line_item._id !== line_item._id
    })
    cart.line_items = updated_line_items

    let sub_total = calculateSubtotal(cart)

    cart.total = sub_total * .08
    this.props.updateCart(cart)
  }

  render() {
    console.log(this.state)
    let low_inventory_message = this.state.inventory_limit && `Oops, thats all that's in stock for`
    return (
      <>
        {this.props.cart && 
          this.props.cart.line_items.map((line_item) => {
            return (
              <li className="line_item padding-s ">

                <div className="line_item_sub_container">

                  <div className="flex">
                    <i className="color-black margin-s-h" onClick={() => this.alterLineItemQuantity(line_item, 'addition')}>
                      <FontAwesomeIcon icon={faPlus} />
                    </i>
                    <i className="color-black margin-s-h" onClick={() => this.alterLineItemQuantity(line_item, 'subtraction')}>
                      <FontAwesomeIcon icon={faMinus} />
                    </i>
                  </div>

                  <div className="color-black line_item_name">{line_item.product_name}</div>
                  <div className="color-black line_item_quantity">x{line_item.quantity}</div>

                  <div>
                    <i className="color-black" onClick={() => this.removeProduct(line_item)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </i>
                  </div>

                </div>

                {this.state.inventory_limit &&
                  <LowInventory 
                    title={low_inventory_message} 
                    cart={this.props.cart} 
                    out_of_stock_items={this.state.inventory_limit} 
                    cancel={() => this.setState({ inventory_limit: false })}
                  />
                }

              </li>
            )
          })
        }
      </>
    )
  }
}

function mapStateToProps({ cart }) {
  return { cart }
}

const actions = { updateCart }

export default connect(mapStateToProps, actions)(LineItems)