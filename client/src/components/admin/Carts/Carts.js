import React, { Component } from 'react'
import { connect } from 'react-redux'
import { paginatedCarts, lastCart } from "../../../utils/API"
import loadingGif from '../../../images/pizzaLoading.gif'
import PageChanger from "../../shared/PageChanger"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faSearch } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import Form from "../../shared/Form"

class Carts extends Component {
  constructor(props) {
    super()
    this.changePage = this.changePage.bind(this)
    this.changeCartTab = this.changeCartTab.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.state = {
      carts: [],
      page_number: 1,
      last_cart: null,
      status_filter: "shopping",
      search_term: "none",
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
              value: "complete",
              name: "complete",
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
    let carts = await this.props.paginatedCarts("none", "none", "shopping", "none")
    let last_cart = await this.props.lastCart("shopping", "none")
    this.setState({ carts: carts.data, last_cart: last_cart.data })
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

    let carts = await this.props.paginatedCarts("none", "none", status, this.state.search_term)
    let last_cart = await this.props.lastCart(status, this.state.search_term)
    this.setState({ carts: carts.data, status_filter: status, dropDownField, last_cart: last_cart.data })
  }

  async changePage(direction_reference_id, direction, page_increment) {
    const carts = await this.props.paginatedCarts(direction_reference_id, direction, this.state.status_filter, this.state.search_term)
    this.setState({ carts: carts.data, page_number: this.state.page_number + page_increment })
  }


  async handleSearchSubmit() {
    const search_for_cart = !this.props.form['cart_search_form'].values ?  "none" : this.props.form['cart_search_form'].values.search_bar
    const { data } = await this.props.paginatedCarts("none", "none", this.state.status_filter, search_for_cart)
    const last_cart = await this.props.lastCart(this.state.status_filter, search_for_cart)
    this.setState({ carts: data, search_term: search_for_cart, page_number: 1, last_cart: last_cart.data })
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
            <Form 
              onSubmit={this.handleSearchSubmit}
              submitButtonText={<FontAwesomeIcon icon={faSearch} />}
              searchButton={true}
              formFields={[{ label: 'Search By Email or Customer Name', name: 'search_bar', noValueError: 'You must provide an address' }]}
              form='cart_search_form'
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

const actions = { paginatedCarts, lastCart }

export default connect(mapStateToProps, actions)(Carts)