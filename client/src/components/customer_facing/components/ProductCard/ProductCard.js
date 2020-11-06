import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { capitalizeFirsts, calculateSubtotal, formatMoney } from '../../../../utils/helpFunctions'
import { getProductAverageRating} from '../../../../utils/API'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faChevronUp, faSpinner } from "@fortawesome/free-solid-svg-icons"
import Modal from "../../../shared/Modal"
import './productCard.css.scss'
import { dispatchEnlargeImage, showCartAction, showHeaderAction } from "../../../../actions"
import { LazyLoadImage } from 'react-lazy-load-image-component'
import StarRatings from 'react-star-ratings'
import VarietalDropdown from "../../../shared/Varietal/VarietalDropdown"
class ProductCard extends Component {
  constructor(props) {
    super()
    this.setQuantity = this.setQuantity.bind(this)
    this.checkInventoryCount = this.checkInventoryCount.bind(this)
    this.state = {
      quantity: 1,
      exceededInventory: null,
      enlargeImage: null,
      averRating: null,
      chosenVarietal: null,
      pickVarietal: false
    }
  }

  async componentDidMount() {
    const { data } = await this.props.getProductAverageRating(this.props.product._id)
    let varietal = null
    if (this.props.product.varietals && this.props.product.varietals.length > 0) {
      varietal = this.props.product.varietals[0]
    }

    this.setState({ averRating: data.average, chosenVarietal: varietal })
  }

  addToCart() {
    let product = this.props.product
    let cart = {...this.props.cart}
    const quantity = this.state.quantity
    const user_id = this.props.user._id
    let exceededInventory = false

    let product_path_name = product.path_name

    let sub_total, create_boolean

    if (this.props.cart == null) {
      create_boolean = true
      cart = {
        line_items: [
          {
            product_name: product.name,
            image: product.images.i1,
            _product_id: product._id,
            quantity: quantity,
            product_price: product.price,
            product_path: `/shop/${product.categories.length > 0 ? product.categories[0].path_name : "general" }/${product_path_name}`,
            varietal: this.state.chosenVarietal
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
          found = findIt(product, cart, i, this.state.chosenVarietal, quantity)
          if (found) {
            break
          }
        }
      }

      // IF FOUND, SIMPLY UPDATE THE LINE ITEM QUANTITY. 
      // Also, check to see if this exceeds current inventory
      // OTHERWISE CREATE A NEW LINE_ITEM AND PUSH TO THE CART
      if(found === true) {
        cart.line_items = cart.line_items.map((line_item) => {
          exceededInventory = checkInventoryCount(product, line_item, this.state.chosenVarietal, quantity)
          return line_item
        })
      } else {
        let line_item = {
          product_name: product.name,
          image: product.images.i1,
          _product_id: product._id,
          quantity: quantity,
          product_price: product.price,
          product_path: `/shop/${product.categories.length > 0 ? product.categories[0].path_name : "general"}/${product_path_name}`,
          varietal: this.state.chosenVarietal
        }
        cart.line_items.push(line_item)
      }
    }

    
    sub_total = Number(calculateSubtotal(cart))
    let tax = Number(sub_total * .08)
    let shipping = Number(cart.chosen_rate ? cart.chosen_rate.cost : 0)

    cart.discount_codes = []
    cart.discount = null
    
    cart.sub_total = sub_total
    cart.tax = tax
    cart.total = Number(sub_total + tax + shipping)
    cart.checkout_state = "shopping"

    cart.email = this.props.user.email


    if (create_boolean === true) {
      this.props.createCart(cart)
    } else {
      this.props.updateCart(cart)
    }

    this.setState({ exceededInventory, pickVarietal: false })

    this.props.showCartAction(true)
    this.props.showHeaderAction("scrolling_up_nav")
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
    if (this.props.product.backorderable) return
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
    this.props.dispatchEnlargeImage({ image: product.images.i1, path: `/shop/${category_path_name}/${product.path_name}`})
  }

  render() {
    let product = this.props.product
    let category_path_name = this.props.category_path_name
    let fontSize = "1em"
    if (!this.props.mobile) {
      fontSize = "20px"
    }
    return (
      <>
        {this.props.auth !== null ? 
          <div 
            style={this.props.related_product ? { margin: "0px 10px", minWidth: "280px" } : {} } 
            key={product._id} 
            className={`flex flex_column space-between border-radius st-product-card-shadow st-product-card-background 
                        ${this.props.related_product ? "" : "w-90"} 
                        ${this.props.related_product && "related_product"} margin-s-v 
                        ${product._id === "" && "hidden"}
                        ${this.props.mobile ? "card" : "card_desktop"}
                        color-white
                        `}
          >
            <div className="card-content">
              <div style={this.state.averRating ? { marginBottom: "10px" } : { marginBottom: "1em" }}>
                <h2 className="inline card-title margin-s-h"><Link className="inline hover-color-11" to={`/shop/${category_path_name}/${product.path_name}`}>{capitalizeFirsts(product.name)}</Link></h2>
              </div>
              {this.state.averRating &&
                <div style={{ marginBottom: "1em" }}>
                    <StarRatings
                      rating={this.state.averRating}
                      starRatedColor="#6CB2EB"
                      numberOfStars={5}
                      name='rating'
                      starDimension="15px"
                      starSpacing="1px"
                    />
                  </div>
                }
              <div className="border-radius-s flex flex_column justify-center background-color-black card_image_container">
                <LazyLoadImage
                  style={{ marginTop: "5px" }}
                  src={product.images.i1}
                  wrapperClassName="margin-auto-h card_image"
                  onClick={() => this.enlargeImage(this.props.product, category_path_name)}
                />
              </div>
              {!product.backorderable && <div className="margin-s-v" style={this.props.mobile ? { fontSize: "14px" } : { fontSize: "16px"}}>Stock: {product.inventory_count > 0 ? product.inventory_count : "Out Of Stock"}</div>}
              {!this.props.related_product && <div className="margin-s-v" style={{ fontSize: "16px" }}>{product.short_description}</div>}
            </div>
            <div>
              <div className="inline" style={{ fontSize: "22px" }}>${formatMoney(product.price)}</div>
              <div className={`flex ${this.props.related_product ? "margin-m-v" : "margin-s-v"}`}>
                <div className="flex">
                  <input onKeyDown={(e) => this.preventAlpha(e)} onChange={(e) => this.onChangeInput(e)} onBlur={e => this.checkInventoryCount(e)} style={{ marginRight: "5px", width: "60px" }} className="inline quantity_input" value={this.state.quantity} defaultValue={1}/>
                  <div className="flex flex_column">
                    <FontAwesomeIcon className="hover hover-color-2" onClick={() => this.setQuantity("up")} icon={faChevronUp} />
                    <FontAwesomeIcon className="hover hover-color-2" onClick={() => this.setQuantity("down")} icon={faChevronDown} />
                  </div>
                </div>
                <button 
                  className="margin-s-h inline" 
                  onClick={this.props.product.varietals && this.props.product.varietals.length > 0 ? 
                      () => this.setState({ pickVarietal: true })
                    :
                      this.addToCart.bind(this)
                  }
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        : <FontAwesomeIcon className="loadingGif" icon={faSpinner} spin /> }

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

        {this.state.pickVarietal && 
          <Modal cancel={() => this.setState({ pickVarietal: false })}>
            <div className="flex flex_column align-items-center">
              <div className={`text-align-center flex justify-center align-items-center background-color-black`} style={{ width: "100%", height: "100%", maxHeight: "350px", maxWidth: "350px" }}>
                <img style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "350px" }} src={this.state.chosenVarietal.images.i1} />
              </div>

              <VarietalDropdown 
                varietals={this.props.product.varietals} 
                setVarietal={(v) => this.setState({ chosenVarietal: v })} 
                chosenVarietal={this.state.chosenVarietal} 
              />

              <div className="flex margin-s-v">
                <button 
                  className="margin-s-h inline" 
                  onClick={this.addToCart.bind(this)}
                >
                  Add To Cart
                </button>
                <Link className="margin-s-h" to={`/shop/${category_path_name}/${product.path_name}`}><button>Go To Product Page</button></Link>
              </div>
            </div>
          </Modal>
        }
    </>
    )
  }
}

