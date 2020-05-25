import React, { Component } from 'react'
import { getOrder } from "../../../utils/API"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEdit } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import loadingGif from '../../../images/pizzaLoading.gif'

class Orders extends Component {
  constructor(props) {
    super()
    this.order_id = props.match.params.id
    this.state = {
      order: null
    }
  }
  
  async componentDidMount() {
    let order = await getOrder(this.order_id )
    order = order.data
    this.setState({ order })
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
            </>
          : <img className="loadingGif" src={loadingGif} />
        }

      </div>
    )
  }
}


export default Orders