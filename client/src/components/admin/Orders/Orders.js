import React, { Component } from 'react'
import { paginatedOrders, lastOrder } from "../../../utils/API"
import loadingGif from '../../../images/pizzaLoading.gif'
import PageChanger from "../../shared/PageChanger"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faPlusCircle, faCaretDown } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import QuickView from './QuickView';
import Form from "../../shared/Form"
import { connect } from 'react-redux'
import mobile from "is-mobile"

let isMobile = mobile()

class Orders extends Component {
  constructor(props) {
    super()
    this.changePage = this.changePage.bind(this)
    this.changeOrderTab = this.changeOrderTab.bind(this)
    this.state = {
      orders: [],
      page_number: 1,
      chosen_order: null,
      last_order: null,
      status_filter: "pending",
      dropDownField: [
        { 
          label: "By Order Status", 
          name: "order_status", 
          typeOfComponent: "dropdown",
          options: [
            {
              default: true,
              value: "pending",
              name: "pending",
              redux_field: "order_status"
            },
            {
              default: false,
              value: "processing",
              name: "processing",
              redux_field: "order_status"
            },
            {
              default: false,
              value: "complete",
              name: "complete",
              redux_field: "order_status"
            },
            {
              default: false,
              value: "cancelled",
              name: "cancelled",
              redux_field: "order_status"
            },
            {
              default: false,
              value: "returned",
              name: "returned",
              redux_field: "order_status"
            },
            {
              default: false,
              value: "all",
              name: "all",
              redux_field: "order_status"
            },
          ], 
          noValueError: `You must provide a value` 
        },
      ]
    }
  }
  
  async componentDidMount() {
    const orders = await paginatedOrders("none", "none", "pending").then(res => res.data)
    const last_order = await lastOrder().then(res => res.data)
    this.setState({ orders, last_order })
  }

  // figuring out which hidden order tab to show when selected
  setOrder(order) {
    order = {...order}
    switch (this.state.chosen_order) {
      case order._id:
        this.setState({ chosen_order: null })        
        break;
      case null:
        this.setState({ chosen_order: order._id })        
        break;
      default:
        this.setState({ chosen_order: order._id })
        break;
    }
  }

  async changeOrderTab() {
    let status = this.props.form.order_status_dropdown.values.order_status.value

    let dropDownField = this.state.dropDownField
    dropDownField[0].options = dropDownField[0].options.map((option) => {
      if (option.name === status) {
        return (
          {
            default: true,
            value: option.name,
            name: option.name
          }
        )
      } else {
        return (
          {
            default: false,
            value: option.name,
            name: option.name
          }
        )
      }
    })
    const orders = await paginatedOrders("none", "none", status).then(res => res.data)
    this.setState({ orders, status_filter: status, dropDownField })
  }

  async changePage(direction_reference_id, direction, page_increment) {
    const orders = await paginatedOrders(direction_reference_id, direction, this.state.status_filter).then(res => res.data)
    this.setState({ orders, page_number: this.state.page_number + page_increment })
  }

  renderOrders() {
    return this.state.orders.map((order) => {
      return (
        <>
          <tr className="clickable margin-xs-v color-white" style={{ backgroundColor: 'rgb(45, 45, 45)' }} data-order-tab={order._id} >
            <td onClick={ () => this.setOrder(order)} className="padding-xs flex justify-content-space-between quick-view">
              <a className="margin-auto-h"><FontAwesomeIcon style={{ fontSize: "20px" }} icon={faCaretDown} /></a>
            </td>
            <td className="padding-xs">
              <Link  style={{ display: "inline"}} to={`/admin/orders/${order._id}`}>
                <FontAwesomeIcon icon={faEdit} style={{ display: "inline"}} /><span style={{  marginLeft: "5px" }}>...{order._id.substring(order._id.length - 4)}</span>
              </Link>
            </td>
            <td className="padding-xs">
              <Link to={`/admin/users/${order._user_id}`}>{order.email}</Link>
            </td>
            {!isMobile && <td className="padding-xs">
              <span>{new Date(order.date_placed).toDateString()}</span>
            </td>}
            {!isMobile && <td className="padding-xs">
              <span>${order.total}</span>
            </td>}
            {!isMobile && <td className="padding-xs text-align-center">
              <span>{order.status}</span>
            </td>}
          </tr>
          
          <tr>
            <td colspan="6">{this.state.chosen_order === order._id ? <QuickView order={order} /> : ""}</td>
          </tr>
        </>
      )
    })
  }

  render() {
    let lastPossibleItem = false
    if (this.state.orders.length > 0 && this.state.last_order) {
      if (this.state.orders[this.state.orders.length - 1]._id === this.state.last_order._id) {
        lastPossibleItem = true
      }
    }

    return (
      <div>
        <div className="flex" style={{ marginTop: "20px" }}>
          <Link to="/admin/order/create" className="text-align-center flex flex_column align-items-center padding-s"><FontAwesomeIcon style={{ fontSize: '30px' }} icon={faPlusCircle} /><div>New Order</div></Link>
          <div style={{ width: "20em" }}>
            <Form
              submitButton={<div/>}
              onChange={this.changeOrderTab}
              formFields={this.state.dropDownField}
              form='order_status_dropdown'
            />
          </div>
        </div>


        <br/>
        <table>
          <thead>
            <tr>
              <th style={{ wordWrap: "normal", width: "2em" }}>Info</th>
              <th>Order Number</th>
              <th>Customer Email</th>
              {!isMobile && <th>Date Placed</th>}
              {!isMobile && <th>Total</th>}
              {!isMobile && <th>Status</th>}
            </tr>
          </thead>
          <tbody>
            {this.state.orders.length !== 0 ? this.renderOrders() : <img className="loadingGif" src={loadingGif} /> }
          </tbody>
        </table>
        <PageChanger 
          page_number={this.state.page_number} 
          list_items={this.state.orders} 
          requestMore={this.changePage} 
          lastPossibleItem={lastPossibleItem} 
        />
      </div>
    )
  }
}


function mapStateToProps({ form }) {
  return { form }
}

export default connect(mapStateToProps, null)(Orders)