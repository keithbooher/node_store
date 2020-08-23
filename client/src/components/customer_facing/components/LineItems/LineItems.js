import React, { Component } from 'react'
import { connect } from 'react-redux'
import './line_item.css.scss'
import { calculateSubtotal, formatMoney } from '../../../../utils/helpFunctions'
import { updateCart, dispatchEnlargeImage } from "../../../../actions"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faMinus, faTrash, faSlash } from "@fortawesome/free-solid-svg-icons"
import { checkInventory } from "../../../../utils/API"
import LowInventory from "../../../shared/LowInventory"
import { Link } from "react-router-dom"
class LineItems extends Component {
  constructor(props) {
    super()
    this.removeProduct = this.removeProduct.bind(this)
    this.alterLineItemQuantity = this.alterLineItemQuantity.bind(this)
    this.state = {
      inventory_limit: false,
      lock: false
    }
  }

  componentDidMount() {
    if (window.location.pathname === "/checkout") {
      this.setState({ lock: true })
    }
  }

  async alterLineItemQuantity(incoming_line_item, operator) {
    let cart = {...this.props.cart}
    let items = cart.line_items

    await Promise.all(items.map(async (line_item) => {
      let item = {...line_item}
      if(incoming_line_item._product_id === line_item._product_id && operator === 'addition') {
        item.quantity += 1
        let { data } = await this.props.checkInventory([item])
        let out_of_stock = data.filter((oos_item) => oos_item !== null)
        if (out_of_stock.length > 0) {
          this.setState({ inventory_limit: [item] })
          return
        }
      } else if (incoming_line_item._product_id === line_item._product_id && operator === 'subtraction') {
        item.quantity += -1
      }
      return item
    })).then((values) => {
      cart.line_items = values
    })

    if (this.state.inventory_limit !== false) return

    let removed_zero_quantity_items = cart.line_items.filter((line_item) => line_item.quantity > 0 )
    cart.line_items = removed_zero_quantity_items
    
    let sub_total = Number(calculateSubtotal(cart))
    let tax = Number(sub_total * .08)
    let shipping = Number(cart.chosen_rate ? cart.chosen_rate.cost : 0)

    cart.sub_total = sub_total
    cart.tax = tax
    cart.total = Number(sub_total + tax + shipping)

    this.props.updateCart(cart)
  }

  removeProduct(incoming_line_item) {
    const cart = this.props.cart

    const current_cart_line_items = cart.line_items

    let updated_line_items = current_cart_line_items.filter((line_item) => {
      return incoming_line_item._id !== line_item._id
    })
    cart.line_items = updated_line_items

    let sub_total = calculateSubtotal(cart)
    let tax = formatMoney(sub_total * .08)

    cart.sub_total = sub_total
    cart.tax = tax
    cart.total = formatMoney(sub_total + tax)
    
    this.props.updateCart(cart)
  }

  enlargeImage(image, path) {
    this.props.dispatchEnlargeImage({ image, path })
  }

  render() {
    let low_inventory_message = this.state.inventory_limit && `Oops, thats all that's in stock for`
    let lock = this.state.lock
    return (
      <>
        {this.props.cart && 
          this.props.cart.line_items.map((line_item, index) => {
            return (
              <li key={index} className="divider line_item padding-s ">

                <div className="line_item_sub_container">

                  <div className="flex">
                    <div className="margin-auto-v flex justify-center align-items-center background-color-black" style={{ maxHeight: "125px", maxWidth: "125px", minHeight: "125px", minWidth: "125px" }}>
                      <img onClick={() => this.enlargeImage(line_item.image, line_item.product_path)} className="h-w-auto margin-auto-h" style={{ maxHeight: "125px", maxWidth: "125px" }} src={line_item.image} />
                    </div>

                    <div className="flex flex_column padding-s">
                      <h2 className="margin-top-none margin-bottom-none color-black line_item_name"><Link className="inline" onClick={this.props.expandCart} to={line_item.product_path}>{line_item.product_name}</Link><div className="inline" style={{ fontSize: "14px" }}> - ${line_item.product_price}/ea</div></h2>
                      <p>${line_item.product_price * line_item.quantity}</p>
                      <div style={{ fontSize: "15px", padding: "10px 5px" }} className="flex color-black margin-auto-v">
                        <div style={{ fontSize: "23px", marginTop: "-5px", marginRight: "5px", fontWeight: 700 }} className="color-black line_item_quantity">x{line_item.quantity}</div>
                        <i className={`color-black margin-s-h ${lock && "display-none"}`} onClick={() => this.alterLineItemQuantity(line_item, 'addition')}>
                          <FontAwesomeIcon icon={faPlus} />
                        </i>
                        <div className={`inline ${lock && "display-none"}`} style={{ fontSize: "19px", marginLeft: "-5px", marginRight: "-5px" }}>/</div>
                        <i style={{ marginTop: "3px" }} className={`color-black margin-s-h ${lock && "display-none"}`} onClick={() => this.alterLineItemQuantity(line_item, 'subtraction')}>
                          <FontAwesomeIcon icon={faMinus} />
                        </i>
                        <i style={{ fontSize: "14px", top: "0px", right: "0px" }} className={`color-black absolute ${lock && "display-none"}`} onClick={() => this.removeProduct(line_item)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </i>
                      </div>
                    </div>
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

function mapStateToProps({ enlargeImage }) {
  return { enlargeImage }
}

const actions = { updateCart, dispatchEnlargeImage, checkInventory }

export default connect(mapStateToProps, actions)(LineItems)