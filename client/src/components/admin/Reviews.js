import React, { Component } from 'react'
import { connect } from 'react-redux'
import API from "../../utils/API"
import loadingGif from '../../images/pizzaLoading.gif'

class Reviews extends Component {
  constructor(props) {
    super()
    this.getOrder = this.getOrder.bind(this)
    this.state = {
      reviews: null,
      review: null,
      order: null,
      page_number: 1,
      line_item_id: null
    }
  }
  
  async componentDidMount() {
    const reviews = await API.getAllReviews("none", "none", "all")
    this.setState({ reviews: reviews.data })
  }

  async getOrder(order_id, line_item_id) {
    if (this.state.order !== null) {
      if (this.state.order._id === order_id && this.state.line_item_id === line_item_id) {
        this.setState({ order: null, line_item_id: null })
      } else {
        const order = await API.getOrder(order_id)
        this.setState({ order: order.data, line_item_id: line_item_id })
      }
    } else {
      const order = await API.getOrder(order_id)
      this.setState({ order: order.data, line_item_id: line_item_id })
    }
  }


  async changePage(direction) {
    let direction_reference_review_id
    let page_increment
    if (direction === "next") {
      page_increment = 1
      direction_reference_review_id = this.state.reviews[this.state.reviews.length - 1]
    } else {
      page_increment = -1
      direction_reference_review_id = this.state.reviews[0]
    }
    
    const reviews = await API.getAllReviews(direction_reference_review_id._id, direction, "all")
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
              <div>Review Number: {this.state.order._id}</div>
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
    console.log(this.state)
    return (
      <div>
        {this.state.reviews !== null ?
          <div className="flex flex_column">
            {this.renderReviews()}
          </div>
        : <img className="loadingGif loadingGifCenterScreen" src={loadingGif} /> }


        <div className="flex">
          <button onClick={() => this.changePage('previous')} className="bare_button">Previous</button>
          <div className="font-size-1-3">{this.state.page_number}</div>
          <button onClick={() => this.changePage('next')} className="bare_button">Next</button>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(mapStateToProps, null)(Reviews)