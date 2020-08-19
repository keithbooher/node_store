import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getOrder, updateShipment, updateOrder, handleRefund } from "../../../utils/API"
import { dispatchObj } from "../../../actions"
import { Link } from "react-router-dom"
import loadingGif from '../../../images/pizzaLoading.gif'
import Form from "../../shared/Form"
import  { shippingStatusDropDown }  from "./formFeilds"  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { validatePresenceOnAll } from "../../../utils/validations"
import { capitalizeFirsts } from "../../../utils/helpFunctions"
import { reset } from "redux-form"
import FormModal from "../../shared/Form/FormModal"
import Modal from "../../shared/Modal"
import AddressDisplayEdit from "../shared/AddressDisplayEdit"
import "./order.scss"
class OrderPage extends Component {
  constructor(props) {
    super()
    this.order_id = props.match.params.id
    this.showEditIndicator = this.showEditIndicator.bind(this)
    this.showEditModal = this.showEditModal.bind(this)
    this.handleNoteSubmission = this.handleNoteSubmission.bind(this)
    this.handleRefund = this.handleRefund.bind(this)
    this.state = {
      order: null,
      propertyToEdit: null,
      editForm: null,
      refundModal: false
    }
  }
  
  async componentDidMount() {
    let order = await this.props.getOrder(this.order_id).then(res => res.data)
    this.setState({ order })
  }


  async updateShipmentStatus(e) {
    e.preventDefault()
    if (!this.props.form['update_shipment_status_form'].values) {
      return
    }
    const chosenStatus = this.props.form['update_shipment_status_form'].values.shipping_status.value



    // TO DO 
    // change shipping status when complete manually
    let shipment = this.state.order.shipment
    shipment.status = chosenStatus
    await this.props.updateShipment(shipment)
    let order = await this.props.getOrder(this.order_id).then(res => res.data)
    this.setState({ order })
  }

  createFormFields() {
    let formFields = shippingStatusDropDown[0]
    for (let i = 0; i < formFields.options.length; i++) {
      if (formFields.options[i].name === this.state.order.shipment.status) {
        formFields.options[i].default = true
      }
    }
    return [formFields]
  }

  showEditIndicator(property, bill_or_ship) {
    let propertyToEdit = {
      property,
      bill_or_ship
    }
    this.setState({ propertyToEdit })
  }

  showEditModal(property, address) {
    const form_object = {
      address,
      onSubmit: () => this.updateShipmentProperty(address, property),
      cancel: () => {
        this.props.dispatchObj(reset("edit_shipping_property_form"))
        this.setState({ editForm: null })
      },
      submitButtonText: "Update Shipping Property",
      formFields: [
        { label: capitalizeFirsts(property), name: property, noValueError: `You must provide a value` },
      ],
      form: "edit_shipping_property_form",
      validation: validatePresenceOnAll,
      initialValues: {
          [property]: address[property]
        }
    }
    this.setState({ editForm: form_object })
  }

  async updateShipmentProperty(address, property) {
    const form_value = this.props.form['edit_shipping_property_form'].values[property]
    address[property] = form_value
    let shipment = this.state.order.shipment
    if (address.bill_or_ship === "shipping") { 
      shipment.shipping_address = address
    } else {
      shipment.billing_address = address
    }

    await this.props.updateShipment(shipment)

    let { data } = await this.props.getOrder(this.order_id)
    this.props.dispatchObj(reset("edit_shipping_property_form"))
    this.setState({ order: data, editForm: null, propertyToEdit: null })
  }

  async handleNoteSubmission() {
    const form_value = this.props.form['admin_order_notes_form'].values.admin_notes
    let order = this.state.order
    order.admin_notes = form_value
    let { data } = await this.props.updateOrder(order)
    this.setState({ order: data })
  }

  async handleRefundOffline(){
    let order = this.state.order
    order.status = "refunded"
    order.refund = {refund: "Offline"}
    let { data } = await this.props.updateOrder(order)
    this.setState({ order: data, refundModal: false })
    // make sure nothing can be changed at this point
  }

  async handleRefund(){
    const refund = await handleRefund(this.state.order.payment)
    let order = this.state.order
    order.status = "refunded"
    order.refund = refund.data
    let { data } = await this.props.updateOrder(order)
    this.setState({ order: data, refundModal: false })
    // make sure nothing can be changed at this point
  }

