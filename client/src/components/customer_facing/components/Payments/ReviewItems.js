import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateCart } from "../../../../utils/API"
import { dispatchObj } from "../../../../actions"
import AddressDisplayEdit from "../../../admin/shared/AddressDisplayEdit"
import { reset } from "redux-form"
import { capitalizeFirsts } from "../../../../utils/helpFunctions"
import { validatePresenceOnAll } from "../../../../utils/validations"
import FormModal from "../../../shared/Form/FormModal"
import { Link } from 'react-router-dom'
import { withRouter } from "react-router-dom"
import { formatMoney } from '../../../../utils/helpFunctions'

class ReviewItems extends Component {
  constructor(props) {
    super()
    this.showEditIndicator = this.showEditIndicator.bind(this)
    this.showEditModal = this.showEditModal.bind(this)
    this.updateCartProperty = this.updateCartProperty.bind(this)
    this.state = {
      propertyToEdit: null,
      editForm: null
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
    this.setState({ editForm: form_object })
  }

  showEditIndicator(property, bill_or_ship) {
    let propertyToEdit = {
      property,
      bill_or_ship
    }
    this.setState({ propertyToEdit })
  }

  render() {
    console.log(this.props)
    return (
      <div>

        <div>

          <h3>Email</h3>
          <div>{this.props.customer.email}</div>

          <h3>Line Items</h3>
          <div className="flex flex_column">
            {this.props.cart.line_items.map((line_item, index) => {
              return (
                <div key={index} className="flex align-items-center" style={{ marginTop: "5px" }}>
                  <div className="margin-auto-v flex justify-center align-items-center background-color-black" style={{ maxHeight: "125px", maxWidth: "125px", minHeight: "125px", minWidth: "125px",  marginRight: "10px" }}>
                    <img className="h-w-auto margin-auto-h" style={{ maxHeight: "125px", maxWidth: "125px" }} src={line_item.image} />
                  </div>
                  <div>
                    <h3 className="margin-s-v">{line_item.product_name}</h3>
                    <div>Quantity: {line_item.quantity}</div>
                  </div>
                </div>
              )
            })}
          </div>

          <h3>Billing Address</h3>
          <AddressDisplayEdit 
            showEditIndicator={this.showEditIndicator} 
            showEditModal={this.showEditModal}
            address={this.props.cart.billing_address} 
            bill_or_ship={"billing"} 
            propertyToEdit={this.state.propertyToEdit}
          />

          <h3>Shipping Address</h3>
          <AddressDisplayEdit 
            showEditIndicator={this.showEditIndicator} 
            showEditModal={this.showEditModal}
            address={this.props.cart.shipping_address} 
            bill_or_ship={"shipping"} 
            propertyToEdit={this.state.propertyToEdit}
          />

          <div className="flex flex_column">
            <div>Sub Total: ${formatMoney(this.props.cart.sub_total)}</div>
            <div>Tax: ${formatMoney(this.props.cart.tax)}</div>
            <div>Shipping: ${formatMoney(this.props.cart.chosen_rate.cost)}</div>
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

function mapStateToProps({ form }) {
  return { form }
}

const actions = { updateCart, dispatchObj }

export default connect(mapStateToProps, actions)(withRouter(ReviewItems))