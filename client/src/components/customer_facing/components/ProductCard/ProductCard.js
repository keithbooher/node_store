import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { capitalizeFirsts, calculateSubtotal, formatMoney } from '../../../../utils/helperFunctions'
import loadingGif from '../../../../images/pizzaLoading.gif'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons"
import Modal from "../../../shared/Modal"
import './productCard.css.scss'
import { dispatchEnlargeImage, showCartAction } from "../../../../actions"
import { LazyLoadImage } from 'react-lazy-load-image-component'

class ProductCard extends Component {
  constructor(props) {
    super()
    this.setQuantity = this.setQuantity.bind(this)
    this.checkInventoryCount = this.checkInventoryCount.bind(this)
    this.state = {
      quantity: 1,
      exceededInventory: null,
      enlargeImage: null
    }
  }

  addToCart() {
    let product = this.props.product
    let cart = {...this.props.cart}
    const quantity = this.state.quantity
    const user_id = this.props.user._id
    let exceededInventory = false

    console.log(this.props.user)

    let product_path_name = product.path_name

    let sub_total, create_boolean

    if (this.props.cart == null) {
      create_boolean = true
      cart = {
        line_items: [
          {
            product_name: product.name,
            image: product.image,
            _product_id: product._id,
            quantity: quantity,
            product_price: product.price,
            product_path: `/shop/${product.categories[0].path_name}/${product_path_name}`
          }
        ],
        _user_id: user_id,
        email: this.props.user.email,
        created_at: new Date()
      }
    } else {
      create_boolean = false
      sub_total = 0
      // CHECK TO SEE IF PRODUCT IS CONTAINED WITHIN CART ALREADY
      let found = false;
      for(var i = 0; i < cart.line_items.length; i++) {
        if (cart.line_items[i]._product_id == product._id) {
            found = true;
            break;
        }
      }

      // IF FOUND, SIMPLY UPDATE THE LINE ITEM QUANTITY. 
      // Also, check to see if this exceeds current inventory
      // OTHERWISE CREATE A NEW LINE_ITEM AND PUSH TO THE CART
      if(found === true) {
        cart.line_items = cart.line_items.map((line_item) => {
          if(product._id === line_item._product_id) {
            const sum = line_item.quantity + quantity
            if (!this.props.product.backorderable && sum > this.props.product.inventory_count) {
              exceededInventory = {
                inventory_count: this.props.product.inventory_count,
                quantity_added: quantity,
                current_line_item_quantity: line_item.quantity,
                difference: this.props.product.inventory_count - line_item.quantity
              }
              line_item.quantity = this.props.product.inventory_count
            } else {
              line_item.quantity += quantity
            }
          }
          return line_item
        })
      } else {
        let line_item = {
          product_name: product.name,
          image: product.image,
          _product_id: product._id,
          quantity: quantity,
          product_price: product.price,
          product_path: `/shop/${product.categories.length > 0 ? product.categories[0].path_name : "general"}/${product_path_name}`
        }
        cart.line_items.push(line_item)
      }
    }

    sub_total = calculateSubtotal(cart)
    let tax = sub_total * .08
    let shipping = cart.chosen_rate ? cart.chosen_rate.cost : 0

    cart.email = this.props.user.email

    cart.sub_total = formatMoney(sub_total)
    cart.tax = formatMoney(tax)
    cart.total = formatMoney(sub_total + tax + shipping)
    cart.checkout_state = "shopping"

    if (create_boolean === true) {
      this.props.createCart(cart)
    } else {
      this.props.updateCart(cart)
    }
    if (exceededInventory) {
      this.setState({ exceededInventory })
    }

    this.props.showCartAction(true)
    //////
  }

  setQuantity(direction) {
    let quantity
    if(direction === "up") {
      quantity = this.state.quantity + 1
    } else {
      quantity = this.state.quantity - 1
    }
    
    if (!this.props.product.backorderable && quantity > this.props.product.inventory_count || quantity < 1) {
      return
    }
    this.setState({ quantity })
  }

  checkInventoryCount(e) {
    let value = e.target.value
    if (value > this.props.product.inventory_count) {
      value = this.props.product.inventory_count
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

  enlargeImage(product, category_path_name) {
    this.props.dispatchEnlargeImage({ image: product.image, path: `/shop/${category_path_name}/${product.path_name}`})
  }

  render() {
    let product = this.props.product
    let category_path_name = this.props.category_path_name
    return (
      <>
        {this.props.auth !== null ? 
          <div className={`card margin-s-v ${product._id === "" && "hidden"}`}>
            <div className="card-content">
              <div style={{ marginBottom: "1em" }}>
                <div className="inline" style={{ fontSize: "22px" }}>${product.price}</div>
                <h2 className="inline card-title margin-s-h"><Link className="inline" to={`/shop/${category_path_name}/${product.path_name}`}>{capitalizeFirsts(product.name)}</Link></h2>
              </div>
              <div className="flex flex_column justify-center background-color-black card_image_container">
                <LazyLoadImage
                  src={product.image}
                  wrapperClassName="margin-auto-h card_image"
                  onClick={() => this.enlargeImage(this.props.product, category_path_name)}
                />
              </div>
              <div className="margin-s-v" style={{ fontSize: "18px" }}>{product.short_description}</div>
              {!product.backorderable && <div className="margin-s-v" style={{ fontSize: "14px" }}>In Stock: {product.inventory_count > 0 ? product.inventory_count : "Out Of Stock"}</div>}
            </div>
            <div className="flex">
              <div className="flex">
                <input onKeyDown={(e) => this.preventAlpha(e)} onChange={(e) => this.onChangeInput(e)} onBlur={e => this.checkInventoryCount(e)} style={{ marginRight: "5px", width: "60px" }} className="inline quantity_input" value={this.state.quantity} defaultValue={1}/>
                <div className="flex flex_column">
                  <FontAwesomeIcon onClick={() => this.setQuantity("up")} icon={faChevronUp} />
                  <FontAwesomeIcon onClick={() => this.setQuantity("down")} icon={faChevronDown} />
                </div>
              </div>
              <button className="margin-s-h inline" onClick={this.addToCart.bind(this)}>Add To Cart</button>
            </div>
          </div>
        : <img className="loadingGif" src={loadingGif} /> }

        {this.state.exceededInventory && 
          <Modal cancel={() => this.setState({ exceededInventory: false })}>
            <h3>
              You tried to add {this.state.exceededInventory.quantity_added} but that exceeds the current inventory stock of {this.state.exceededInventory.inventory_count}.
            </h3>
            <h3>
              Therefore, {this.state.exceededInventory.difference} {this.props.product.name}{this.state.exceededInventory.difference > 1 && "'s"} were added.
            </h3>
            <button onClick={() => this.setState({ exceededInventory: false })}>Okay</button>
          </Modal>
        }
    </>
    )
  }
}


const actions = { dispatchEnlargeImage, showCartAction }


function mapStateToProps({ zeroInventory }) {
  return { zeroInventory }
}


export default connect(mapStateToProps, actions)(ProductCard)