import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { getProductByPathName, getProductsReviews, submitReview, lastReview, getProductAverageRating } from "../../../../utils/API"
import { updateCart, createCart, dispatchObj } from "../../../../actions"
import { Link } from 'react-router-dom'
import { capitalizeFirsts, productPathNameToName, calculateSubtotal, formatMoney } from '../../../../utils/helpFunctions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faChevronDown, faChevronUp, faSpinner } from '@fortawesome/free-solid-svg-icons'
import Form from "../../../shared/Form"
import { validatePresenceOnAll } from "../../../../utils/validations"
import { reset } from "redux-form"
import PageChanger from "../../../shared/PageChanger"
import Modal from "../../../shared/Modal"
import ProductCard from "../../components/ProductCard"
import { withRouter } from "react-router"
import Carousel from "../../../shared/Carousel"
import StarRatings from 'react-star-ratings'
import MetaTags from 'react-meta-tags'
import "./product.scss"

const Product = ({ 
  auth, 
  cart, 
  createCart, 
  updateCart, 
  form, 
  dispatchObj, 
  match,
  getProductAverageRating, 
  getProductByPathName, 
  lastReview, 
  getProductsReviews,
  submitReview,
  mobile
}) =>  {

  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState([])
  const [thanksModal, setThanksModal] = useState(false)
  const [page_number, setPageNumber] = useState(1)
  const [last_review, setLastReview] = useState(null)
  const [showMoreReviews, setShowMoreReviews] = useState(false)
  const [insufficientStock, setInsufficient] = useState(false)

  
  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchData()
    document.getElementById('root').scrollTo(0, 0);
  }, [match.params.product])

  const fetchData = async () => {
    const { data } = await getProductByPathName(match.params.product)
    const get_reviews = await getProductsReviews(data._id, "none", "none").then(req => req.data)
    const get_last_review = await lastReview(data._id).then(res => res.data)
    const average_rating = await getProductAverageRating(data._id).then(res => res.data)
    
    setProduct(data)
    setAverageRating(average_rating.average)
    setReviews(get_reviews)
    setLastReview(get_last_review)
    setSelectedImage(data.images.i1)
  }

  const addToCart = () => {
    let _product = product
    let _cart = cart
    const _quantity = quantity
    const user_id = auth._id
    let insufficient = false

    let sub_total, create_boolean
    
    if (_quantity > product.inventory_count && !product.backorderable) {
      setInsufficient(true)
      insufficient = true
      return
    }

    if (_cart == null) {
      create_boolean = true
      sub_total = _product.price * .08
      _cart = {
        line_items: [
          {
            product_name: _product.name,
            image: _product.images.i1,
            _product_id: _product._id,
            quantity: _quantity,
            product_price: _product.price,
            product_path: `/shop/${_product.categories.length > 0 ? _product.categories[0].path_name : "general" }/${_product.path_name}`,
            gift_note: form['gift_note_form'] ? form['gift_note_form'].values ? form['gift_note_form'].values.gift_note : null : null
          }
        ],
        _user_id: user_id,
        email: auth.email,
        sub_total: sub_total,
        total: sub_total + _product.price
      }
    } else {
      create_boolean = false
      sub_total = 0
      // CHECK TO SEE IF PRODUCT IS CONTAINED WITHIN CART ALREADY
      let found = false
      for(var i = 0; i < _cart.line_items.length; i++) {
        if (_cart.line_items[i]._product_id == _product._id) {
            found = true;
            break;
        }
      }

      // IF FOUND, UPDATE THE LINE ITEM QUANTITY and check against inventory. 
      // OTHERWISE CREATE A NEW LINE_ITEM AND PUSH TO THE CART
      if(found === true && !product.gift_note) {
        _cart.line_items = _cart.line_items.map((line_item) => {
          if(product._id === line_item._product_id) {
            let total = line_item.quantity + _quantity
            if (total > product.inventory_count && !product.backorderable) {
              setInsufficient(true)
              insufficient = true
            } else {
              line_item.quantity += _quantity
            }
          }
          return line_item
        })
      } else {
        let line_item = {
          product_name: _product.name,
          image: _product.images.i1,
          _product_id: _product._id,
          quantity: _quantity,
          product_price: _product.price,
          product_path: `/shop/${_product.categories.length > 0 ? _product.categories[0].path_name : "general" }/${_product.path_name}`,
          gift_note: form['gift_note_form'] ? form['gift_note_form'].values ? form['gift_note_form'].values.gift_note : null : null
        }
        _cart.line_items.push(line_item)
      }

      sub_total = Number(calculateSubtotal(_cart))
      let tax = Number(sub_total * .08)
      let shipping = Number(_cart.chosen_rate ? _cart.chosen_rate.cost : 0)
  
      cart.discount_codes = []
      cart.discount = null
      
      _cart.sub_total = sub_total
      _cart.tax = tax
      _cart.total = Number(sub_total + tax + shipping)

    }
    _cart.checkout_state = "shopping"

    if (insufficient) return

    if (create_boolean === true) {
      createCart(_cart)
    } else {
      updateCart(_cart)
    }
  }

  const _setQuantity = (direction) => {
    let _quantity
    if(direction === "up") {
      _quantity = quantity + 1
    } else {
      _quantity = quantity - 1
    }
    
    if (_quantity > product.inventory_count || _quantity < 1) {
      return
    }
    setQuantity(_quantity)
  }

  const checkInventoryCountInput = (e) => {
    let value = e.target.value
    if (value > product.inventory_count) {
      value = product.inventory_count
      setQuantity(value)
    }
    if (value === "") {
      value = 1
      setQuantity(value)
    }
  }

  const onChangeInput = (e) => {
    setQuantity(e.target.value )
  }

  const preventAlpha = (e) => {
    if (!isNumber(e)) {
      e.preventDefault();
    }
  }

  const isNumber = (e) => {
    var charCode = e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
  }

  const submitReviewForm = async () => {
    let form_values = form["product_review_form"].values
    let review = {
      rating: parseInt(form_values.rating),
      description: form_values.description,
      first_name: auth.first_name,
      _user_id: auth._id,
      _product_id: product._id
    }

    let date = new Date()
    const today = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()

    review.created_at = today

    await submitReview(review)
    const { data } = await getProductsReviews(product._id, "none", "none")
    dispatchObj(reset("product_review_form"))
    setReviews(data)
    setThanksModal(true)
    // then get all reviews and update state
  }

  const changePage = async (direction_reference_id, direction, page_increment) => {
    const _reviews = await getProductsReviews(product._id, direction, direction_reference_id).then(res => res.data)
    setReviews(_reviews)
    setPageNumber(page_number + page_increment )
  }

  const showReviews = () => {
    setShowMoreReviews(!showMoreReviews)
  }

  const relatedProductsCards = () => {
    return product.related_products.map((related_product, index) => {
      return (
          <div key={index}>
            <ProductCard 
              createCart={createCart}
              updateCart={updateCart}
              user={auth} 
              product={related_product} 
              cart={cart} 
              category_path_name={product.categories.length > 0 ? product.categories[0].path_name : ""} 
              related_product={true}
            />
          </div>
        )
      })
  }

  let lastPossibleItem = false
  if (reviews.length > 0 && last_review) {
    if (reviews[reviews.length - 1]._id === last_review._id) {
      lastPossibleItem = true
    }
  }

  let review_container_style
  if (reviews.length < 4 && reviews.length > 0 || reviews.length > 3) {
    review_container_style = { height: "450px" }
  } else if (reviews.length === 0) {
    review_container_style = { height: "auto" }
  }

  let containerStyle = {
    fontSize: "1em", 
    padding: ".4em .4em 80px .4em"
  }
  if (!mobile) {
    containerStyle.fontSize = "20px"
  }

  const [selectedImage, setSelectedImage] = useState(null)
  return (
    <div style={ containerStyle } className={`${!mobile && "max-customer-container-width margin-auto-h"}`}>
      <MetaTags>
        {product &&
          <>
            <title>{product.meta_title}</title>
            <meta name="description" content={product.meta_description} />
            <meta name="keywords" content={product.meta_keywords} />
          </>
        }
      </MetaTags>

      <div><Link to={`/shop/${match.params.category}`}><FontAwesomeIcon icon={faArrowLeft} /> Back To {capitalizeFirsts(productPathNameToName(match.params.category))}</Link></div>
      {product ? 
        <div>
          {mobile ?
            <div>
              <h1 style={{ marginTop: "10px", marginBottom: "0px" }}>{product.name}</h1>
              <div style={{ marginBottom: "20px" }}>
                {reviews.length > 0 && averageRating &&
                  <StarRatings
                    rating={new Number(averageRating)}
                    starRatedColor="#6CB2EB"
                    numberOfStars={5}
                    name='rating'
                    starDimension="15px"
                    starSpacing="1px"
                  />
                }
              </div>
              <div className="text-align-center">
                <img style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "25em" }} src={selectedImage} />
              </div>
              <div className="flex" style={{ margin: "10px 10px 0px 10px" }}>
                {Object.keys(product.images).map((image_key, index) => {
                  return (
                    <div key={index} onClick={product.images[image_key] === null ? () => console.log("do nothing") : () => setSelectedImage(product.images[image_key])} className={`text-align-center flex justify-center align-items-center background-color-black ${selectedImage === image_key && "opacity-3-4"}`} style={{ margin: "10px 10px 0px 10px", flexBasis: "20%" }}>
                      <img style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "100px" }} src={product.images[image_key]} />
                    </div>
                  )
                })}
              </div>
              {product.availability ?
                <>
                  <div className="flex flex_column">
                    <h2 className="margin-v-none">${formatMoney(product.price)}</h2>
                    {!product.backorderable && product.inventory_count > 0 && <div className="margin-s-v">In Stock: {product.inventory_count}</div>}
                    {product.inventory_count < 1 && <div className="margin-s-v">Out of stock</div>}
                  </div>
                  <div className="flex">
                    <div className="flex">
                      <input onKeyDown={(e) => preventAlpha(e)} onChange={(e) => onChangeInput(e)} onBlur={e => checkInventoryCountInput(e)} style={{ marginRight: "5px", width: "60px" }} className="inline quantity_input" value={quantity} defaultValue={1}/>
                      <div className="flex flex_column">
                        <FontAwesomeIcon onClick={() => _setQuantity("up")} icon={faChevronUp} />
                        <FontAwesomeIcon onClick={() => _setQuantity("down")} icon={faChevronDown} />
                      </div>
                    </div>
                    <button className="margin-s-h inline" onClick={addToCart.bind(this)}>Add To Cart</button>
                  </div>
                </>
              : <h2>Product Unavailable</h2>}
              <hr/>
              <h3>Description</h3>
              <p>{product.description ? product.description : "No Product Description"}</p>
              {product.dimensions && 
                <div>
                  <h3 className="margin-bottom-none">Specs</h3>
                  <div className="padding-s">
                    <div>Height: {product.dimensions.height}</div>
                    <div>Width: {product.dimensions.width}</div>
                    <div>Depth: {product.dimensions.depth}</div>
                    <div>Weight: {product.weight}</div>
                  </div>
                </div>
              }
              {product.gift_note &&
                <Form 
                  submitButton= {<div />}
                  formFields={[
                    { label: 'Gift Note', name: 'gift_note', typeOfComponent: "text-area", noValueError: 'You must provide an address', value: null },
                  ]} 
                  form={"gift_note_form"}
                />
              }
            </div>
          :
            <div className="margin-m-v">
              <div className="flex align-items-center">
                <div className="w-40">
                  <div>
                    <img className="border-radius-s" style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "30em" }} src={selectedImage} />
                  </div>
                  <div className="flex">
                    {Object.keys(product.images).map((image_key, index) => {
                      return (
                        <div key={index} onClick={product.images[image_key] === null ? () => console.log("do nothing") : () => setSelectedImage(product.images[image_key])} className={`text-align-center flex justify-center align-items-center background-color-black ${selectedImage === image_key && "opacity-3-4"}`} style={{ margin: "10px 10px 0px 10px", flexBasis: "25%" }}>
                          <img style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "100px" }} src={product.images[image_key]} />
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="margin-s-h theme-background-6 border-radius padding-m h-100 w-60">
                  <div>
                    <h2 className="margin-v-none">${formatMoney(product.price)}</h2>
                    <div className="flex align-items-center" style={{ margin: "10px 0px 10px 0px" }}>
                      <h1 style={{ margin: "0px" }}>{product.name}</h1>
                      <div className="margin-s-h">
                        {reviews.length > 0 && averageRating &&
                          <StarRatings
                            rating={new Number(averageRating)}
                            starRatedColor="#6CB2EB"
                            numberOfStars={5}
                            name='rating'
                            starDimension="25px"
                            starSpacing="1px"
                          />
                        }
                      </div>
                    </div>
                    <h3 className="margin-xs-v">Description</h3>
                    <div>{product.description ? product.description : "No Product Description"}</div>
                  </div>
                  {product.availability ?
                    <>
                      <div className="margin-s-v">
                        {!product.backorderable && product.inventory_count > 0 && <div className="margin-s-v">In Stock: {product.inventory_count}</div>}
                        {product.inventory_count < 1 && <div className="margin-s-v">Out of stock</div>}
                        <div className="flex">
                          <div className="flex">
                            <input onKeyDown={(e) => preventAlpha(e)} onChange={(e) => onChangeInput(e)} onBlur={e => checkInventoryCountInput(e)} style={{ marginRight: "5px", width: "60px" }} className="inline quantity_input" value={quantity} defaultValue={1}/>
                            <div className="flex flex_column">
                              <FontAwesomeIcon className="hover hover-color-8" onClick={() => _setQuantity("up")} icon={faChevronUp} />
                              <FontAwesomeIcon className="hover hover-color-8" onClick={() => _setQuantity("down")} icon={faChevronDown} />
                            </div>
                          </div>
                          <button className="margin-s-h inline" onClick={addToCart.bind(this)}>Add To Cart</button>
                        </div>
                      </div>
                    </>
                  : 
                    <h2>Product Unavailable</h2>
                  }

                  <div className="flex align-items-center">
                    {product.dimensions && 
                      <div style={{ flexBasis: "25%" }}>
                        <h3 className="margin-bottom-none">Details</h3>
                        <div className="padding-s">
                          <div>Height: {product.dimensions.height}</div>
                          <div>Width: {product.dimensions.width}</div>
                          <div>Depth: {product.dimensions.depth}</div>
                          <div>Weight: {product.weight}</div>
                        </div>
                      </div>
                    }
                    {product.gift_note &&
                      <div style={{ flexBasis: "75%" }}>
                        <Form 
                          submitButton= {<div />}
                          formFields={[
                            { label: 'Gift Note', name: 'gift_note', typeOfComponent: "text-area", noValueError: 'You must provide an address', value: null },
                          ]} 
                          form={"gift_note_form"}
                        />
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          }
          
          <br />
          <hr />
          <br />

          <div >
            <div>
              <h2>Reviews</h2>
              {reviews.length !== 0 ? 
                <div id="reviews_container" style={mobile ? { maxHeight: "450px" } : { maxHeight: "600px" } } className={`relative border-radius-s overflow-scroll ${showMoreReviews ? `show_reviews` : `hide_reviews`}`}>
                  {reviews.map((review, index) => {
                    return (
                      <div style={mobile ? {} : { fontSize: "20px" }} className="theme-background-6 padding-s margin-xs-v border-radius-s" key={index}>
                        <div className="flex align-items-center">
                          {<StarRatings
                            rating={review.rating}
                            starRatedColor="#6CB2EB"
                            numberOfStars={5}
                            name='rating'
                            starDimension="25px"
                            starSpacing="1px"
                          />}
                        </div>
                        <div style={mobile ? { fontSize: "12px" } : { fontSize: "18px" }}>{review.first_name}</div>
                        <p>{review.description}</p>
                      </div>
                    )
                  })}
                  {reviews.length > 3 &&
                    <>
                      <div onClick={showReviews} id="more_reviews" className={`flex flex_column  ${showMoreReviews ? `hide_reviews_message` : `show_reviews_message`}`}>
                        <h3 className="magrin-bottom-none">More Reviews</h3>
                        <FontAwesomeIcon style={{ fontSize: "25px" }} icon={faChevronDown} />
                      </div>
                      <div style={review_container_style} className={showMoreReviews ? `hide_cover_reviews` : `show_cover_reviews`}></div>
                    </>
                  }
                </div>
              :
                <h4 style={{ marginBottom: "20px" }} className="padding-s border-radius-s w-90 margin-auto-h theme-background-6">There are no reviews for this product yet</h4>  
              }
              <PageChanger 
                page_number={page_number} 
                list_items={reviews} 
                requestMore={changePage} 
                lastPossibleItem={lastPossibleItem} 
              />
              {auth && auth._id !== "000000000000000000000000" ? 
                <>
                  <h3>Leave a Review</h3>
                  <Form 
                    onSubmit={submitReviewForm}
                    formFields={[
                      { label: 'Rating', name: 'rating', typeOfComponent: "star-choice", noValueError: 'You must provide an value', value: null },
                      { label: 'Tell us how you liked it!', name: 'description', typeOfComponent: "text-area", noValueError: 'You must provide an value', value: null },
                    ]}
                    submitButtonText={"Submit Review"}                  
                    form={"product_review_form"}
                    validation={validatePresenceOnAll}
                  />
                </>
              : "Sign in to leave a review"}
              {thanksModal && 
                <Modal cancel={() => setThanksModal(false)} >
                  <h2>Thanks for submitting your review!</h2>
                  <h3>We value your feedback</h3>
                  <button onClick={() => setThanksModal(false)}>Okay</button>
                </Modal>
              }
            </div>

            <hr className="margin-l-v"/>

            {product.related_products && product.related_products.length > 0 &&
              <div className="relative">
                <h2>Related Products</h2>
                <Carousel children={relatedProductsCards()} />
              </div>
            }

            {insufficientStock && 
              <Modal cancel={() => setInsufficient(false)} >
                <h2>Insufficient Stock</h2>
                <button onClick={() => setInsufficient(false)}>Okay</button>
              </Modal>
            }
          </div>
        </div>
      : <FontAwesomeIcon className="loadingGif loadingGifCenterScreen" icon={faSpinner} spin />}
    </div>
  )
}


function mapStateToProps({ cart, auth, form, mobile }) {
  return { cart, auth, form, mobile }
}

const actions = { updateCart, createCart, dispatchObj, getProductByPathName, getProductAverageRating, submitReview, getProductsReviews, lastReview }


export default connect(mapStateToProps, actions)(withRouter(Product))