import React, { Component } from 'react'
import { connect } from 'react-redux'
import Form from "../../shared/Form"
import { reset } from "redux-form"
import { getProductbyName, updateCart, checkInventory } from "../../../utils/API"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faTrash, faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons"


class CartLineItems extends Component {
  constructor(props) {
    super()
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)

    this.state = {
      cart: props.cart,
      quantity: 1,
      addProduct: false,
      result: null
    }
  }
  async handleSearchSubmit() {
    const search_for_product = this.props.form['product_order_search_form'].values
    const { data } = await getProductbyName(search_for_product.name)
    this.setState({ result: data })
  }

  addToLineItems(product) {
    // MAKE A CHECK TO SEE IF THE LINE ITEM IS ALREADY I THE ARRAY, IF SO, JUST ADD QUANTITY
    let line_items = [...this.props.cart.line_items]

    let already_in_array = false
    line_items.forEach(item => {
      if( item._product_id === product._id) { 
        item.quantity += this.state.quantity
        already_in_array = true
      }
    })

    // If the product is not in the array, we construct
    //  the object and push it to the lien items array
    if (!already_in_array) {
      let line_item = {
        product_name: product.name,
        image: product.image,
        _product_id: product._id,
        quantity: this.state.quantity,
        product_price: product.price,
        product_path: `/shop/${product.categories.length > 0 ? product.categories[0].path_name : "general"}/${product.path_name}`
      }
      line_items.push(line_item)
    } 

    let cart = this.props.cart

    cart.line_items = line_items

    this.props.dispatch(reset("product_order_search_form"))

    this.props.addToLineItems(cart)

    this.setState({ cart, addProduct: false })

  }

  removeLineItem(item) {
    let line_items = this.props.cart.line_items.filter((line_item) => line_item._product_id !== item._product_id)
    let cart = this.props.cart
    cart.line_items = line_items
    this.props.removeLineItem(cart)
    this.setState({ cart })
  }

  async adjustLineItemQuantity(item, up_or_down) {
    let line_items = this.props.cart.line_items
    
    let line_items_adjusted = await Promise.all(line_items.map(async (line_item) => {
      if (line_item._product_id === item._product_id) {
        if (up_or_down === "down") {
          line_item.quantity = line_item.quantity - 1
        } else {
          line_item.quantity = line_item.quantity + 1
          let { data } = await checkInventory([line_item])
          let out_of_stock = data.filter((oos_item) => oos_item !== null)
          if (out_of_stock.length > 0) {
            line_item.quantity = line_item.quantity - 1
          }
        }
      }
      return line_item
    }))
    line_items = line_items_adjusted.filter((line_item) => line_item.quantity !== 0)

    let cart = this.props.cart
    cart.line_items = line_items

    this.props.adjustLineItemQuantity(cart)
    this.setState({ cart })
  }

  setQuantity(direction, product) {
    let quantity
    if(direction === "up") {
      quantity = this.state.quantity + 1
    } else {
      quantity = this.state.quantity - 1
    }
    
    if (direction == "up" && !product.backorderable && quantity > product.inventory_count || quantity < 1) {
      return
    }
    this.setState({ quantity })
  }

  checkInventoryCount(e, product) {
    let value = e.target.value
    if (value > product.inventory_count) {
      value = product.inventory_count
      this.setState({ quantity: value })
    }
    if (value === "") {
      value = 1
      this.setState({ quantity: value })
    }
  }

  onChangeInput(e) {
    let value = parseInt(e.target.value)

    if (e.target.value === "") {
      value = ""
    }
    this.setState({ quantity: value })
  }

  preventAlpha(e) {
    if (!this.isNumber(e)) {
      e.preventDefault();
    }
  }

  isNumber(e) {
    var charCode = e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
  }
  
  render(){
    console.log(this.props.cart)
    return (
      <div>
        <h2>Line Items</h2>
        <div  className="flex flex-wrap space-evenly">
          {this.props.cart.line_items.map((item) => {
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

        {!this.state.addProduct && <button onClick={() => this.setState({ addProduct: true })}>Add Product</button>}

        {this.state.addProduct && 
          <>
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
                <h3>Product Found</h3>
                <h3>{this.state.result.name}</h3>
                <div>
                  <img src={this.state.result.image} style={{ height: "auto", width: "auto", maxWidth: "150px", maxHeight: "150px" }} />
                </div>
                {!this.state.result.backorderable ? <p>On hand: {this.state.result.inventory_count}</p> : <p>backorderable</p>}
                <div className="flex">
                  <input onKeyDown={(e) => this.preventAlpha(e)} onChange={(e) => this.onChangeInput(e)} onBlur={e => this.checkInventoryCount(e, this.state.result)} style={{ width: "60px" }} className="inline quantity_input" value={this.state.quantity} defaultValue={1}/>
                  <div className="flex flex_column margin-s-h">
                    <FontAwesomeIcon onClick={() => this.setQuantity("up", this.state.result)} icon={faCaretUp} />
                    <FontAwesomeIcon onClick={() => this.setQuantity("down", this.state.result)} icon={faCaretDown} />
                  </div>
                  <button onClick={() => this.addToLineItems(this.state.result)}>Add to cart</button>
                </div>
              </>
            }

            {this.state.result === "" && <h3>No product found, check for typos</h3>}
          </>
        }
      </div>
    )
  }
}

function mapStateToProps({ form }) {
  return { form }
}

export default connect(mapStateToProps, null)(CartLineItems)