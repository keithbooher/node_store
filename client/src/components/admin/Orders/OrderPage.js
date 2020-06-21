import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getOrder, updateShipment } from "../../../utils/API"
import { Link } from "react-router-dom"
import loadingGif from '../../../images/pizzaLoading.gif'
import Form from "../../shared/Form"
import  { shippingStatusDropDown }  from "./formFeilds"  

class OrderPage extends Component {
  constructor(props) {
    super()
    this.order_id = props.match.params.id
    this.state = {
      order: null
    }
  }
  
  async componentDidMount() {
    let order = await getOrder(this.order_id).then(res => res.data)
    this.setState({ order })
  }


  async updateShipmentStatus(e) {
    console.log('?')
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

  render() {
    let order = this.state.order

    return (
      <div>
        {
          this.state.order !== null ?
            <>
              <Link to="/admin/orders">Back Orders</Link>
              <h3 className="underline">Order Data</h3>
              <div>Order ID: {order._id}</div>
              <h3 className="underline">Shipment Data</h3>
        
              <div>{JSON.stringify(order.shipment)}</div>

              <Form 
                onSubmit={(e) => this.updateShipmentStatus(e)}
                submitButtonText={"update shipment statues"}
                formFields={this.createFormFields()}
                form='update_shipment_status_form'
              />
            </>
          : <img className="loadingGif" src={loadingGif} />
        }

      </div>
    )
  }
}


function mapStateToProps({ form }) {
  return { form }
}
export default connect(mapStateToProps, null)(OrderPage)