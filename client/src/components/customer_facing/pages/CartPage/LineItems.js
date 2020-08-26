import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reset } from "redux-form"
import { Link } from 'react-router-dom'
import { calculateSubtotal, formatMoney } from '../../../../utils/helpFunctions'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons"
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Modal from "../../../shared/Modal"
import Form from "../../../shared/Form"
import { dispatchObj, updateCart } from "../../../../actions"
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

  render() {
    console.log(this.props)
    return (
      <div >
        {this.props.cart && this.props.cart.line_items.map((line_item, index) => {
          return (
            <div key={index} className="flex">
              <LazyLoadImage
                style={{ height: "auto", width: "auto", maxHeight: "100px", maxWidth: "100px" }}
                src={line_item.image}
              />
              <div>
                <div>{line_item.product_name}</div>
                <div className="flex align-items-center">
                  <FontAwesomeIcon onClick={() => this.incrementLineItemQuantity(line_item, 'subtraction')} icon={faMinus} />
                  <input 
                    onChange={(e) => console.log(e)} 
                    onFocus={() => this.setState({ showModal: line_item })} 
                    value={line_item.quantity} 
                    style={{ width: "100px" }}
                  />
                  <FontAwesomeIcon onClick={() => this.incrementLineItemQuantity(line_item, 'addition')} icon={faPlus} />
                </div>
              </div>
            </div>
          )
        })}
        {this.state.showModal &&
          <Modal cancel={() => this.setState({ showModal: false })}>
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

        {this.state.inventory_limit &&
          <Modal cancel={() => this.setState({ inventory_limit: false })}>
            <h2>That's all thats in stock!</h2>
          </Modal>
        }
      </div>
    )
  }
}


function mapStateToProps({ cart, form }) {
  return { cart, form }
}

const actions = { dispatchObj, updateCart, checkInventory }

export default connect(mapStateToProps, actions)(LineItems)