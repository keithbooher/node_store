import React, { Component } from 'react'
import { connect } from 'react-redux'
import './line_item.css.scss'
import { calculateSubtotal, formatMoney, revertProductDiscount } from '../../../../utils/helpFunctions'
import { updateCart, dispatchEnlargeImage, dispatchObj } from "../../../../actions"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faMinus, faTrash, faSlash, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons"
import { checkInventory, getProductbyId } from "../../../../utils/API"
import LowInventory from "../../../shared/LowInventory"
import { Link } from "react-router-dom"
import Form from "../../../shared/Form"
import Modal from "../../../shared/Modal"
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { reset } from "redux-form"

class LineItems extends Component {
  constructor(props) {
    super()
    this.removeProduct = this.removeProduct.bind(this)
    this.alterLineItemQuantity = this.alterLineItemQuantity.bind(this)
    this.submitQuantity = this.submitQuantity.bind(this)
    this.state = {
      inventory_limit: false,
      lock: false,
      showModal: false,
      viewGiftNote: false
    }
  }

  componentDidMount() {
    if (window.location.pathname === "/checkout") {
      this.setState({ lock: true })
    }
  }

  async alterLineItemQuantity(incoming_line_item, operator) {
    let cart = this.props.cart
    let items = cart.line_items

    let inventory_limit

    await Promise.all(items.map(async (line_item) => {
      let item = {...line_item}
      if (line_item.varietal !== null) {
        inventory_limit = await checkVarietalInv_increment((state) => this.setState(state), this.props.checkInventory, line_item, incoming_line_item, item, operator)
      } else {
        inventory_limit = await checkProductInv_increment((state) => this.setState(state), this.props.checkInventory, line_item, incoming_line_item, item, operator)
      }
      return line_item
    })).then((values) => {
      cart.line_items = values
    })

    if (inventory_limit) return

    let removed_zero_quantity_items = cart.line_items.filter((line_item) => line_item.quantity > 0 )
    cart.line_items = removed_zero_quantity_items

    if (cart.discount_codes.length > 0 && !cart.discount_codes[0].affect_order_total) {
      // UNDO PRODUCT PRICE ALTERATIONS
      cart.line_items = revertProductDiscount(cart)
    }

    cart.discount_codes = []
    cart.discount = null
    
    let sub_total = Number(calculateSubtotal(cart))

    let tax = Number(sub_total * .08)
    if (this.props.noTaxSetting) {
      tax = 0
    }
    let shipping = Number(cart.chosen_rate ? cart.chosen_rate.cost : 0)

    cart.sub_total = sub_total
    cart.tax = tax
    cart.total = Number(sub_total + tax + shipping)

    this.props.updateCart(cart)
  }

  async removeProduct(incoming_line_item) {
    const cart = this.props.cart

    const current_cart_line_items = cart.line_items

    let updated_line_items = current_cart_line_items.filter((line_item) => {
      return incoming_line_item._id !== line_item._id
    })
    cart.line_items = updated_line_items

    if (cart.discount_codes.length > 0 && !cart.discount_codes[0].affect_order_total) {
      // UNDO PRODUCT PRICE ALTERATIONS
      cart.line_items = revertProductDiscount(cart)
    }

    cart.discount_codes = []
    cart.discount = null

    let sub_total = Number(calculateSubtotal(cart))
    let tax = Number(sub_total * .08)
    if (this.props.noTaxSetting) {
      tax = 0
    }
    let shipping = Number(cart.chosen_rate ? cart.chosen_rate.cost : 0)

    cart.sub_total = sub_total
    cart.tax = tax
    cart.total = Number(sub_total + tax + shipping)

    cart.checkout_state = "shopping"
    if (cart.line_items.length < 1) {
      cart.chosen_rate = null
    }
    this.props.updateCart(cart)
  }

  enlargeImage(image, path) {
    this.props.dispatchEnlargeImage({ image, path })
  }

