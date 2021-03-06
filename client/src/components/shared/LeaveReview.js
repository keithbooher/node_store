import React, { Component } from 'react'
import { connect } from 'react-redux'
import FormModal from "./Form/FormModal"
import { updatedFormFields } from "../../utils/helpFunctions"
import { checkIfReviewExists, submitReview, updateReview } from '../../utils/API';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons"
import { validatePresenceOnAll } from "../../utils/validations"
class LeaveReview extends Component {
  constructor(props) {
    super()
    this.fields = [
      { label: "rating", field_class: "line_item_rating_input", name: "rating", typeOfComponent: "star-choice", noValueError: `` },
      { label: "Tell what you think about your purchase!", field_class: "line_item_rating_text_area", typeOfComponent: "text-area", name: "description", noValueError: `` },
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
    let checkIfReviewed = await this.props.checkIfReviewExists(this.props.line_item._id)
    this.setState({ reviewed: checkIfReviewed.data })
  }

  leaveReview() {
    this.setState({ show_review: !this.state.show_review, submitted: false })
  }

  submitReview() {
    const form_values = this.props.form[`line_item_${this.props.line_item._id}_review_form`].values
    const line_item = this.props.line_item
    let review = {
      rating: parseInt(form_values.rating),
      description: form_values.description,
      line_item: line_item,
      first_name: this.props.auth.first_name,
      _user_id: this.props.auth._id,
      _order_id: this.props.order_id
    }


    let date = new Date()
    const today = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()

    review.created_at = today

    this.props.submitReview(review)
    this.setState({ submitted: true, show_review: false, reviewed: review })
  }

  async submitReviewUpdate() {
    const form_values = this.props.form[`line_item_${this.props.line_item._id}_review_form`].values
    let review = this.state.reviewed
    review.description = form_values.description
    review.rating = form_values.rating

    let { data } = await this.props.updateReview(review)
    this.setState({ submitted: true, show_review: false, reviewed: data })
  }

  review_initial_values() {
    return updatedFormFields(this.fields, this.state.reviewed)
  }

  render() {
    let item = this.props.line_item
    return (
    <div>
      <div className="flex align-items-center">
        <button style={this.props.mobile ? { fontSize: "12px" } : { minWidth: "120px" }} className="margin-s-v" onClick={this.leaveReview}>{this.state.reviewed === "" ?  "Leave a review" : "Edit Review" }</button> 
        {this.state.submitted === true ? <FontAwesomeIcon icon={faCheckCircle} /> : "" }
      </div>
      {this.state.show_review ?
        <div>
          <FormModal 
            onSubmit={this.state.reviewed !== "" ? this.submitReviewUpdate : this.submitReview }
            submitButtonText={"Submit"}
            cancel={() => this.setState({ show_review: false })}
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

function mapStateToProps({ form, auth, mobile }) {
  return { form, auth, mobile }
}

const actions = { updateReview, checkIfReviewExists, submitReview }

export default connect(mapStateToProps, actions)(LeaveReview)