import React, { Component } from 'react'
import { connect } from 'react-redux'
import { paginatedCarts, lastCart } from "../../../utils/API"
import loadingGif from '../../../images/pizzaLoading.gif'
import PageChanger from "../../shared/PageChanger"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import Form from "../../shared/Form"

class Carts extends Component {
  constructor(props) {
    super()
    this.changePage = this.changePage.bind(this)
    this.changeCartTab = this.changeCartTab.bind(this)
    this.state = {
      carts: [],
      page_number: 1,
      last_cart: null,
      status_filter: "shopping",
      dropDownField: [
        { 
          label: "Filter", 
          name: "cart_status", 
          typeOfComponent: "dropdown",
          options: [
            {
              default: true,
              value: "shopping",
              name: "shopping",
              redux_field: "cart_status"
            },
            {
              default: false,
              value: "address",
              name: "address",
              redux_field: "cart_status"
            },
            {
              default: false,
              value: "shipping",
              name: "shipping",
              redux_field: "cart_status"
            },
            {
              default: false,
              value: "payment",
              name: "payment",
              redux_field: "cart_status"
            },
            {
              default: false,
              value: "abandoned",
              name: "abandoned",
              redux_field: "cart_status"
            },
            {
              default: false,
              value: "deleted",
              name: "deleted",
              redux_field: "cart_status"
            },
            {
              default: false,
              value: "all",
              name: "all",
              redux_field: "cart_status"
            },
          ], 
          noValueError: `You must provide a value` 
        },
      ]
    }
  }
  
  async componentDidMount() {
    const carts = await paginatedCarts("none", "none", "shopping").then(res => res.data)
    const last_cart = await lastCart().then(res => res.data)
    this.setState({ carts, last_cart })
  }

  async changeCartTab() {
    let status = this.props.form.cart_status_dropdown.values.cart_status.value

    let dropDownField = this.state.dropDownField
    let options = dropDownField[0].options.map((option) => {
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

    dropDownField.options = options

    const carts = await paginatedCarts("none", "none", status).then(res => res.data)
    this.setState({ carts, status_filter: status, dropDownField })
  }

  async changePage(direction_reference_id, direction, page_increment) {
    const carts = await paginatedCarts(direction_reference_id, direction, this.state.status_filter).then(res => res.data)
    this.setState({ carts, page_number: this.state.page_number + page_increment })
  }

  render() {
    let lastPossibleItem = false
    if (this.state.carts.length > 0 && this.state.last_cart) {
      if (this.state.carts[this.state.carts.length - 1]._id === this.state.last_cart._id) {
        lastPossibleItem = true
      }
    }

    return (
      <div>
        <div className="flex" style={{ marginTop: "20px" }}>
          <div style={{ width: "20em" }}>
            <Form
              submitButton={<div/>}
              onChange={this.changeCartTab}
              formFields={this.state.dropDownField}
              form='cart_status_dropdown'
            />
          </div>
        </div>


        <br/>
        <table>
          <thead>
            <tr>
              <th>email</th>
              <th>total</th>
              <th>Date Created</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {this.state.carts.length !== 0 ? <RenderReviews carts={this.state.carts} /> : <img className="loadingGif" src={loadingGif} /> }
          </tbody>
        </table>
        <PageChanger 
          page_number={this.state.page_number} 
          list_items={this.state.carts} 
          requestMore={this.changePage} 
          lastPossibleItem={lastPossibleItem} 
        />
      </div>
    )
  }
}

const RenderReviews = ({carts}) => {
  return carts.map((cart) => {
    return (
      <tr className="background-color-grey-7 margin-xs-v">
        <td>{cart.email ? cart.email : "guest"}</td>
        <td>{cart.total}</td>
        <td>{`${cart.created_at}`.split("T")[0]}</td>
        <td><Link to={`/admin/cart/${cart._id}`} ><FontAwesomeIcon icon={faEdit} /></Link></td>
      </tr>
    )
  })
}

function mapStateToProps({ form }) {
  return { form }
}

export default connect(mapStateToProps, null)(Carts)