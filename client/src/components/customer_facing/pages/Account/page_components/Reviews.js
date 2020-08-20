import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUsersReviews, getOrder, lastUserReview, updateReview } from "../../../../../utils/API"
import PageChanger from "../../../../shared/PageChanger"
import StarRatings from 'react-star-ratings'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { validatePresenceOnAll } from "../../../../../utils/validations"
import { updatedFormFields } from "../../../../../utils/helpFunctions"
import FormModal from "../../../../shared/Form/FormModal"

class Reviews extends Component {
  constructor(props) {
    super()
    this.getOrder = this.getOrder.bind(this)
    this.changePage = this.changePage.bind(this)
    this.submitReviewUpdate = this.submitReviewUpdate.bind(this)

    this.fields = [
      { label: "rating", field_class: "line_item_rating_input", name: "rating", typeOfComponent: "star-choice", noValueError: `` },
      { label: "description", field_class: "line_item_rating_text_area", typeOfComponent: "text-area", name: "description", noValueError: `` },
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

  renderReviews() {
    return this.state.reviews.map((review, index) => {
      return (
        <div key={index} className="relative border margin-m-v">
          <FontAwesomeIcon className="absolute" style={{ top: "2px", right: "2px" }} icon={faEdit} onClick={() => this.setState({ editForm: review })} />
          <div>First Name: {review.first_name}</div>
          <div className="flex align-items-center">
            <div>Rating: </div>
            <StarRatings
              rating={review.rating}
              starRatedColor="blue"
              numberOfStars={5}
              name='rating'
              starDimension="15px"
              starSpacing="1px"
            />
          </div>
          <div>description: {review.description}</div>
          {review.line_item && <div>line_item: {review.line_item.product_name}</div>}
          <div className="clickable store_text_color" onClick={() => this.getOrder(review._order_id, review.line_item._id)}>order</div>
          {this.state.order !== null ?
            this.state.order._id === review._order_id && this.state.line_item_id === review.line_item._id? 
            <div className="padding-m">
              <div>Order Number: {this.state.order._id}</div>
              <div>Date Placed: {this.state.order.date_placed}</div>
              <div>Subtotal: {this.state.order.sub_total}</div>
              <div>Total: {this.state.order.total}</div>
            </div>  
          : "" : ""}
        </div>
      )
    })
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
    console.log(this.state)
    return (
      <div>
        {this.state.reviews.length !== 0 ?
          <div className="flex flex_column">
            {this.renderReviews()}
          </div>
        : <FontAwesomeIcon className="loadingGif loadingGifCenterScreen" icon={faSpinner} /> }


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

function mapStateToProps({ auth, form }) {
  return { auth, form }
}

const actions = { getOrder, updateReview, getUsersReviews, lastUserReview }

export default connect(mapStateToProps, actions)(Reviews)