  async submitQuantity() {
    const quantity_value = this.props.form['change_line_item_quantity_form'].values.quantity
    let cart = {...this.props.cart}
    let items = cart.line_items

    let inventory_limit

    await Promise.all(items.map(async (line_item) => {
      if (line_item.varietal !== null && this.state.showModal) {
        inventory_limit = await checkVarietalInv_quantity((state) => this.setState(state), this.props.checkInventory, line_item, this.state.showModal, quantity_value)
      } else if (this.state.showModal) {
        inventory_limit = await checkProductInv_quantity((state) => this.setState(state), this.props.checkInventory, line_item, this.state.showModal, quantity_value)
      }
      return line_item
    })).then((values) => {
      cart.line_items = values
    })

    if (inventory_limit) return

    if (cart.discount_codes.length > 0 && !cart.discount_codes[0].affect_order_total) {
      // UNDO PRODUCT PRICE ALTERATIONS
      cart.line_items = revertProductDiscount(cart)
    }

    cart.discount_codes = []
    cart.discount = null

    let sub_total = Number(calculateSubtotal(cart))
    let tax = Number(sub_total * .08)
    if (this.props.noTaxSetting) {
      tax = 0
    }
    let shipping = Number(cart.chosen_rate ? cart.chosen_rate.cost : 0)

    cart.sub_total = sub_total
    cart.tax = tax
    cart.total = Number(sub_total + tax + shipping)
    cart.checkout_state = "shopping"
    
    this.props.updateCart(cart)
    this.props.dispatchObj(reset("change_line_item_quantity_form"))
    this.setState({ showModal: false })
  }

