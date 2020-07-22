import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUsersReviews, getOrder, lastUserReview } from "../../../../../utils/API"
import loadingGif from '../../../../../images/pizzaLoading.gif'
import PageChanger from "../../../../shared/PageChanger"

class Reviews extends Component {
  constructor(props) {
    super()
    this.getOrder = this.getOrder.bind(this)
    this.changePage = this.changePage.bind(this)
    this.state = {
      reviews: [],
      order: null,
      page_number: 1,
      line_item_id: null,
      retry: 0,
      last_review: null
    }
  }
  
  async componentDidMount() {
    if (this.props.auth) {
      const reviews = await getUsersReviews(this.props.auth._id, "none", "none")
      const lastReview = await lastUserReview(this.props.auth._id)
      this.setState({ reviews: reviews.data, last_review: lastReview.data })
    }
  }
  
  async componentDidUpdate() {
    if (this.state.reviews.length === 0 && this.state.retry < 3) {
      const lastReview = await lastUserReview(this.props.auth._id)
      const reviews = await getUsersReviews(this.props.auth._id, "none", "none")
      this.setState({ reviews: reviews.data, retry: this.state.retry + 1, last_review: lastReview.data })
    }
  }

  async getOrder(order_id, line_item_id) {
    if (this.state.order !== null) {
      if (this.state.order._id === order_id && this.state.line_item_id === line_item_id) {
        this.setState({ order: null, line_item_id: null })
      } else {
        const order = await getOrder(order_id)
        this.setState({ order: order.data, line_item_id: line_item_id })
      }
    } else {
      const order = await getOrder(order_id)
      this.setState({ order: order.data, line_item_id: line_item_id })
    }
  }

  async changePage(direction_reference_id, direction, page_increment) {
    const reviews = await getUsersReviews(this.props.auth._id, direction_reference_id, direction)
    this.setState({ reviews: reviews.data, page_number: this.state.page_number + page_increment })
  }

  renderReviews() {
    return this.state.reviews.map((review) => {
      return (
        <div className="border margin-m-v">
          <div>First Name: {review.first_name}</div>
          <div>Rating: {review.rating}</div>
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
        : <img className="loadingGif loadingGifCenterScreen" src={loadingGif} /> }


        <PageChanger 
          page_number={this.state.page_number} 
          list_items={this.state.reviews} 
          requestMore={this.changePage}
          lastPossibleItem={lastPossibleItem} 
        />
      </div>
    )
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(mapStateToProps, null)(Reviews)