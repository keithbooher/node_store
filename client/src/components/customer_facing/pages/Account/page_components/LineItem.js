import React, { Component } from 'react'
import Form from "../../../../shared/Form"
import hf from "../../../../../utils/helperFunctions"

class LineItem extends Component {
  constructor(props) {
    super()
    this.leaveReview = this.leaveReview.bind(this)
    this.state = {
      show_review: false
    }
  }

  leaveReview() {
    this.setState({ show_review: true })
  }

  render() {
    console.log(this.props.line_item)
    let item = this.props.line_item
    return (
    <div>
      <div className="flex">
        <div>{item.product_name}</div>
        <button className="bare_button" onClick={this.leaveReview}> - Leave a review</button>
      </div>
      {this.state.show_review ?
        <div>
          <Form 
            onSubmit={this.handleSubmit}
            submitButtonText={"Submit"}
            formFields={[{ label: "", name: item.product_name, noValueError: ``, value: null }]} 
            formId={`line_item_${item._id}_review_form`}
            form={`line_item_${item._id}_review_form`}
            textArea={true}
          />
        </div>
      : ""}
    </div>
    )
  }
}


export default LineItem