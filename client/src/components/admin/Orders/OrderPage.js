import React, { Component } from 'react'
import { paginatedOrders, lastOrder, getOrder } from "../../../utils/API"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEdit } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"

class Orders extends Component {
  constructor(props) {
    super()
    this.order_id = props.match.params.order
    this.state = {
      order: null
    }
  }
  
  async componentDidMount() {
    const order = await getOrder(this.order_id )
    order = order.data
    this.setState({ order })
  }

  render() {
    return (
      <div>
        <Link to="/admin/orders">Back Orders</Link>
      </div>
    )
  }
}


export default Orders