import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getProductInfo, getProductsReviews, submitReview, lastReview } from "../../../../utils/API"
import { updateCart, createCart, dispatchObj } from "../../../../actions"
import { Link } from 'react-router-dom'
import { capitalizeFirsts, productPathNameToName, calculateSubtotal } from '../../../../utils/helperFunctions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import Form from "../../../shared/Form"
import { validatePresenceOnAll } from "../../../../utils/validations"
import { reset } from "redux-form"
import PageChanger from "../../../shared/PageChanger"
import Modal from "../../../shared/Modal"
import "./product.scss"
class Product extends Component  {
  constructor(props) {
    super()
    this.routeParamCategory = props.match.params.category
    this.routeParamProduct = props.match.params.product
    this.setQuantity = this.setQuantity.bind(this)
    this.checkInventoryCount = this.checkInventoryCount.bind(this)
    this.submitReviewForm = this.submitReviewForm.bind(this)
    this.changePage = this.changePage.bind(this)
    this.showReviews = this.showReviews.bind(this)

    this.state = {
        product: null,
        quantity: 1,
        reviews: [],
        thanksModal: false,
        page_number: 1,
        last_review: null,
        showMoreReviews: false
    }
  }
  async componentDidMount() {
    // OR WOULD IT BE FASTER TO FILTER THROUGH THE 'IN STOCK PRODUCTS' THAT RESIDE IN THE STORE STATE?
    const { data } = await getProductInfo(this.routeParamProduct)
    const reviews = await getProductsReviews(data._id, "none", "none").then(req => req.data)
    const last_review = await lastReview(data._id).then(res => res.data)

    this.setState({ product: data, reviews, last_review })
  }

