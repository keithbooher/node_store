import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reset } from "redux-form"
import { Link } from 'react-router-dom'
import { calculateSubtotal, formatMoney } from '../../../../utils/helpFunctions'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faMinus, faTrash } from "@fortawesome/free-solid-svg-icons"
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Modal from "../../../shared/Modal"
import Form from "../../../shared/Form"
import { dispatchObj, updateCart, dispatchEnlargeImage } from "../../../../actions"
import { checkInventory } from "../../../../utils/API"
class LineItems extends Component {
  constructor(props) {
    super()
    this.submitQuantity = this.submitQuantity.bind(this)
    this.state = {
      inventory_limit: false,

    }
  }

  componentDidMount() {

  }

  async incrementLineItemQuantity(incoming_line_item, operator) {
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

    cart.discount_codes = []
    cart.discount_total = null

    cart.sub_total = sub_total
    cart.tax = tax
    cart.total = Number(sub_total + tax + shipping)
    cart.checkout_state = "shopping"

    await this.props.updateCart(cart)
  }

  submitQuantity() {
    const quantity_value = this.props.form['change_line_item_quantity_form'].values.quantity
    let cart = {...this.props.cart}
    cart.line_items.map((item) => {
      if (item._id === this.state.showModal._id) {
        item.quantity = quantity_value
        return item
      } else {
        return item
      }
    })
    cart.checkout_state = "shopping"
    this.props.updateCart(cart)
    this.props.dispatchObj(reset("change_line_item_quantity_form"))
    this.setState({ showModal: false })
  }
  
  enlargeImage(image, path) {
    this.props.dispatchEnlargeImage({ image, path })
  }

  removeProduct(incoming_line_item) {
    const cart = this.props.cart

    const current_cart_line_items = cart.line_items

    let updated_line_items = current_cart_line_items.filter((line_item) => {
      return incoming_line_item._id !== line_item._id
    })
    cart.line_items = updated_line_items

    let sub_total = Number(calculateSubtotal(cart))
    let tax = Number(sub_total * .08)
    let shipping = Number(cart.chosen_rate ? cart.chosen_rate.cost : 0)

    cart.discount_codes = []
    cart.discount_total = null
    
    cart.sub_total = sub_total
    cart.tax = tax
    cart.total = Number(sub_total + tax + shipping)
    if (cart.line_items.length < 1) {
      cart.chosen_rate = null
    }
    cart.checkout_state = "shopping"
    
    this.props.updateCart(cart)
  }

  render() {
    console.log(this.props)
    return (
      <div >
        {this.props.cart && this.props.cart.line_items.map((line_item, index) => {
          return (
            <>
              <div key={index} className="flex">
                <div 
                  className="hover margin-auto-v flex justify-center align-items-center background-color-black border-radius-s" 
                  style={this.props.mobile ? { maxHeight: "150px", maxWidth: "150px", minHeight: "150px", minWidth: "150px" } : { maxHeight: "250px", maxWidth: "250px", minHeight: "250px", minWidth: "250px" }}
                >
                  <LazyLoadImage
                    style={this.props.mobile ? { height: "auto", width: "auto", maxHeight: "150px", maxWidth: "150px" } : { height: "auto", width: "auto", maxHeight: "250px", maxWidth: "250px" }}
                    src={line_item.image}
                    onClick={() => this.enlargeImage(line_item.image, line_item.product_path)}
                  />
                </div>
                <div className="relative margin-s-h">
                  <h3 className="margin-s-v" style={ this.props.mobile ? {} : { fontSize: "30px" }}><Link className="inline" to={line_item.product_path}>{line_item.product_name}</Link> <FontAwesomeIcon style={{ fontSize: "18px" }} onClick={() => this.removeProduct(line_item)} className="hover-color-8 hover" icon={faTrash} /></h3>
                  <div className="margin-s-v" style={ this.props.mobile ? {} : { fontSize: "23px" }}>${formatMoney(line_item.product_price)}</div>
                  <div className="flex align-items-center">
                    <FontAwesomeIcon className="hover hover-color-9 theme-background-3 padding-s border-radius-s margin-xs-h" onClick={() => this.incrementLineItemQuantity(line_item, 'subtraction')} icon={faMinus} />
                    <input 
                      onChange={(e) => console.log(e)} 
                      onFocus={() => this.setState({ showModal: line_item })} 
                      value={line_item.quantity} 
                      style={{ width: "100%", maxWidth: "45px" }}
                    />
                    <FontAwesomeIcon className="hover hover-color-9 theme-background-3 padding-s border-radius-s margin-xs-h" onClick={() => this.incrementLineItemQuantity(line_item, 'addition')} icon={faPlus} />
                  </div>
                </div>
              </div>
              <hr />
            </>
          )
        })}
        {this.state.showModal &&
          <Modal cancel={() => this.setState({ showModal: false })}>
            <div className="text-align-center">
              <LazyLoadImage
                style={this.props.mobile ? { height: "auto", width: "auto", maxHeight: "150px", maxWidth: "150px" } : { height: "auto", width: "auto", maxHeight: "400px", maxWidth: "400px" } }
                src={this.state.showModal.image}
              />
            </div>
            <Form
              onSubmit={this.submitQuantity}
              submitButton={<button style={{ padding: "6px" }}>Done</button>}
              cancel={() => this.setState({ showModal: false })}
              onChange={this.changeCartTab}
              formFields={[{ label: `Update ${this.state.showModal.product_name} quantity`, name: 'quantity', typeOfComponent: "number", autofocus: true, noValueError: 'You must provide an quantity' }]}
              form='change_line_item_quantity_form'
              initialValues={{ quantity: this.state.showModal.quantity }}
            />
          </Modal>
        }

        {this.state.inventory_limit &&
          <Modal cancel={() => this.setState({ inventory_limit: false })}>
            <h2>That's all thats in stock!</h2>
          </Modal>
        }
      </div>
    )
  }
}


function mapStateToProps({ cart, form, enlargeImage, mobile }) {
  return { cart, form, enlargeImage, mobile }
}

const actions = { dispatchObj, updateCart, checkInventory, dispatchEnlargeImage }

export default connect(mapStateToProps, actions)(LineItems)