import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getOrder, updateShipment, updateOrder } from "../../../utils/API"
import { Link } from "react-router-dom"
import loadingGif from '../../../images/pizzaLoading.gif'
import Form from "../../shared/Form"
import  { shippingStatusDropDown }  from "./formFeilds"  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { validatePresenceOnAll } from "../../../utils/validations"
import { capitalizeFirsts } from "../../../utils/helperFunctions"
import { reset } from "redux-form"
import FormModal from "../../shared/Form/FormModal"

class OrderPage extends Component {
  constructor(props) {
    super()
    this.order_id = props.match.params.id
    this.showEditIndicator = this.showEditIndicator.bind(this)
    this.showEditModal = this.showEditModal.bind(this)
    this.handleNoteSubmission = this.handleNoteSubmission.bind(this)
    this.state = {
      order: null,
      propertyToEdit: null,
      editForm: null
    }
  }
  
  async componentDidMount() {
    let order = await getOrder(this.order_id).then(res => res.data)
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
    await updateShipment(shipment)
    let order = await getOrder(this.order_id).then(res => res.data)
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
        this.props.dispatch(reset("edit_shipping_property_form"))
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

    await updateShipment(shipment)

    let { data } = await getOrder(this.order_id)
    this.props.dispatch(reset("edit_shipping_property_form"))
    this.setState({ order: data, editForm: null, propertyToEdit: null })
  }

  async handleNoteSubmission() {
    const form_value = this.props.form['admin_order_notes_form'].values.admin_notes
    let order = this.state.order
    order.admin_notes = form_value
    let { data } = await updateOrder(order)
    console.log(data)
    this.setState({ order: data })
  }

