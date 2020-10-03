import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getDiscountCode } from "../../../../utils/API"
import { dispatchObj, updateCart } from "../../../../actions"
import AddressDisplayEdit from "../../../admin/shared/AddressDisplayEdit"
import { reset } from "redux-form"
import { capitalizeFirsts } from "../../../../utils/helpFunctions"
import { validatePresenceOnAll } from "../../../../utils/validations"
import FormModal from "../../../shared/Form/FormModal"
import { Link } from 'react-router-dom'
import { withRouter } from "react-router-dom"
import { formatMoney } from '../../../../utils/helpFunctions'
import Form from "../../../shared/Form"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { calculateSubtotal, discountCodeAdjustments } from "../../../../utils/helpFunctions"
class ReviewItems extends Component {
  constructor(props) {
    super()
    this.showEditIndicator = this.showEditIndicator.bind(this)
    this.showEditModal = this.showEditModal.bind(this)
    this.updateCartProperty = this.updateCartProperty.bind(this)
    this.checkDiscountCode = this.checkDiscountCode.bind(this)
    this.state = {
      propertyToEdit: null,
      editForm: null,
      discountCodeCheck: null
    }
  }

  async componentDidMount() {

  }
  
  async updateCartProperty(address, property) {
    const form_value = this.props.form['edit_cart_property_form'].values[property]
    address[property] = form_value
    let cart = this.props.cart
    if (address.bill_or_ship === "shipping") { 
      cart.shipping_address = address
    } else {
      cart.billing_address = address
    }

    const { data } = await this.props.updateCart(cart)
    this.setState({ editForm: null, propertyToEdit: null })
    this.props.dispatchObj(reset("edit_cart_property_form"))
  }

  showEditModal(property, address) {
    const form_object = {
      address,
      onSubmit: () => this.updateCartProperty(address, property),
      cancel: () => {
        this.props.dispatchObj(reset("edit_cart_property_form"))
        this.setState({ editForm: null, propertyToEdit: null })
      },
      submitButtonText: "Update Shipping Property",
      formFields: [
        { label: capitalizeFirsts(property), name: property, noValueError: `You must provide a value` },
      ],
      form: "edit_cart_property_form",
      validation: validatePresenceOnAll,
      initialValues: {
          [property]: address[property]
        }
    }
    if (property === "country") {
      form_object.formFields[0].typeOfComponent = "countries"
    } else if (property === "state") {
      form_object.formFields[0].typeOfComponent = "states"
    }
    this.setState({ editForm: form_object })
  }

  showEditIndicator(property, bill_or_ship) {
    let propertyToEdit = {
      property,
      bill_or_ship
    }
    this.setState({ propertyToEdit })
  }

  async checkDiscountCode() {
    const form_value = this.props.form['discount_code_form'].values.discount_code
    let discount_code = await this.props.getDiscountCode(form_value)
    let status = discount_code.status
    let cart = this.props.cart

    discount_code = discount_code.data
    if (status !== 200 || !discount_code.data) {
      this.setState({ discountCodeCheck: false })
      return
    }

    let sub_total
    if (discount_code.affect_order_total) {
      cart = discountCodeAdjustments(discount_code, cart)
      sub_total = cart.sub_total
    } else {
      cart = discountCodeAdjustments(discount_code, cart)
      sub_total = Number(calculateSubtotal(cart))
    }

    cart.discount_codes.push(discount_code)

    if (sub_total < 0) {
      sub_total = 0
    }

    let tax = Number(sub_total * .08)
    let shipping = Number(cart.chosen_rate ? cart.chosen_rate.cost : 0)

    cart.sub_total = sub_total
    cart.tax = tax

    cart.total = Number(sub_total + tax + shipping)

    this.props.updateCart(cart)

    this.setState({ discountCodeCheck: true })
  }