  displayDiscount(line_item) {
    let discount_amount
    if (this.props.cart.discount_codes.length > 0) {
      if (this.props.cart.discount_codes[0].flat_price !== null) {
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
    let low_inventory_message = this.state.inventory_limit && `Oops, thats all that's in stock for`
    let lock = this.state.lock
    return (
      <>
        {this.props.cart && 
          this.props.cart.line_items.map((line_item, index) => {
            return (
              <li key={index} className="divider line_item flex align-items-center relative padding-s-v" style={{ minHeight: "150px" }}>

                <div className="line_item_sub_container">

                  <div className="flex">
                    <div 
                      className="hover margin-auto-v flex justify-center align-items-center background-color-black border-radius-s" 
                      style={this.props.mobile ? { maxHeight: "125px", maxWidth: "125px", minHeight: "125px", minWidth: "125px" } : { maxHeight: "175px", maxWidth: "175px", minHeight: "175px", minWidth: "175px" } }
                    >
                      <img 
                        onClick={() => this.enlargeImage(line_item.image, line_item.product_path)} 
                        className="h-w-auto margin-auto-h" 
                        style={ this.props.mobile ? { maxHeight: "125px", maxWidth: "125px" } : { maxHeight: "175px", maxWidth: "175px" } } 
                        src={line_item.varietal ? line_item.varietal.images.i1 : line_item.image} 
                      />
                    </div>

                    <div className="padding-s flex flex_column space-evenly">
                      <h3 className="margin-top-none margin-bottom-none line_item_name" style={ this.props.mobile ? {} : { fontSize: "30px" }}><Link className="inline a-invert" onClick={this.props.expandCart} to={line_item.product_path}>{line_item.product_name}</Link></h3>
                      {line_item.gift_note && <a onClick={() => this.setState({ viewGiftNote: line_item.gift_note })} className="margin-top-none margin-bottom-none" style={ this.props.mobile ? {} : { fontSize: "23px" }}>Gift Note</a>}
                      <div className="color-black bold margin-s-v" style={ this.props.mobile ? {} : { fontSize: "23px" }}>${formatMoney(line_item.product_price)}</div>
                      {this.discountDisplaySwitch(line_item) &&
                        <div className="color-black bold ">discount: ${formatMoney(this.displayDiscount(line_item))}</div>
                      }
                      <div style={{ fontSize: "14px" }}className="flex align-items-center color-black">
                        <FontAwesomeIcon className="hover hover-color-3 color-white theme-background-3 padding-s border-radius-s margin-xs-h" onClick={() => this.alterLineItemQuantity(line_item, 'subtraction')} icon={faMinus} />
                        <input 
                          onChange={(e) => console.log(e)} 
                          onFocus={() => this.setState({ showModal: line_item })} 
                          value={line_item.quantity} 
                          style={{ width: "100%", maxWidth: "45px" }}
                        />
                        <FontAwesomeIcon className="hover hover-color-3 color-white theme-background-3 padding-s border-radius-s margin-xs-h" onClick={() => this.alterLineItemQuantity(line_item, 'addition')} icon={faPlus} />
                      </div>

                    </div>
                  </div>
                </div>
                <i style={this.props.mobile ? { fontSize: "14px", top: "5px", right: "5px" } : {fontSize: "18px", top: "5px", right: "10px" }} className={`hover color-black absolute ${lock && "display-none"}`} onClick={() => this.removeProduct(line_item)}>
                  <FontAwesomeIcon className="hover-color-8" icon={faTrash} />
                </i>

                {this.state.inventory_limit &&
                  <LowInventory 
                    title={low_inventory_message} 
                    cart={this.props.cart} 
                    out_of_stock_items={this.state.inventory_limit} 
                    cancel={() => this.setState({ inventory_limit: false })}
                  />
                }

                {this.state.showModal &&
                  <Modal cancel={() => console.log('nothing')}>
                    <LazyLoadImage
                      style={{ height: "auto", width: "auto", maxHeight: "150px", maxWidth: "150px" }}
                      src={this.state.showModal.image}
                    />
                    <Form
                      onSubmit={this.submitQuantity}
                      submitButton={<button>Done</button>}
                      cancel={() => this.setState({ showModal: false })}
                      onChange={this.changeCartTab}
                      formFields={[{ label: `Update ${this.state.showModal.product_name} quantity`, name: 'quantity', typeOfComponent: "number", autofocus: true, noValueError: 'You must provide an quantity' }]}
                      form='change_line_item_quantity_form'
                      initialValues={{ quantity: this.state.showModal.quantity }}
                    />
                  </Modal>
                }
                {this.state.viewGiftNote &&
                  <Modal cancel={() => this.setState({ viewGiftNote: false })}>
                    <h3>{this.state.viewGiftNote}</h3>
                  </Modal>
                }

              </li>
            )
          })
        }
      </>
    )
  }
}

const checkVarietalInv_increment = async (setState, checkInventory, line_item, incoming_line_item, item, operator) => {
  if (line_item.varietal.id === incoming_line_item.varietal.id && operator === 'addition') {
    item.quantity += 1
    let { data } = await checkInventory([item])
    let out_of_stock = data.filter((oos_item) => oos_item !== null)
    if (out_of_stock.length > 0) {
      item.quantity += -1
      setState({ inventory_limit: [item] })
    }
  } else if (line_item.varietal.id === incoming_line_item.varietal.id && operator === 'subtraction') {
    item.quantity += -1
  }
}

const checkProductInv_increment = async (setState, checkInventory, line_item, incoming_line_item, item, operator) => {
  if(incoming_line_item._product_id === line_item._product_id && operator === 'addition') {
    item.quantity += 1
    let { data } = await checkInventory([item])
    let out_of_stock = data.filter((oos_item) => oos_item !== null)
    if (out_of_stock.length > 0) {
      item.quantity += -1
      setState({ inventory_limit: [item] })
    }
  } else if (incoming_line_item._product_id === line_item._product_id && operator === 'subtraction') {
    item.quantity += -1
  }
}








const checkVarietalInv_quantity = async (setState, checkInventory, line_item, incoming_line_item, quantity) => {
  let inventory_limit = false
  if (line_item && incoming_line_item && line_item.varietal.id === incoming_line_item.varietal.id) {
    let og_quantity = line_item.quantity     
    line_item.quantity = quantity 
    let { data } = await checkInventory([line_item])
    let out_of_stock = data.filter((oos_item) => oos_item !== null)
    if (out_of_stock.length > 0) {
      line_item.quantity = og_quantity
      setState({ inventory_limit: [line_item], showModal: false })
      inventory_limit = true
    }
  }
  return inventory_limit
}

const checkProductInv_quantity = async (setState, checkInventory, line_item, incoming_line_item, quantity) => {
  let inventory_limit = false
  if(line_item && incoming_line_item && incoming_line_item._product_id === line_item._product_id) {
    let og_quantity = line_item.quantity 
    line_item.quantity = quantity 
    let { data } = await checkInventory([line_item])
    let out_of_stock = data.filter((oos_item) => oos_item !== null)
    if (out_of_stock.length > 0) {
      line_item.quantity = og_quantity
      setState({ inventory_limit: [line_item], showModal: false })
      inventory_limit = true
    }
  }
  return inventory_limit
}







function mapStateToProps({ enlargeImage, form, cart, mobile, noTaxSetting }) {
  return { enlargeImage, form, cart, mobile, noTaxSetting }
}

const actions = { updateCart, dispatchEnlargeImage, checkInventory, dispatchObj, getProductbyId }

export default connect(mapStateToProps, actions)(LineItems)