  render() {
    let order = this.state.order

    return (
      <div>
        {
          this.state.order !== null ?
            <>
              <Link to="/admin/orders">Back To Orders</Link>

              <h3 className="underline">Order Data</h3>

              <div>Order ID: {order._id}</div>
              <div>Status: {order.status}</div>
              <div>Customer: <Link style={{ display: "inline" }} to={`/admin/users/${order._user_id}`} >{order.email}</Link></div>
              <div>Date Placed: {order.date_placed}</div>
              <div>Total: {order.total}</div>

              <h5>Notes</h5>
              <Form 
                onSubmit={this.handleNoteSubmission}
                submitButtonText={"Update"}
                formFields={[
                  { label: 'Notes', name: 'admin_notes', noValueError: 'You must provide an address', value: null },
                ]} 
                form={"admin_order_notes_form"}
                initialValues={{"admin_notes": order.admin_notes}}
              />

              <h3 className="underline">Shipment Data</h3>
        
              <h5>Line Items</h5>
              <div className="flex flex-wrap">
                {order.shipment.line_items.map((item) => {
                  return (
                    <div className="margin-s-h">
                      <img style={{ maxHeight: "150px", width: "auto" }} src={item.image} />
                      <div>Product name: {item.product_name}</div>
                      <div>quantity: {item.quantity}</div>
                      <div>product price: ${item.product_price}</div>
                      <div>item total: {item.quantity * item.product_price}</div>
                    </div>
                  )
                })}       
              </div>

              <hr/>

              <h5>Shipping Rate</h5>
              <div>Method: {order.shipment.chosen_rate.shipping_method}</div>
              <div>Rate: {order.shipment.chosen_rate.shipping_rate}</div>
              <div>Cost: {order.shipment.chosen_rate.cost}</div>

              <hr/>

              <div className="flex">
                <div>
                  <h5>Shipping Address</h5>
                  <AddressDisplay 
                    showEditIndicator={this.showEditIndicator} 
                    showEditModal={this.showEditModal}
                    address={order.shipment.shipping_address} 
                    bill_or_ship={"shipping"} 
                    propertyToEdit={this.state.propertyToEdit}
                  />
                </div>
                <div>
                  <h5>Billing Address</h5>
                  <AddressDisplay 
                    showEditIndicator={this.showEditIndicator} 
                    showEditModal={this.showEditModal}
                    address={order.shipment.billing_address} 
                    bill_or_ship={"billing"} 
                    propertyToEdit={this.state.propertyToEdit}
                  />
                </div>
              </div>

              <hr/>

              <h5>Date Shipped</h5>
              {order.shipment.date_shipped ? order.shipment.date_shipped : "Not Shipped Yet"}

              <hr/>

              <Form 
                onSubmit={(e) => this.updateShipmentStatus(e)}
                submitButtonText={"update shipment statues"}
                formFields={this.createFormFields()}
                form='update_shipment_status_form'
              />
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

      </div>
    )
  }
}

const AddressDisplay = ({ address, showEditIndicator, propertyToEdit, showEditModal, bill_or_ship }) => {
  // logic stuff up here

  // TO DO
  // MAP THROUGH ADDRESS OBJECT TO CLEAN UP
  return (
    <div>
      <div>
        First Name: <a className="inline" onClick={() => showEditIndicator("first_name", bill_or_ship)} >{address.first_name}</a>
        {propertyToEdit && propertyToEdit.property === "first_name" && propertyToEdit.bill_or_ship === bill_or_ship && 
          <FontAwesomeIcon 
            icon={faEdit} 
            onClick={() => showEditModal("first_name", address)} 
          />
        }
      </div>
      <div>
        Last Name: <a className="inline" onClick={() => showEditIndicator("last_name", bill_or_ship)} >{address.last_name}</a>
        {propertyToEdit && propertyToEdit.property === "last_name" && propertyToEdit.bill_or_ship === bill_or_ship && 
          <FontAwesomeIcon 
            icon={faEdit} 
            onClick={() => showEditModal("last_name", address)} 
          />
        }
      </div>
      <div>
        Company: <a className="inline" onClick={() => showEditIndicator("company", bill_or_ship)} >{address.company}</a>
        {propertyToEdit && propertyToEdit.property === "company" && propertyToEdit.bill_or_ship === bill_or_ship && 
          <FontAwesomeIcon 
            icon={faEdit} 
            onClick={() => showEditModal("company", address)} 
          />
        }
      </div>
      <div>
        Address One: <a className="inline" onClick={() => showEditIndicator("street_address_1", bill_or_ship)} >{address.street_address_1}</a>
        {propertyToEdit && propertyToEdit.property === "street_address_1" && propertyToEdit.bill_or_ship === bill_or_ship && 
          <FontAwesomeIcon 
            icon={faEdit} 
            onClick={() => showEditModal("street_address_1", address)} 
          />
        }
      </div>
      <div>
        Address Two: <a className="inline" onClick={() => showEditIndicator("street_address_2", bill_or_ship)} >{address.street_address_2}</a>
        {propertyToEdit && propertyToEdit.property === "street_address_2" && propertyToEdit.bill_or_ship === bill_or_ship && 
          <FontAwesomeIcon 
            icon={faEdit} 
            onClick={() => showEditModal("street_address_2", address)} 
          />
        }
      </div>
      <div>
        City: <a className="inline" onClick={() => showEditIndicator("city", bill_or_ship)} >{address.city}</a>
        {propertyToEdit && propertyToEdit.property === "city" && propertyToEdit.bill_or_ship === bill_or_ship && 
          <FontAwesomeIcon 
            icon={faEdit} 
            onClick={() => showEditModal("city", address)} 
          />
        }
      </div>
      <div>
        State: <a className="inline" onClick={() => showEditIndicator("state", bill_or_ship)} >{address.state}</a>
        {propertyToEdit && propertyToEdit.property === "state" && propertyToEdit.bill_or_ship === bill_or_ship && 
          <FontAwesomeIcon 
            icon={faEdit} 
            onClick={() => showEditModal("state", address)} 
          />
        }
      </div>
      <div>
        Zip Code: <a className="inline" onClick={() => showEditIndicator("zip_code", bill_or_ship)} >{address.zip_code}</a>
        {propertyToEdit && propertyToEdit.property === "zip_code" && propertyToEdit.bill_or_ship === bill_or_ship && 
          <FontAwesomeIcon 
            icon={faEdit} 
            onClick={() => showEditModal("zip_code", address)} 
          />
        }
      </div>
      <div>
        Phone Number: <a className="inline" onClick={() => showEditIndicator("phone_number", bill_or_ship)} >{address.phone_number}</a>
        {propertyToEdit && propertyToEdit.property === "phone_number" && propertyToEdit.bill_or_ship === bill_or_ship && 
          <FontAwesomeIcon 
            icon={faEdit} 
            onClick={() => showEditModal("phone_number", address)} 
          />
        }
      </div>
      <div>
        Country: <a className="inline" onClick={() => showEditIndicator("country", bill_or_ship)} >{address.country}</a>
        {propertyToEdit && propertyToEdit.property === "country" && propertyToEdit.bill_or_ship === bill_or_ship && 
          <FontAwesomeIcon 
            icon={faEdit} 
            onClick={() => showEditModal("country", address)} 
          />
        }
      </div>
    </div>
  )
}


function mapStateToProps({ form }) {
  return { form }
}
export default connect(mapStateToProps, null)(OrderPage)