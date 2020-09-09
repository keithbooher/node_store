import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAllReviews, getOrder, updateReview } from "../../../utils/API"
import { formatMoney } from "../../../utils/helpFunctions"
import PageChanger from "../../shared/PageChanger"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faTimes, faCheck, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Key from "../../shared/Key"
class Reviews extends Component {
  constructor(props) {
    super()
    this.getOrder = this.getOrder.bind(this)
    this.changePage = this.changePage.bind(this)
    this.approve = this.approve.bind(this)
    this.state = {
      reviews: null,
      review: null,
      order: null,
      page_number: 1,
      line_item_id: null,
      approval: "all"
    }
  }
  
  async componentDidMount() {
    const split_paths = window.location.pathname.split( '/' )
    const path = split_paths[split_paths.length - 1]
    let approval_request
    switch (path) {
      case "approved":
        approval_request = path
        break;
      case "unapproved":
        approval_request = path
        break;
      default:
        approval_request = "all"
        break;
    }
    const reviews = await this.props.getAllReviews("none", "none", approval_request)
    this.setState({ reviews: reviews.data })
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
    const reviews = await this.props.getAllReviews(direction_reference_id, direction, "all")
    this.setState({ reviews: reviews.data, page_number: this.state.page_number + page_increment })
  }

  async approve(approval, review) {
    if (approval === false && review.approved === false || approval === true && review.approved === true) {
      return
    }

    review.approved = approval
    const newly_updated_review = await this.props.updateReview(review)

    let reviews = this.state.reviews.map((state_review) => {
      if (state_review._id === newly_updated_review._id) {
        return state_review = newly_updated_review.data
      }
      return state_review
    })

    this.setState({ reviews })
  }

  renderReviews() {
    return this.state.reviews.map((review, index) => {
      return (
        <div key={index} className={`border border-radius-s padding-s`} style={this.props.mobile ? { margin: "0.4em 0em" } : { margin: "0.4em auto", width: "70%" }}>
          {this.props.mobile ?           
            <div>
              {review.line_item &&
                <>
                  <h2><Link to={`/admin/products/form/update/${review.line_item.product_path.split("/")[review.line_item.product_path.split("/").length - 1]}`}>{review.line_item.product_name}</Link></h2>
                  <div className="flex margin-auto-h justify-center align-items-center background-color-black" style={{ maxHeight: "200px", maxWidth: "200px", minHeight: "200px", minWidth: "200px", marginTop: "10px", marginBottom: "10px" }}>
                    <LazyLoadImage
                      style={{ height: "auto", width: "auto", maxHeight: "200px", maxWidth: "200px" }}
                      src={review.line_item.image}
                    />
                  </div>
                </>
              }
              <div>First Name: {review.first_name}</div>
              <div>Rating: {review.rating}</div>
              <div>description: {review.description}</div>
            </div>
          :
            <div className="flex">
              {review.line_item &&
                <>
                  <div className="flex justify-center align-items-center background-color-black" style={{ maxHeight: "200px", maxWidth: "200px", minHeight: "200px", minWidth: "200px", marginTop: "10px", marginBottom: "10px" }}>
                    <LazyLoadImage
                      style={{ height: "auto", width: "auto", maxHeight: "200px", maxWidth: "200px" }}
                      src={review.line_item.image}
                    />
                  </div>
                </>
              }
              <div className="margin-m-h">
                {review.line_item &&<h2><Link to={`/admin/products/form/update/${review.line_item.product_path.split("/")[review.line_item.product_path.split("/").length - 1]}`}>{review.line_item.product_name}</Link></h2>}
                <div><Key>First Name:</Key> {review.first_name}</div>
                <div><Key>Rating:</Key> {review.rating}</div>
                <div><Key>Description:</Key> {review.description}</div>
              </div>
            </div>
          }
          <div>
            {review._order_id && <div className="bold hover hover-color-12 theme-background-6 padding-s text-align-center" style={{ borderBottom: "solid 1px lightgrey" }} onClick={() => this.getOrder(review._order_id, review.line_item._id)}>Order <FontAwesomeIcon icon={faChevronDown} /></div>}
            {this.state.order !== null ?
              this.state.order._id === review._order_id && this.state.line_item_id === review.line_item._id ? 
              <div className="padding-m">
                <div><Key>Order Number:</Key> <Link to={`/admin/orders/${this.state.order._id}`} >{this.state.order._id}</Link></div>
                <div><Key>Date Placed:</Key> {this.state.order.date_placed.split("T")[0]}</div>
                <div><Key>Total:</Key> {formatMoney(this.state.order.total)}</div>
              </div>  
            : "" : ""}
          </div>
          <div className="bold hover hover-color-12 theme-background-6 padding-s text-align-center" onClick={() => this.approve(!review.approved, review)}>
            { review.approved ? <span>Approved</span> : <span>Unapproved</span> }
          </div>
        </div>
      )
    })
  }

  async getReviews(approval) {
    // get different approval levels
    const reviews = await this.props.getAllReviews("none", "none", approval)
    this.setState({ reviews: reviews.data, page_number: 1 })
  }

  render() {
    let fontSize = "1em"
    if (!this.props.mobile) { 
      fontSize = "20px"
    }
    return (
      <div  style={{ marginTop: "30px", fontSize }}>
        <div className="flex space-evenly">
          <div>
            <Link className="bold" to="/admin/reviews" onClick={() => this.getReviews("all")}>All</Link>
          </div>

          <div>
            <Link className="bold" to="/admin/reviews/approved" onClick={() => this.getReviews("approved")}>Approved</Link>
          </div>

          <div>
            <Link className="bold" to="/admin/reviews/unapproved" onClick={() => this.getReviews("unapproved")}>Unapproved</Link>
          </div>
        </div>

        {this.state.reviews !== null ?
          <div className="flex flex_column">
            {this.renderReviews()}
          </div>
        : <FontAwesomeIcon className="loadingGif loadingGifCenterScreen" icon={faSpinner} spin /> }

        <h2>{this.state.reviews && this.state.reviews.length === 0 && "There are no reviews"}</h2>



        {this.state.reviews && <PageChanger page_number={this.state.page_number} list_items={this.state.reviews} requestMore={this.changePage} />}
      </div>
    )
  }
}

function mapStateToProps({ auth, mobile }) {
  return { auth, mobile }
}

const actions = { getOrder, updateReview, getAllReviews }

export default connect(mapStateToProps, actions)(Reviews)