  addToCart() {
    let product = this.state.product
    let cart = this.props.cart
    const quantity = this.state.quantity
    const user_id = this.props.auth._id

    let sub_total, create_boolean

    if (this.props.cart == null) {
      create_boolean = true
      sub_total = product.price * .08
      cart = {
        line_items: [
          {
            product_name: product.name,
            image: product.image,
            _product_id: product._id,
            quantity: quantity,
            product_price: product.price
          }
        ],
        _user_id: user_id,
        email: this.props.auth.email,
        sub_total: sub_total,
        total: sub_total + product.price
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

      // IF FOUND, SIMPLY UPDATE THE LINE ITEM QUANTITY. OTHERWISE CREATE A NEW LINE_ITEM AND PUSH TO THE CART
      if(found === true) {
        cart.line_items.forEach((line_item) => {
          if(product._id === line_item._product_id) {
            line_item.quantity += quantity
          }
        })
      } else {
        let line_item = {
          product_name: product.name,
          image: product.image,
          _product_id: product._id,
          quantity: quantity,
          product_price: product.price
        }
        cart.line_items.push(line_item)
      }


      sub_total = calculateSubtotal(cart)
      cart.total = sub_total * .08
    }
    cart.checkout_state = "shopping"
    if (create_boolean === true) {
      this.props.createCart(cart)
    } else {
      this.props.updateCart(cart)
    }
    //////
  }

  setQuantity(direction) {
    let quantity
    if(direction === "up") {
      quantity = this.state.quantity + 1
    } else {
      quantity = this.state.quantity - 1
    }
    
    if (quantity > this.state.product.inventory_count || quantity < 1) {
      return
    }
    this.setState({ quantity })
  }

  checkInventoryCount(e) {
    let value = e.target.value
    if (value > this.state.product.inventory_count) {
      value = this.state.product.inventory_count
      this.setState({ quantity: value })
    }
    if (value === "") {
      value = 1
      this.setState({ quantity: value })
    }
  }

  onChangeInput(e) {
    this.setState({ quantity: e.target.value })
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

  async submitReviewForm() {
    let form_values = this.props.form["product_review_form"].values
    const review = {
      rating: parseInt(form_values.rating),
      description: form_values.description,
      first_name: this.props.auth.first_name,
      _user_id: this.props.auth._id,
      _product_id: this.state.product._id
    }
    await submitReview(review)
    const { data } = await getProductsReviews(this.state.product._id, "none", "none")
    this.props.dispatchObj(reset("product_review_form"))
    this.setState({ reviews: data, thanksModal: true })
    // then get all reviews and update state
  }

  async changePage(direction_reference_id, direction, page_increment) {
    const reviews = await getProductsReviews(this.state.product._id, direction, direction_reference_id).then(res => res.data)
    this.setState({ reviews, page_number: this.state.page_number + page_increment })
  }

  showReviews() {
    this.setState({ showMoreReviews: !this.state.showMoreReviews })
  }

  render() {
    let product = this.state.product
    let lastPossibleItem = false
    if (this.state.reviews.length > 0 && this.state.last_review) {
      if (this.state.reviews[this.state.reviews.length - 1]._id === this.state.last_review._id) {
        lastPossibleItem = true
      }
    }
    return (
      <div>
        <div><Link to={`/shop/${this.routeParamCategory}`}><FontAwesomeIcon icon={faArrowLeft} /> Back To {capitalizeFirsts(productPathNameToName(this.routeParamCategory))}</Link></div>
        {product !== null && 
          <div>
            <h1 style={{ marginTop: "10px" }}>{product.name}</h1>
            <div className="text-align-center">
              <img style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "25em" }} src={product.image} />
            </div>
            <div className="padding-s">
              <div className="flex flex_column">
                <h1 className="margin-v-none">${product.price}</h1>
                {!product.backorderable && <div className="margin-s">In Stock: {product.inventory_count}</div>}
              </div>
              <div className="flex">
                <div className="flex">
                  <input onKeyDown={(e) => this.preventAlpha(e)} onChange={(e) => this.onChangeInput(e)} onBlur={e => this.checkInventoryCount(e)} style={{ marginRight: "5px", width: "60px" }} className="inline quantity_input" value={this.state.quantity} defaultValue={1}/>
                  <div className="flex flex_column">
                    <FontAwesomeIcon onClick={() => this.setQuantity("up")} icon={faChevronUp} />
                    <FontAwesomeIcon onClick={() => this.setQuantity("down")} icon={faChevronDown} />
                  </div>
                </div>
                <button className="margin-s inline" onClick={this.addToCart.bind(this)}>Add To Cart</button>
              </div>
              <p>{product.description}</p>
              <div>
                <h3 className="margin-bottom-none">Specs</h3>
                <div className="padding-s">
                  <div>Height: {product.dimensions.height}</div>
                  <div>Width: {product.dimensions.width}</div>
                  <div>Depth: {product.dimensions.depth}</div>
                  <div>Weight: {product.weight}</div>
                </div>
              </div>
              <div>
                <h2>Reviews</h2>
                <div id="reviews_Container" className={`relative ${this.state.showMoreReviews ? `show_reviews` : `hide_reviews`}`}>
                  {this.state.reviews.map((review, index) => {
                    return (
                      <div className="background-color-grey-6 padding-s margin-xs-v" style={{ borderRadius: "2px", borderColor: "black", borderWidth: "1px" }} key={index}>
                        <h4>Rating: {review.rating}<div style={{ fontSize: "12px" }}>{review.first_name}</div></h4>
                        <p>{review.description}</p>
                      </div>
                    )
                  })}
                  <div onClick={this.showReviews} id="more_reviews" className={`flex flex_column  ${this.state.showMoreReviews ? `hide_reviews_message` : `show_reviews_message`}`}>
                    <h3 className="magrin-bottom-none">More Reviews</h3>
                    <FontAwesomeIcon style={{ fontSize: "25px" }} icon={faChevronDown} />
                  </div>
                  <div className={this.state.showMoreReviews ? `hide_cover_reviews` : `show_cover_reviews`}></div>
                </div>
                <PageChanger 
                  page_number={this.state.page_number} 
                  list_items={this.state.reviews} 
                  requestMore={this.changePage} 
                  lastPossibleItem={lastPossibleItem} 
                />
                {this.props.auth && this.props.auth._id !== "000000000000000000000000" ? 
                  <>
                    <h3>Leave a Review</h3>
                    <Form 
                      onSubmit={this.submitReviewForm}
                      formFields={[
                        { label: 'Rating', name: 'rating', noValueError: 'You must provide an value', value: null },
                        { label: 'Description', name: 'description', typeOfComponent: "text-area", noValueError: 'You must provide an value', value: null },
                      ]}
                      submitButtonText={"Submit Review"}                  
                      form={"product_review_form"}
                      validation={validatePresenceOnAll}
                    />
                  </>
                : "Sign in to leave a review"}
                {this.state.thanksModal && 
                  <Modal cancel={() => this.setState({ thanksModal: false })} >
                    <h2>Thanks for submitting your review!</h2>
                    <h3>We value your feedback</h3>
                    <button onClick={() => this.setState({ thanksModal: false })}>Okay</button>
                  </Modal>
                }
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}


function mapStateToProps({ cart, auth, form }) {
  return { cart, auth, form }
}

const actions = {updateCart, createCart, dispatchObj}


export default connect(mapStateToProps, actions)(Product)