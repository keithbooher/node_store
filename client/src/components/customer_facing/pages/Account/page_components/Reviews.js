import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUsersReviews, getOrder } from "../../../../../utils/API"
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
      line_item_id: null
    }
  }
  
  async componentDidMount() {
    const reviews = await getUsersReviews(this.props.auth._id, "none", "none")
    this.setState({ reviews: reviews.data })
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
          <div>line_item: {review.line_item.product_name}</div>
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
    return (
      <div>
        {this.state.reviews.length !== 0 ?
          <div className="flex flex_column">
            {this.renderReviews()}
          </div>
        : <img className="loadingGif loadingGifCenterScreen" src={loadingGif} /> }


        <PageChanger page_number={this.state.page_number} list_items={this.state.reviews} requestMore={this.changePage} />
      </div>
    )
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(mapStateToProps, null)(Reviews)