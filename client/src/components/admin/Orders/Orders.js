import React, { Component } from 'react'
import { paginatedOrders, lastOrderAdmin } from "../../../utils/API"
import { dispatchObj } from "../../../actions"
import PageChanger from "../../shared/PageChanger"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faPlusCircle, faCaretDown, faSearch, faSpider, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import QuickView from './QuickView'
import Form from "../../shared/Form"
import { connect } from 'react-redux'
import mobile from "is-mobile"
import { reset } from "redux-form"


let isMobile = mobile()

class Orders extends Component {
  constructor(props) {
    super()
    this.changePage = this.changePage.bind(this)
    this.changeOrderTab = this.changeOrderTab.bind(this)
    this.state = {
      orders: null,
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
              value: "refunded",
              name: "refunded",
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
    const orders = await this.props.paginatedOrders("none", "none", "pending", "none").then(res => res.data)
    const last_order = await this.props.lastOrderAdmin("pending", "none").then(res => res.data)
    this.setState({ orders, last_order })
  }

  async handleSearchSubmit() {
    const search_for_order = this.props.form['order_search_form'].values && this.props.form['order_search_form'].values.search_bar
    let status_filter = !search_for_order ? "all" : this.state.status_filter

    let orders
    let last_order
    if (!search_for_order) {
      orders = await this.props.paginatedOrders("none", "none", status_filter, "none")
      last_order = await this.props.lastOrderAdmin(status_filter, "none").then(res => res.data)
    } else {
      orders = await this.props.paginatedOrders("none", "none", status_filter, search_for_order)
      last_order = await this.props.lastOrderAdmin(status_filter, search_for_order).then(res => res.data)
    }
    this.setState({ orders: orders.data, page_number: 1, status_filter, last_order })
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
    let status_filter = this.props.form.order_status_dropdown.values.order_status.value

    const orders = await this.props.paginatedOrders("none", "none", status_filter, "none").then(res => res.data)
    let last_order = await this.props.lastOrderAdmin(status_filter, "none").then(res => res.data)

    this.props.dispatchObj(reset("order_search_form"))
    this.setState({ orders, status_filter, page_number: 1, last_order })
  }

  async changePage(direction_reference_id, direction, page_increment) {
    const search_for_order = this.props.form['order_search_form'].values ? this.props.form['order_search_form'].values.search_bar : "none"
    let search_term = !search_for_order ? "none" : search_for_order

    const orders = await this.props.paginatedOrders(direction_reference_id, direction, this.state.status_filter, search_term).then(res => res.data)
    let last_order = await this.props.lastOrderAdmin(this.state.status_filter, search_term).then(res => res.data)

    this.setState({ orders, page_number: this.state.page_number + page_increment, last_order })
  }

  // TO DO
  // MOVE THIS TO ITS OWN COMPONENT
  renderOrders() {
    return this.state.orders.map((order, index) => {
      return (
        <>
          <tr key={index} className="clickable margin-xs-v color-white" style={{ backgroundColor: 'rgb(45, 45, 45)' }} data-order-tab={order._id} >
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
    console.log(this.state)
    let lastPossibleItem = false
    if (this.state.orders && this.state.orders.length > 0 && this.state.last_order) {
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

        <Form 
          onSubmit={(e) => this.handleSearchSubmit(e)}
          submitButtonText={<FontAwesomeIcon icon={faSearch} />}
          searchButton={true}
          formFields={[{ label: 'Search By Email or Number', name: 'search_bar', noValueError: 'You must provide an address' }]}
          form='order_search_form'
        />

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
            {this.state.orders !== null ? this.renderOrders() : <FontAwesomeIcon className="loadingGif" icon={faSpinner} />}
          </tbody>
        </table>
        <div>
          <h2>{this.state.orders && this.state.orders.length === 0 && "There are no orders"}</h2>
        </div>
        {this.state.orders &&
          <PageChanger 
            page_number={this.state.page_number} 
            list_items={this.state.orders} 
            requestMore={this.changePage} 
            lastPossibleItem={lastPossibleItem} 
          />
        }
      </div>
    )
  }
}


function mapStateToProps({ form }) {
  return { form }
}

const actions = { paginatedOrders, lastOrderAdmin, dispatchObj }

export default connect(mapStateToProps, actions)(Orders)