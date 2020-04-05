import React, { Component } from 'react'
import { connect } from 'react-redux'
import Form from "../../../../shared/Form"
import hf from "../../../../../utils/helperFunctions"
import API from '../../../../../utils/API';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons"

class LineItem extends Component {
  constructor(props) {
    super()
    this.fields = [
      { label: "rating", field_class: "line_item_rating_input", name: "rating", noValueError: ``, value: null },
      { label: "description", field_class: "line_item_rating_text_area", textArea: true, name: "description", noValueError: ``, value: null },
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
    let checkIfReviewed = await API.checkIfReviewExists(this.props.line_item._id)
    console.log(checkIfReviewed)
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
      _user_id: this.props.auth._id
    }
    console.log(review)
    API.submitReview(review)
    this.setState({ submitted: true, show_review: false, reviewed: review })
  }

  submitReviewUpdate(e) {
    e.preventDefault()
    const form_values = this.props.form[`line_item_${this.props.line_item._id}_review_form`].values
    let review = this.state.reviewed
    review.description = form_values.description
    review.rating = form_values.rating
    API.updateReview(review)
    this.setState({ submitted: true, show_review: false, reviewed: review })
    console.log('update bitch')
  }

  review_initial_values() {
    return hf.updatedFormFields(this.fields, this.state.reviewed)
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
            formId={`line_item_${item._id}_review_form`}
            form={`line_item_${item._id}_review_form`}
            initialValues={this.state.reviewed === "" ? {} : this.review_initial_values()}
          />
        </div>
      : ""}
    </div>
    )
  }
}

function mapStateToProps({ form }) {
  return { form }
}

export default connect(mapStateToProps, null)(LineItem)