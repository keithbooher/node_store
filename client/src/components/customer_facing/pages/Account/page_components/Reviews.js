import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUsersReviews, getOrder, lastUserReview, updateReview } from "../../../../../utils/API"
import PageChanger from "../../../../shared/PageChanger"
import StarRatings from 'react-star-ratings'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSpinner, faArrowDown, faArrowCircleDown } from '@fortawesome/free-solid-svg-icons';
import { validatePresenceOnAll } from "../../../../../utils/validations"
import { updatedFormFields } from "../../../../../utils/helpFunctions"
import FormModal from "../../../../shared/Form/FormModal"
import { Link } from "react-router-dom"
import { LazyLoadImage } from 'react-lazy-load-image-component'

class Reviews extends Component {
  constructor(props) {
    super()
    this.getOrder = this.getOrder.bind(this)
    this.changePage = this.changePage.bind(this)
    this.submitReviewUpdate = this.submitReviewUpdate.bind(this)

    this.fields = [
      { label: "Rating", field_class: "line_item_rating_input", name: "rating", typeOfComponent: "star-choice", noValueError: `` },
      { label: "Description", field_class: "line_item_rating_text_area", typeOfComponent: "text-area", name: "description", noValueError: `` },
    ]

    this.state = {
      reviews: [],
      order: null,
      page_number: 1,
      line_item_id: null,
      retry: 0,
      last_review: null,
      editForm: null
    }
  }
  
  async componentDidMount() {
    if (this.props.auth) {
      const reviews = await this.props.getUsersReviews(this.props.auth._id, "none", "none")
      const lastReview = await this.props.lastUserReview(this.props.auth._id)
      this.setState({ reviews: reviews.data, last_review: lastReview.data })
    }
  }
  
  async componentDidUpdate() {
    if (this.state.reviews.length === 0 && this.state.retry < 3) {
      const lastReview = await this.props.lastUserReview(this.props.auth._id)
      const reviews = await this.props.getUsersReviews(this.props.auth._id, "none", "none")
      this.setState({ reviews: reviews.data, retry: this.state.retry + 1, last_review: lastReview.data })
    }
  }

  async getOrder(order_id, line_item_id) {
    if (this.state.order !== null) {
      if (this.state.order._id === order_id && this.state.line_item_id === line_item_id) {
        this.setState({ order: null, line_item_id: null })
      } else {
        const order = await this.props.getOrder(order_id)
        this.setState({ order: order.data, line_item_id: line_item_id })
      }
    } else {
      const order = await this.props.getOrder(order_id)
      this.setState({ order: order.data, line_item_id: line_item_id })
    }
  }

  async changePage(direction_reference_id, direction, page_increment) {
    const reviews = await this.props.getUsersReviews(this.props.auth._id, direction_reference_id, direction)
    this.setState({ reviews: reviews.data, page_number: this.state.page_number + page_increment })
  }

  async submitReviewUpdate() {
    const form_values = this.props.form[`review_edit_form`].values
    let review = this.state.editForm
    review.description = form_values.description
    review.rating = form_values.rating
    await this.props.updateReview(review)
    const reviews = await this.props.getUsersReviews(this.props.auth._id, "none", "none")
    this.setState({ editForm: null, reviews: reviews.data, })
  }

  review_initial_values() {
    return updatedFormFields(this.fields, this.state.editForm)
  }

  render() {
    let lastPossibleItem = false
    if (this.state.reviews.length > 0 && this.state.last_review) {
      if (this.state.reviews[this.state.reviews.length - 1]._id === this.state.last_review._id) {
        lastPossibleItem = true
      }
    }
    return (
      <div>
        {this.state.reviews.length !== 0 ?
          <div className="flex flex_column">
            {this.state.reviews.map((review, index) => 
              <DynamicReview 
                review={review} 
                index={index} 
                setEditForm={(review) => this.setState({ editForm: review })}
                line_item_id={this.state.line_item_id }
                order={this.state.order }
                getOrder={this.getOrder}
                mobile={this.props.mobile}
              /> 
            )}
          </div>
        : <FontAwesomeIcon className="loadingGif loadingGifCenterScreen" icon={faSpinner} spin /> }


        <PageChanger 
          page_number={this.state.page_number} 
          list_items={this.state.reviews} 
          requestMore={this.changePage}
          lastPossibleItem={lastPossibleItem} 
        />

        {this.state.editForm && 
          <FormModal 
            onSubmit={this.submitReviewUpdate}
            submitButtonText={"Submit"}
            cancel={() => this.setState({ editForm: null })}
            formFields={this.fields} 
            form={`review_edit_form`}
            initialValues={this.state.reviewed === "" ? {} : this.review_initial_values()}
            validation={validatePresenceOnAll}
          />
        }
      </div>
    )
  }
}

