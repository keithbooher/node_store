import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reset } from "redux-form"
import { getProductbyName, createCart, updateCart, checkInventory } from "../../../../utils/API"
import { dispatchObj } from "../../../../actions"
import { formatMoney } from "../../../../utils/helperFunctions"
import CartLineItems from '../../shared/CartLineItems'

class FillCart extends Component {
  constructor(props) {
    super()
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.addToLineItems = this.addToLineItems.bind(this)
    this.proceedToNextStep = this.proceedToNextStep.bind(this)
    this.adjustLineItemQuantity = this.adjustLineItemQuantity.bind(this)
    this.adjustLineItemCost = this.adjustLineItemCost.bind(this)
    this.state = {
      line_items: [],
      result: null,
      update: false,
      quantity: 1
    }
  }

  componentDidMount() {
    if (this.props.cart.line_items && this.props.cart.line_items.length > 0) {
      this.setState({ line_items: this.props.cart.line_items, update: true })
    }
  }

  async handleSearchSubmit() {
    const search_for_product = this.props.form['product_order_search_form'].values
    const { data } = await getProductbyName(search_for_product.name)
    this.setState({ result: data })
  }

  addToLineItems(cart) {
    this.setState({ line_items: cart.line_items })
  }

  removeLineItem(cart) {
    this.setState({ line_items: cart.line_items })
  }

  async adjustLineItemQuantity(cart) {
    this.setState({ line_items: cart.line_items })
  }

  renderSubTotal() {
    let sub_total = 0
    this.state.line_items.forEach((item) => {
      sub_total = sub_total + (item.product_price * item.quantity)
    })
    return formatMoney(sub_total)
  }

  renderTax() {
    let sub_total = this.renderSubTotal()
    let shipping = this.props.cart.chosen_rate ? this.props.cart.chosen_rate.cost : 0
    let tax = (sub_total + shipping) * .08
    return formatMoney(tax)
  }

  renderTotal() {
    let sub_total = this.renderSubTotal()
    let tax = this.renderTax()
    let shipping = this.props.cart.chosen_rate ? this.props.cart.chosen_rate.cost : 0
    let total = tax + sub_total + shipping
    return formatMoney(total)
  }


  async proceedToNextStep() {
    let cart = this.props.cart
    cart.line_items = this.state.line_items
    cart.checkout_state = "shipping"
    cart.sub_total = this.renderSubTotal()
    cart.tax = this.renderTax()
    cart.total = this.renderTotal()
    

    // MAKE API REQUEST TO MAKE THIS AN OFFICIAL CART IN DB
    let request
    if (this.state.update) {
      request = await this.props.updateCart(cart)
    } else {
      request = await this.props.createCart(cart)
    }

    let state = {
      cart: request.data,
      step: "shipping",
    }
    this.props.topStateSetter(state)
    this.props.dispatchObj(reset("product_order_search_form"))

    this.props.refProp.current.scrollTo(0, 0);
  }

  setQuantity(direction, product) {
    let quantity
    if(direction === "up") {
      quantity = this.state.quantity + 1
    } else {
      quantity = this.state.quantity - 1
    }
    
    if (!product.backorderable && quantity > product.inventory_count || quantity < 1) {
      return
    }
    this.setState({ quantity })
  }

  checkInventoryCount(e, product) {
    let value = e.target.value
    if (value > product.inventory_count) {
      value = product.inventory_count
      this.setState({ quantity: value })
    }
    if (value === "") {
      value = 1
      this.setState({ quantity: value })
    }
  }

  onChangeInput(e) {
    let value = parseInt(e.target.value)

    if (e.target.value === "") {
      value = ""
    }
    this.setState({ quantity: value })
  }

  preventAlpha(e) {
    if (!this.isNumber(e)) {
      e.preventDefault();
    }
  }

  isNumber(e) {
    var charCode = e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
  }

  adjustLineItemCost(line_items){
    this.setState({ line_items })
  }

  render() {
    return (
      <div style={{ marginTop: "30px" }}>

        <CartLineItems
          cart={this.props.cart}
          addToLineItems={this.addToLineItems}
          removeLineItem={this.removeLineItem}
          adjustLineItemQuantity={this.adjustLineItemQuantity}
          adjustCost={this.adjustLineItemCost}
        />

        <div className="margin-s-v">
          Sub Total: ${this.renderSubTotal()}
        </div>
        <div className="margin-s-v">
          Total: ${this.renderTotal()}
        </div>
         {this.state.line_items.length > 0 && <button onClick={this.proceedToNextStep} className="margin-s-v">Move to shipping step</button>}
      </div>
    )
  }
}

function mapStateToProps({ form }) {
  return { form }
}

const actions = { updateCart, createCart, dispatchObj }

export default connect(mapStateToProps, actions)(FillCart)
