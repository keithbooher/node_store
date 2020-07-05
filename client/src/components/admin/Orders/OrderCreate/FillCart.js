import React, { Component } from 'react'
import { connect } from 'react-redux'
import Form from "../../../shared/Form"
import { reset } from "redux-form"
import { getProductbyname } from "../../../../utils/API"
class FillCart extends Component {
  constructor(props) {
    super()
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.addToLineItems = this.addToLineItems.bind(this)
    this.proceedToNextStep = this.proceedToNextStep.bind(this)
    this.state = {
      line_items: [],
      result: null
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

  renderTotal() {
    let total = 0
    this.state.line_items.forEach((item) => {
      total = total + (item.product_price * item.quantity)
    })
    return total
  }

  proceedToNextStep() {
    let cart = this.props.cart
    cart.line_items = this.state.line_items
    cart.checkout_state = "shipping"
    cart.total = this.renderTotal()
    

    // MAKE API REQUEST TO MAKE THIS AN OFFICIAL CART IN DB

    let state = {
      cart,
      step: "shipping",
    }
    this.props.topStateSetter(state)
    this.props.dispatch(reset("product_order_search_form"))
  }

  render() {
    console.log(this.state)
    return (
      <div>
        <div>Search For Line Items to add to the cart</div>
          <Form 
            onSubmit={this.handleSearchSubmit}
            submitButtonText={"Search For product"}
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
                        <div style={{ flexBasis: "25%" }}>
                          <div><img style={{ height: "150px", width: "auto" }} src={item.image}/></div>
                          <div>{item.product_name}</div>
                          <div>${item.product_price}</div>
                          <div>{item.quantity}</div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              <div>
                Total: ${this.renderTotal()}
              </div>
            </>
          }

          <button onClick={this.proceedToNextStep}>Move to shipping step</button>
      </div>
    )
  }
}

function mapStateToProps({ form }) {
  return { form }
}

export default connect(mapStateToProps, null)(FillCart)