  render() {
    let order = this.state.order
    return (
      <div>
        {
          this.state.order ?
            <>
              <div className="relative" style={{ marginTop: "2em" }}>
                <Link className="absolute" style={{ left: "0px" }} to="/admin/orders"><FontAwesomeIcon icon={faArrowLeft}/></Link>
                <h3 className="underline text-align-center">Order Data</h3>
              </div>
   

              <div>Order ID: {order._id}</div>
              <div>Status: {order.status}</div>
              <div>Customer: <Link style={{ display: "inline" }} to={`/admin/users/${order._user_id}`} >{order.email}</Link></div>
              <div>Date Placed: {order.date_placed}</div>
              <div>Total: {order.total}</div>

              <button onClick={() => this.setState({ refundModal: true })}>Start a return</button>

              <Form 
                onSubmit={this.handleNoteSubmission}
                submitButtonText={"Update Notes"}
                formFields={[
                  { label: 'Notes', name: 'admin_notes', typeOfComponent: "text-area", noValueError: 'You must provide an address', value: null },
                ]} 
                form={"admin_order_notes_form"}
                initialValues={{"admin_notes": order.admin_notes}}
              />

              <h3 className="underline text-align-center">Shipment Data</h3>
        
              <h4>Line Items</h4>
              <div className="flex flex-wrap">
                {order.shipment.line_items && order.shipment.line_items.map((item, index) => {
                  let path = item.product_path ? item.product_path.split("/").pop() : "undefined"
                  return (
                    <div key={index} className="margin-s-h">
                      <img style={{ maxHeight: "150px", width: "auto" }} src={item.image} />
                      <div>Product name: {path === "undefined" ? item.product_name : <Link className="inline" to={`/admin/products/form/update/${path}`}>{item.product_name}</Link>}</div>
                      <div>product price: ${item.product_price}</div>
                      <div>quantity: {item.quantity}</div>
                      <div>item total: ${item.quantity * item.product_price}</div>
                    </div>
                  )
                })}       
              </div>

              <hr/>

              <h4>Shipping Rate</h4>
              <div>Method: {order.shipment.chosen_rate.shipping_method}</div>
              <div>Rate: {order.shipment.chosen_rate.shipping_rate}</div>
              <div>Cost: {order.shipment.chosen_rate.cost}</div>

              <hr/>

              <div className="flex flex_column">
                <div>
                  <h4>Shipping Address</h4>
                  <div style={{ marginLeft: "1em" }}>
                    <AddressDisplayEdit 
                      showEditIndicator={this.showEditIndicator} 
                      showEditModal={this.showEditModal}
                      address={order.shipment.shipping_address} 
                      bill_or_ship={"shipping"} 
                      propertyToEdit={this.state.propertyToEdit}
                    />
                  </div>
                </div>
                <div>
                  <h4>Billing Address</h4>
                  <div style={{ marginLeft: "1em" }}>
                    <AddressDisplayEdit 
                      showEditIndicator={this.showEditIndicator} 
                      showEditModal={this.showEditModal}
                      address={order.shipment.billing_address} 
                      bill_or_ship={"billing"} 
                      propertyToEdit={this.state.propertyToEdit}
                    />
                  </div>

                </div>
              </div>

              <hr/>

              <h5>Date Shipped</h5>
              {order.shipment.date_shipped ? order.shipment.date_shipped : "Not Shipped Yet"}

              <hr/>

              {order.status !== "refunded" && 
                <Form 
                  onSubmit={(e) => this.updateShipmentStatus(e)}
                  submitButtonText={"update shipment statues"}
                  formFields={this.createFormFields()}
                  form='update_shipment_status_form'
                />
              }
            </>
          : <img className="loadingGif" src={loadingGif} />
        }

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

        {
          this.state.refundModal && 
            <Modal cancel={() => this.setState({ refundModal: false })}>
              <button onClick={this.handleRefundOffline}>Handle Refund Offline</button>
              <button onClick={this.handleRefund}>Refund Through Stripe</button>
            </Modal>
        }

      </div>
    )
  }
}



function mapStateToProps({ form }) {
  return { form }
}

const actions = { updateOrder, getOrder, dispatchObj, updateShipment }

export default connect(mapStateToProps, actions)(OrderPage)