function mapStateToProps({ auth, form, mobile }) {
  return { auth, form, mobile }
}

const actions = { getOrder, updateReview, getUsersReviews, lastUserReview }

export default connect(mapStateToProps, actions)(Reviews)

const DynamicReview = ({ mobile, index, review, setEditForm, getOrder, order, line_item_id }) => {
  if (mobile) {
    return (
      <div key={index} className="relative theme-background-3 color-white margin-m-v padding-s border-radius-s" >
        {review.line_item &&
          <>
            <h2><Link className="hover-color-5" to={review.line_item.product_path}>{review.line_item.product_name}</Link></h2>
            <div className="flex margin-auto-h justify-center align-items-center background-color-black" style={{ maxHeight: "300px", maxWidth: "100%", height: "auto", width: "auto", marginTop: "10px", marginBottom: "10px" }}>
              <LazyLoadImage
                style={{ height: "auto", width: "auto", maxHeight: "300px", maxWidth: "300px" }}
                src={review.line_item.image}
              />
            </div>
          </>
        }
        <FontAwesomeIcon className="absolute" style={{ top: "2px", right: "2px" }} icon={faEdit} onClick={() => setEditForm(review)} />
        <div className="flex align-items-center">
          <StarRatings
            rating={review.rating}
            starRatedColor="#6CB2EB"
            numberOfStars={5}
            name='rating'
            starDimension="15px"
            starSpacing="1px"
          />
        </div>
        <div>{review.description}</div>
        <a className="margin-s-v hover-color-5" onClick={() => getOrder(review._order_id, review.line_item._id)}>Order Details <FontAwesomeIcon icon={faArrowCircleDown} /></a>
        {order !== null ?
          order._id === review._order_id && line_item_id === review.line_item._id? 
          <div className="padding-m">
            <div>Order Number: <Link className="inline hover-color-5" to={`/order/${order._id}`}>{order._id}</Link></div>
            <div>Date Placed: {order.date_placed.split("T")[0]}</div>
          </div>  
        : "" : ""}
      </div>
    )
  } else {
    return (
      <div key={index} className="relative theme-background-3 color-white padding-s border-radius-s" style={{ width: "75%", margin: "20px auto" }}>
        <div className="flex">
          {review.line_item &&
            <div className="flex justify-center align-items-center background-color-black" style={{ maxHeight: "300px", maxWidth: "300px", minHeight: "300px", minWidth: "300px", marginTop: "10px", marginBottom: "10px" }}>
              <LazyLoadImage
                style={{ height: "auto", width: "auto", maxHeight: "300px", maxWidth: "300px" }}
                src={review.line_item.image}
              />
            </div>
          }
          <div className="margin-m-h">
            
            {review.line_item && <h2 style={{ fontSize: "35px" }}><Link className="hover-color-5" to={review.line_item.product_path}>{review.line_item.product_name}</Link></h2>}
            <h2 style={{ fontSize: "25px" }}>Your Rating <FontAwesomeIcon className="hover hover-color-2" icon={faEdit} onClick={() => setEditForm(review)} /></h2>
            <div className="flex align-items-center">
              <StarRatings
                rating={review.rating}
                starRatedColor="#6CB2EB"
                numberOfStars={5}
                name='rating'
                starDimension="25px"
                starSpacing="1px"
              />
              {/* {review.completed_at && } */}
              <div style={{ fontSize: "25px" }}>{review.created_at}</div>
            </div>
            <div style={{ fontSize: "25px" }}>{review.description}</div>
          </div>
        </div>
        <a className="margin-s-v hover-color-5" style={{ fontSize: "20px" }} onClick={() => getOrder(review._order_id, review.line_item._id)}>Order Details <FontAwesomeIcon icon={faArrowCircleDown} /></a>
        {order !== null ?
          order._id === review._order_id && line_item_id === review.line_item._id? 
          <div className="padding-m" style={{ fontSize: "20px" }}>
            <div>Order Number: <Link className="inline hover-color-5" to={`/order/${order._id}`}>{order._id}</Link></div>
            <div>Date Placed: {order.date_placed.split("T")[0]}</div>
          </div>  
        : "" : ""}
      </div>
    )
  }
}