import React, { Component } from 'react'
import { connect } from 'react-redux'
import Form from "./Form"
import { updatedFormFields } from "../../utils/helperFunctions"
import { checkIfReviewExists, submitReview, updateReview } from '../../utils/API';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons"
import { validatePresenceOnAll } from "../../utils/validations"
class LineItem extends Component {
  constructor(props) {
    super()
    this.fields = [
      { label: "rating", field_class: "line_item_rating_input", name: "rating", noValueError: `` },
      { label: "description", field_class: "line_item_rating_text_area", typeOfComponent: "text-area", name: "description", noValueError: `` },
    ]
    this.leaveReview = this.leaveReview.bind(this)
    this.submitReview = this.submitReview.bind(this)
    this.submitReviewUpdate = this.submitReviewUpdate.bind(this)
    this.state = {
      show_review: false,
      reviewed: "",
      submitted: false
    }
  }

  async componentDidMount() {
    // make request to check if this line_item has a review or not
    // if its been reviewed, set state "reviewed"
    // use this state to show an "edit review" button instead of a "leave review" button
    // if "edit review" has been selected, then show the same form but with a function for making a put request
    let checkIfReviewed = await checkIfReviewExists(this.props.line_item._id)
    this.setState({ reviewed: checkIfReviewed.data })
  }

  leaveReview() {
    this.setState({ show_review: !this.state.show_review, submitted: false })
  }

  submitReview(e) {
    e.preventDefault()
    const form_values = this.props.form[`line_item_${this.props.line_item._id}_review_form`].values
    const line_item = this.props.line_item
    const review = {
      rating: parseInt(form_values.rating),
      description: form_values.description,
      line_item: line_item,
      first_name: this.props.auth.first_name,
      _user_id: this.props.auth._id,
      _order_id: this.props.order_id
    }
    submitReview(review)
    this.setState({ submitted: true, show_review: false, reviewed: review })
  }

  submitReviewUpdate(e) {
    e.preventDefault()
    const form_values = this.props.form[`line_item_${this.props.line_item._id}_review_form`].values
    let review = this.state.reviewed
    review.description = form_values.description
    review.rating = form_values.rating
    updateReview(review)
    this.setState({ submitted: true, show_review: false, reviewed: review })
  }

  review_initial_values() {
    return updatedFormFields(this.fields, this.state.reviewed)
  }

  render() {
    let item = this.props.line_item
    return (
    <div>
      <div className="flex">
        <div>{item.product_name}</div>
        <button className="bare_button" onClick={this.leaveReview}> - {this.state.reviewed === "" ?  "Leave a review" : "Edit Review" }</button> 
      </div>
      {this.state.submitted === true ? <FontAwesomeIcon icon={faCheckCircle} /> : "" }
      {this.state.show_review ?
        <div>
          <Form 
            onSubmit={this.state.reviewed !== "" ? this.submitReviewUpdate : this.submitReview }
            submitButtonText={"Submit"}
            formFields={this.fields} 
            form={`line_item_${item._id}_review_form`}
            initialValues={this.state.reviewed === "" ? {} : this.review_initial_values()}
            validation={validatePresenceOnAll}
          />
        </div>
      : ""}
    </div>
    )
  }
}

function mapStateToProps({ form, auth }) {
  return { form, auth }
}

export default connect(mapStateToProps, null)(LineItem)