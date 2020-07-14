import React, { Component } from 'react'
import { connect } from 'react-redux'
import Form from "../../../shared/Form"
import { reset } from "redux-form"
import { getProductbyname, createCart, updateCart } from "../../../../utils/API"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faTrash, faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons"
class FillCart extends Component {
  constructor(props) {
    super()
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.addToLineItems = this.addToLineItems.bind(this)
    this.proceedToNextStep = this.proceedToNextStep.bind(this)
    this.state = {
      line_items: [],
      result: null,
      update: false
    }
  }

  componentDidMount() {
    console.log(this.props.cart)
    if (this.props.cart.line_items && this.props.cart.line_items.length > 0) {
      this.setState({ line_items: this.props.cart.line_items, update: true })
    }
  }

  async handleSearchSubmit() {
    const search_for_product = this.props.form['product_order_search_form'].values
    const { data } = await getProductbyname(search_for_product.name)
    this.setState({ result: data })
  }

  addToLineItems(product) {
    // MAKE A CHECK TO SEE IF THE LINE ITEM IS ALREADY I THE ARRAY, IF SO, JUST ADD QUANTITY
    let line_items = [...this.state.line_items]

    let already_in_array = false
    line_items.forEach(item => {
      if( item._product_id === product._id) { 
        item.quantity += 1
        already_in_array = true
      }
    });

    // If the product is not in the array, we construct
    //  the object and push it to the lien items array
    if (!already_in_array) {
      let line_item = {
        product_name: product.name,
        image: product.image,
        _product_id: product._id,
        quantity: 1,
        product_price: product.price
      }
      line_items.push(line_item)
    } 

    this.setState({ line_items })
  }

  removeLineItem(item) {
    let line_items = this.state.line_items.filter((line_item) => line_item._product_id !== item._product_id)
    this.setState({ line_items })
  }

  adjustLineItemQuantity(item, up_or_down) {
    let line_items = this.state.line_items
    
    line_items.map((line_item) => {
      if (line_item._product_id === item._product_id) {
        if (up_or_down === "down") {
          console.log(line_item)
          line_item.quantity = line_item.quantity - 1
        } else {
          console.log(line_item)
          line_item.quantity = line_item.quantity + 1
        }
      }
    })
    line_items = line_items.filter((line_item) => line_item.quantity !== 0)
    this.setState({ line_items })
  }

  renderTotal() {
    let total = 0
    this.state.line_items.forEach((item) => {
      total = total + (item.product_price * item.quantity)
    })
    return total
  }

  async proceedToNextStep() {
    let cart = this.props.cart
    cart.line_items = this.state.line_items
    cart.checkout_state = "shipping"
    cart.total = this.renderTotal()
    

    // MAKE API REQUEST TO MAKE THIS AN OFFICIAL CART IN DB
    let request
    if (this.state.update) {
      request = await updateCart(cart)
    } else {
      request = await createCart(cart)
    }

    let state = {
      cart: request.data,
      step: "shipping",
    }
    this.props.topStateSetter(state)
    this.props.dispatch(reset("product_order_search_form"))

    this.props.refProp.current.scrollTo(0, 0);
  }

  render() {
    return (
      <div style={{ marginTop: "30px" }}>
        <div>Search For Line Items to add to the cart</div>
          <Form 
            onSubmit={this.handleSearchSubmit}
            submitButtonText={<FontAwesomeIcon icon={faSearch} />}
            searchButton={true}
            formFields={[
              { label: 'Search For Product By Name', name: 'name', noValueError: 'You must provide an name' },
            ]}
            form='product_order_search_form'
          />

          {this.state.result &&
            <>
              <h2>Product Found</h2>
              <h3>{this.state.result.name}</h3>
              <button onClick={() => this.addToLineItems(this.state.result)}>Add to cart</button>
            </>
          }

          {this.state.line_items.length > 0 &&
            <>
              <div>
                <h1 style={{ textDecoration: "underline"}}> Cart</h1>
                <h3>Line Items</h3>
                <div  className="flex flex-wrap space-evenly">
                  {this.state.line_items.map((item) => {
                    return (
                        <div className="relative padding-m background-color-grey-2" style={{ flexBasis: "100%", marginTop: "10px" }}>
                          <FontAwesomeIcon onClick={() => this.removeLineItem(item)} className="absolute" style={{ right: "0px", top: "0px" }} icon={faTrash} />
                          <div><img style={{ height: "auto", width: "98%" }} src={item.image}/></div>
                          <div>{item.product_name}</div>
                          <div>Price: ${item.product_price}</div>
                          <div>
                            Quantity: {item.quantity}
                            <FontAwesomeIcon 
                              onClick={() => this.adjustLineItemQuantity(item, "up")} 
                              icon={faCaretUp} 
                            />
                            <FontAwesomeIcon 
                              onClick={() => this.adjustLineItemQuantity(item, "down")} 
                              icon={faCaretDown} 
                            />
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              <div className="margin-s-v">
                Total: ${this.renderTotal()}
              </div>
            </>
          }

         {this.state.line_items.length > 0 && <button onClick={this.proceedToNextStep}>Move to shipping step</button>}
      </div>
    )
  }
}

function mapStateToProps({ form }) {
  return { form }
}

export default connect(mapStateToProps, null)(FillCart)
