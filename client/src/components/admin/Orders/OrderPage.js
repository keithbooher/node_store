import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getOrder, updateShipment, updateOrder, handleRefund, handlePartialRefund, sendProcessingEmail, sendTrackingEmail } from "../../../utils/API"
import { dispatchObj } from "../../../actions"
import { Link } from "react-router-dom"
import Form from "../../shared/Form"
import  { shippingStatusDropDown }  from "./formFeilds"  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faSpinner, faEdit } from "@fortawesome/free-solid-svg-icons"
import { validatePresenceOnAll } from "../../../utils/validations"
import { capitalizeFirsts, formatMoney } from "../../../utils/helpFunctions"
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
    this.handlePartialRefund = this.handlePartialRefund.bind(this)
    this.updateShipmentStatus = this.updateShipmentStatus.bind(this)
    this.updateShipmentTracking = this.updateShipmentTracking.bind(this)
    this.displayDiscount = this.displayDiscount.bind(this)
    this.state = {
      order: null,
      propertyToEdit: null,
      editForm: null,
      refundModal: false,
      trackingBoolean: false
    }
  }
  
  async componentDidMount() {
    let order = await this.props.getOrder(this.order_id).then(res => res.data)
    let trackingBoolean = false
    if (order.shipment.tracking !== null) {
      trackingBoolean = true
    }
    this.setState({ order, trackingBoolean })
  }


  async updateShipmentStatus() {
    if (!this.props.form['update_shipment_status_form'].values) {
      return
    }
    const chosenStatus = this.props.form['update_shipment_status_form'].values.shipping_status.value

    let shipment = this.state.order.shipment
    shipment.status = chosenStatus
    await this.props.updateShipment(shipment)

    let pre_update_order = this.state.order
    let order 
    if (chosenStatus === "completed") {
      pre_update_order.status = "complete"
      order = await this.props.updateOrder(pre_update_order).then(res => res.data)
    } else if (chosenStatus === "processing") {
      sendProcessingEmail(pre_update_order)
      pre_update_order.status = "processing"
      order = await this.props.updateOrder(pre_update_order).then(res => res.data)
    } else {
      order = await this.props.getOrder(this.order_id).then(res => res.data)
    }

    this.setState({ order })
  }

  async updateShipmentTracking() {
    if (!this.props.form['update_shipment_tracking_form'].values) {
      return
    }
    const tracking = this.props.form['update_shipment_tracking_form'].values.tracking

    let shipment = this.state.order.shipment
    shipment.tracking = Number(tracking)
    await this.props.updateShipment(shipment)
    let order = await this.props.getOrder(this.order_id).then(res => res.data)
    this.setState({ order, trackingBoolean: true })
    this.props.sendTrackingEmail(this.state.order)
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

  async handlePartialRefund(){
    const refundValue = this.props.form['partial_refund_form'].values.partial_refund
    const refund = await this.props.handlePartialRefund(this.state.order.payment, refundValue)
    let order = this.state.order
    order.status = "refunded"
    order.refund = refund.data
    let { data } = await this.props.updateOrder(order)
    this.props.dispatchObj(reset("partial_refund_form"))
    this.setState({ order: data, partialRefundModal: false })
    // make sure nothing can be changed at this point
  }

  displayDiscount(line_item) {
    let discount_amount = 0
    if (this.state.order.discount_codes && this.state.order.discount_codes.length > 0) {
      if (this.state.order.discount_codes[0].flat_price !== null) {
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
    let order = this.state.order
    let fontSize = "1em"
    let iconFontSize = "1em"
    if (!this.props.mobile) {
      fontSize = "20px"
      iconFontSize = "30px"
    }
    return (
      <div style={{ fontSize }}>
        {
          this.state.order ?
            <>
              <div className="relative" style={{ marginTop: "2em" }}>
                <Link className="absolute" style={{ left: "0px" }} to="/admin/orders"><FontAwesomeIcon style={{ fontSize: iconFontSize }} className="hover-color-4" icon={faArrowLeft}/></Link>
                <h2 className={`underline ${this.props.mobile ? "text-align-center" : "padding-xl-top"}`}>Order Data</h2>
              </div>
   

              <div className="margin-xs-v"><span className="bold">Order ID:</span> {order._id}</div>
              <div className="margin-xs-v"><span className="bold">Status:</span> {order.status} {order.refund && `- $${formatMoney(order.refund.amount)}`}</div>
              <div className="margin-xs-v"><span className="bold">Customer:</span> <Link style={{ display: "inline" }} to={`/admin/users/${order._user_id}`} >{order.email}</Link></div>
              <div className="margin-xs-v"><span className="bold">Date Placed:</span> {order.date_placed.split("T")[0]}</div>
              <div className="margin-xs-v"><span className="bold">Total:</span> ${formatMoney(order.total)}</div>


              {order.customer_notes &&
                <div className="margin-m-v">
                  <div className="bold">Customer Notes</div>
                  <div>{order.customer_notes}</div>
                </div>
              }

              <Form 
                onSubmit={this.handleNoteSubmission}
                submitButtonText={"Update Notes"}
                formFields={[
                  { label: 'Admin Notes', name: 'admin_notes', typeOfComponent: "text-area", noValueError: 'You must provide an address', value: null },
                ]} 
                form={"admin_order_notes_form"}
                initialValues={{"admin_notes": order.admin_notes}}
              />

              <h2 className={`underline ${this.props.mobile ? "text-align-center" : "padding-xl-top"}`}>Shipment Data</h2>
        
              <h3>Line Items</h3>
              <div className="flex flex-wrap">
                {order.shipment.line_items && order.shipment.line_items.map((item, index) => {
                  let path = item.product_path ? item.product_path.split("/").pop() : "undefined"
                  if (this.props.mobile) {
                    return (
                      <div key={index} style={{ margin: "10px auto" }} className="theme-background-6 w-100 padding-m border-radius-s">
                        <div 
                          className="flex justify-center align-items-center background-color-black border-radius-s" 
                          style={{ maxHeight: "300px", maxWidth: "500px", width: '100%', margin: "auto" }}
                        >
                          <img style={{ maxHeight: "300px", width: "auto" }} src={item.image} />
                        </div>
                        <div style={{ marginTop: "30px" }}>
                          <div><span className="bold">Product name:</span> {path === "undefined" ? item.product_name : <Link className="inline" to={`/admin/products/form/update/${path}`}>{item.product_name}</Link>}</div>
                          {item.varietal && item.varietal.size !== null && <div><span className="bold">Size:</span> {item.varietal.size.value}</div>}
                          {item.varietal && item.varietal.color !== null && <div><span className="bold">Color:</span> {item.varietal.color.name}</div>}
                          <div><span className="bold">Product price:</span> ${formatMoney(item.product_price)}</div>
                          {this.discountDisplaySwitch(item) &&
                            <div className="color-black"><span className="bold">Discount:</span> ${formatMoney(this.displayDiscount(item))}</div>
                          }                          
                          <div><span className="bold">Quantity:</span> {item.quantity}</div>
                        </div>
                      </div>
                    )
                  } else {
                    return (<div key={index} style={{ margin: "10px", maxWidth: "300px", maxHeight: "500px", overflow: "scroll" }} className="theme-background-6 w-100 padding-m border-radius-s">
                              <div 
                                className="flex justify-center align-items-center background-color-black border-radius-s" 
                                style={{ maxHeight: "300px", maxWidth: "500px", width: '100%', margin: "auto" }}
                              >
                                <img style={{ maxHeight: "300px", width: "auto", maxWidth: "300px" }} src={item.image} />
                              </div>
                              <div style={{ marginTop: "30px" }}>
                                <div><span className="bold">Product Name:</span> {path === "undefined" ? item.product_name : <Link className="inline" to={`/admin/products/form/update/${path}`}>{item.product_name}</Link>}</div>
                                {item.varietal && item.varietal.size !== null && <div><span className="bold">Size:</span> {item.varietal.size.value}</div>}
                                {item.varietal && item.varietal.color !== null && <div><span className="bold">Color:</span> {item.varietal.color.name}</div>}
                                <div><span className="bold">Product Price:</span> ${formatMoney(item.product_price)}</div>
                                {this.discountDisplaySwitch(item) &&
                                  <div className="color-black"><span className="bold">discount:</span> ${formatMoney(this.displayDiscount(item))}</div>
                                }      
                                <div><span className="bold">Quantity:</span> {item.quantity}</div>
                                {item.gift_note && <div><span className="bold">Gift Note:</span> {item.gift_note}</div>}
                              </div>
                            </div>)
                  }

                })}       
              </div>

              <hr/>

              <h3>Shipping Rate</h3>
              <div><span className="bold">Method:</span> {order.shipment.chosen_rate.shipping_method}</div>
              <div><span className="bold">Rate:</span> {order.shipment.chosen_rate.shipping_rate}</div>
              <div><span className="bold">Cost:</span> ${formatMoney(order.shipment.chosen_rate.cost)}</div>

              <hr/>

              <h3 className="margin-s-v">Date Shipped</h3>
              <div>{order.shipment.date_shipped ? order.shipment.date_shipped : "Not Shipped Yet"}</div>

              {order.status !== "refunded" && 
                <Form 
                  onSubmit={() => this.updateShipmentStatus()}
                  submitButton={<button className={`${this.props.mobile ? "w-100": "desktop_long_button_width" } margin-s-v`}>Update Shipment Status</button>}
                  formFields={this.createFormFields()}
                  form='update_shipment_status_form'
                />
              }

              {order.shipment.tracking && 
                <div>
                  <h3 className="margin-s-v">Tracking</h3>
                  <div>{order.shipment.tracking} <FontAwesomeIcon className="hover hover-color-12" icon={faEdit} onClick={() => this.setState({ trackingBoolean: false })} /></div>
                </div>
              }

              {order.shipment.status === "completed" && !this.state.trackingBoolean &&  
                <div className={`${this.props.mobile ? "w-100": "w-40"}`}>
                  <Form 
                    onSubmit={() => this.updateShipmentTracking()}
                    submitButton={<button className={`${this.props.mobile ? "w-100": "desktop_long_button_width" } margin-s-v`}>Update Shipment Status</button>}
                    formFields={[{ label: 'Enter Tracking NUmber', name: 'tracking', noValueError: 'You must provide an address' }]}
                    form='update_shipment_tracking_form'
                    initialValues={order.shipment.tracking ? { "tracking": order.shipment.tracking } : {}}
                  />
                </div>
              }

              <hr/>

              <div className={`${this.props.mobile ? "flex flex_column" : "flex"}`}>
                <div className={`${!this.props.mobile && "w-50"}`} >
                  <h3>Shipping Address</h3>
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
                <div className={`${!this.props.mobile && "w-50"}`}>
                  <h3>Billing Address</h3>
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

              {!order.refund && <button style={this.props.mobile ? { width: "100%", margin: ".4em auto" } : { width: "200px" }} onClick={() => this.setState({ refundModal: true })}>Start a return</button>}

            </>
          : <FontAwesomeIcon className="loadingGif loadingGifCenterScreen" icon={faSpinner} spin />
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
              <button onClick={() => this.setState({ stripeRefundModal: true })}>Refund Through Stripe</button>
            </Modal>
        }

        {
          this.state.stripeRefundModal && 
            <Modal cancel={() => this.setState({ stripeRefundModal: false })}>
              <button onClick={() => this.setState({ partialRefundModal: true })}>Partial Refund</button>
              <button onClick={this.handleRefund}>Full Refund</button>
            </Modal>
        }

        {
          this.state.partialRefundModal && 
            <FormModal
              onSubmit={this.handlePartialRefund}
              cancel={() => this.setState({ stripeRefundModal: false })}
              submitButtonText={"Refund"}
              formFields={[{ label: 'Enter the amount to refund', name: 'partial_refund', noValueError: 'You must provide an amount' }]}
              form={"partial_refund_form"}
              title={"Partial Refund"}
              validation={validatePresenceOnAll}
            />
        }

      </div>
    )
  }
}



function mapStateToProps({ form }) {
  return { form }
}

const actions = { updateOrder, getOrder, dispatchObj, updateShipment, handlePartialRefund, handleRefund, sendTrackingEmail, sendProcessingEmail }

export default connect(mapStateToProps, actions)(OrderPage)