const checkInventoryCount = (product, line_item, chosenVarietal, quantity) => {
  let insufficient = false
  if (product.varietals.length > 0 && line_item._product_id == product._id && line_item.varietal && line_item.varietal._id === chosenVarietal._id) {
    let total = line_item.quantity + quantity
    if (total > chosenVarietal.inventory_count && !product.backorderable) {
      insufficient = {
        inventory_count: product.inventory_count,
        quantity_added: quantity,
        current_line_item_quantity: line_item.quantity,
        difference: product.inventory_count - line_item.quantity
      }
      line_item.quantity = product.inventory_count
    } else {
      line_item.quantity += quantity
    }
  } else if(!product.varietals && product._id === line_item._product_id) {
    const sum = line_item.quantity + quantity
    if (!product.backorderable && sum > product.inventory_count) {
      insufficient = {
        inventory_count: product.inventory_count,
        quantity_added: quantity,
        current_line_item_quantity: line_item.quantity,
        difference: product.inventory_count - line_item.quantity
      }
      line_item.quantity = product.inventory_count
    } else {
      line_item.quantity += quantity
    }
  }

  return insufficient
}

const findIt = (product, _cart, i, chosenVarietal) => {
  let found = false
  if (product.varietals.length > 0 && _cart.line_items[i]._product_id == product._id && _cart.line_items[i].varietal && _cart.line_items[i].varietal._id === chosenVarietal._id) {
    found = true;
  } else if (!product.varietals && _cart.line_items[i]._product_id == product._id) {   
    found = true;
  }
  return found
}


function mapStateToProps({ zeroInventory, mobile }) {
  return { zeroInventory, mobile }
}

const actions = { dispatchEnlargeImage, showCartAction, getProductAverageRating, showHeaderAction }

export default connect(mapStateToProps, actions)(ProductCard)