  render() {
    return (
      <div>

        <div>

          <h3 style={this.props.mobile ? {} : { fontSize: "30px", width: "80%", margin: ".4em auto" } }>Email</h3>
          <div style={this.props.mobile ? {} : { fontSize: "20px", width: "80%", margin: "0px auto" } }>{this.props.customer.email}</div>

          <h3 style={this.props.mobile ? {} : {fontSize: "30px", width: "80%", margin: "30px auto" } }>Line Items</h3>
          <div className={`flex flex_column ${!this.props.mobile && "w-80 margin-auto-h"}`}>
            {this.props.cart.line_items.map((line_item, index) => {
              return (
                <div key={index} className="flex align-items-center" style={{ marginTop: "10px" }}>
                  <div className="margin-auto-v flex justify-center align-items-center background-color-black border-radius-xs" style={{ maxHeight: "125px", maxWidth: "125px", minHeight: "125px", minWidth: "125px",  marginRight: "10px" }}>
                    <img className="h-w-auto margin-auto-h" style={{ maxHeight: "125px", maxWidth: "125px" }} src={line_item.image} />
                  </div>
                  <div>
                    <h3 className="margin-s-v" style={this.props.mobile ? {} : {fontSize: "25px"} }>{line_item.product_name}</h3>
                    <div style={this.props.mobile ? {} : {fontSize: "20px"} }>Quantity: {line_item.quantity}</div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className={`${this.props.mobile ? "" : "flex space-around"}`}>
            <div>
              <h3  style={this.props.mobile ? {} : {fontSize: "30px"} }>Billing Address</h3>
              <AddressDisplayEdit 
                showEditIndicator={this.showEditIndicator} 
                showEditModal={this.showEditModal}
                address={this.props.cart.billing_address} 
                bill_or_ship={"billing"} 
                propertyToEdit={this.state.propertyToEdit}
              />
            </div>
            <div>
              <h3 style={this.props.mobile ? {} : {fontSize: "30px"} }>Shipping Address</h3>
              <AddressDisplayEdit 
                showEditIndicator={this.showEditIndicator} 
                showEditModal={this.showEditModal}
                address={this.props.cart.shipping_address} 
                bill_or_ship={"shipping"} 
                propertyToEdit={this.state.propertyToEdit}
              />
            </div>
          </div>

          <div style={this.props.mobile ? {} : { fontSize: "20px", width: "80%", margin: "30px auto" } }>
            <Form 
              submitButton= {<div />}
              formFields={[
                { label: 'Order Notes', name: 'customer_notes', typeOfComponent: "text-area", noValueError: 'You must provide an address', value: null },
              ]} 
              form={"customer_order_notes_form"}
            />
          </div>

          {this.props.cart.discount_codes.length < 1 && 
            <div style={this.props.mobile ? {} : { fontSize: "20px", width: "80%", margin: "30px auto" } }>
              <Form
                onSubmit={this.checkDiscountCode}
                submitButton= {
                    <div className="flex">
                      <button>Check For Discount</button>
                      {this.state.discountCodeCheck !== null ? 
                        (this.state.discountCodeCheck ? 
                            <FontAwesomeIcon className="margin-m-h" style={{ fontSize: '30px' }} icon={faCheck} />
                          : 
                            <FontAwesomeIcon className="margin-m-h" style={{ fontSize: '30px' }} icon={faTimes} />                      
                          )
                        : <div /> }
                    </div>
                  }
                formFields={[
                  { label: 'Dicount Code', name: 'discount_code', noValueError: 'You must provide an address', value: null },
                ]} 
                form={"discount_code_form"}
              />
            </div>
          }

          <div style={this.props.mobile ? {} : { fontSize: "20px", width: "80%", margin: "30px auto" } } className="flex flex_column margin-m-v">
            <div>Sub Total: ${formatMoney(this.props.cart.sub_total)}</div>
            <div>Tax: ${formatMoney(this.props.cart.tax)}</div>
            <div>Shipping: ${formatMoney(this.props.cart.chosen_rate.cost)}</div>
            {this.props.cart.discount_codes.length > 0 && 
              <div>Discount Code: {this.props.cart.discount_codes[0].affect_order_total ?
                <span>{this.props.cart.discount_codes[0].discount_code} - {this.props.cart.discount_codes[0].flat_price !== null ? "$" + this.props.cart.discount_codes[0].flat_price : "%" + this.props.cart.discount_codes[0].percentage} off entire cart</span>
               :
                <span>{this.props.cart.discount_codes[0].discount_code} - {this.props.cart.discount_codes[0].flat_price !== null ? "$" + this.props.cart.discount_codes[0].flat_price : "%" + this.props.cart.discount_codes[0].percentage} off select product(s)</span>
               }
              </div>
            }
            <div>Total: ${formatMoney(this.props.cart.total)}</div>
          </div>

        </div>

        {
          this.state.editForm && 
            <div>
              <FormModal
                onSubmit={this.state.editForm.onSubmit}
                cancel={this.state.editForm.cancel}
                submitButtonText={this.state.editForm.submitButtonText}
                formFields={this.state.editForm.formFields}
                form={this.state.editForm.form}
                validation={this.state.editForm.validation}
                title={"Updating Shipping Property"}
                initialValues={this.state.editForm.initialValues}
              />
            </div>
        }
        <Link to=""></Link>
      </div>
    )
  }
}

function mapStateToProps({ form, mobile }) {
  return { form, mobile }
}

const actions = { updateCart, dispatchObj, getDiscountCode }

export default connect(mapStateToProps, actions)(withRouter(ReviewItems))